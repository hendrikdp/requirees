import {getDefinitionArguments, getRequireArguments} from "./helpers/arguments.js";
import currentTagLoad from './helpers/currentTagLoad.js';
import Registry from './classes/Registry.js';
import RegistryAttributes from './classes/RegistryAttributes.js';
import Loaders from './classes/Loaders.js';
import Events from './classes/Events.js';
import {root, constants} from "./require-global";
import {transformRJSPaths} from './helpers/requireJsTransformers.js';

export default class{

    constructor(options){
        this.events = new Events();
        this.registry = new Registry(options, this);
        this.loaders = new Loaders(this);
        this.options = options || {};
        this.amd = {};
    }

    define(){
        const args = getDefinitionArguments(arguments);
        const {name, dependencies, factory} = args;
        this.events.publish(`${constants.events.ns}${constants.events.pre}${constants.events.define}`, {args});
        //Carefull with jQuery: In general, explicitly naming modules in the define() call are discouraged, but jQuery has some special constraints.
        const isNamed = typeof name === 'string' && !(name==='jquery' && typeof factory === 'undefined');
        //the module can be both be named AND registered.... In that case, register both!
        //try to defined the anonymous way (do not auto-invoke named modules, only the anonymous ones)
        const resultAnonymousDefine = this._defineAnonymousModule(dependencies, factory, isNamed);
        const resultNamedDefine = isNamed ? this._defineNamedModule(name, dependencies, factory) : null;
        this.events.publish(`${constants.events.ns}${constants.events.define}`, {args});
        return resultNamedDefine || resultAnonymousDefine;
    }

    _defineNamedModule(name, dependencies, factory){
        const registryElement = {};
        registryElement[name] = {dependencies, factory, url: false};
        return this.register(registryElement);
    }

    _defineAnonymousModule(dependencies, factory, preventAutoInvoke){
        //if this is an anonymous define, confirm the currently loading script that loading is done...
        const result = currentTagLoad.confirmDefine({dependencies, factory});
        if(!result.success && result.currentTag instanceof HTMLElement){
            //if no package was confirmed, but a defined function was present... let's register it:
            const registry = this._defineNamedModule(result.currentTag.src, dependencies, factory);
            if(!preventAutoInvoke && this.options.invokeNonMatchedDefines){
                const attrs = new RegistryAttributes([result.currentTag.src]);
                const pckgName = attrs.files?.[0]?.name;
                if(pckgName) this.get(pckgName);
            }
            return registry;
        }
    }

    get(){
        const {dependencies, callback, callbackFail, loadSinglePackage, options} = getRequireArguments(arguments);
        const targetInstances = dependencies.map(target => {
            let results = this.findOne(target);
            if(typeof results.match === 'undefined'){
                this.register(target, options);
                results = this.findOne(target);
            }
            return this.loaders.load(results, options);
        });
        const allScriptsLoaded = Promise.all(targetInstances);
        if(typeof callback === 'function'){
            allScriptsLoaded
                .then(instances => callback.apply(root, instances))
                .catch(err => callbackFail.apply(root, err));
        }
        return loadSinglePackage ? targetInstances[0] : allScriptsLoaded;
    }

    getPromise(){
        return new Promise(resolve => resolve(this.get.apply(this, arguments)));
    }

    register(){
        return this.registry.add.apply(this.registry, arguments);
    }

    find(){
        return this.registry.find.apply(this.registry, arguments);
    }

    findOne(){
        return this.registry.findOne.apply(this.registry, arguments);
    }

    config(options = {}){
        if(typeof options.paths !== 'undefined') transformRJSPaths(options.paths).forEach(m => this.register(m));
        if(typeof options.allowRedefine !== 'undefined') this.options.allowRedefine = options.allowRedefine;
        if(typeof options.invokeNonMatchedDefines !== 'undefined') this.options.invokeNonMatchedDefines =  options.invokeNonMatchedDefines;
        if(typeof options.shim === 'object') this.shim(options.shim);
    }

    specified(packageName){
        if(typeof packageName === 'string'){
            const result = this.findOne(packageName);
            return result.match && result.match.isSpecified(result.attrs) || false;
        }
        return false;
    }

    undef(packageName){
        if(typeof packageName === 'string'){
            const result = this.findOne(packageName);
            return result.match && result.match.undef(result.attrs);
        }
    }

    shim(config){
        Object.keys(config).forEach(packageName => {
            if(typeof packageName === 'string'){
                let result = this.findOne(packageName);
                if(typeof result.match === 'undefined'){
                    this.register({[packageName]: {url: false}});
                    result = this.findOne(packageName);
                }
                result.match?.shim(result.attrs, config[packageName]);
            }
        });
    }

    //returns the instance as a function
    asFunction(usePromises){
        const requirees = usePromises ? this.getPromise.bind(this) : this.get.bind(this);
        requirees.register = this.register.bind(this);
        requirees.find = this.find.bind(this);
        requirees.findOne = this.findOne.bind(this);
        requirees.loaders = this.loaders;
        requirees.define = this.define.bind(this);
        requirees.config = this.config.bind(this);
        requirees.specified = this.specified.bind(this);
        requirees.shim = this.shim.bind(this);
        requirees.undef = this.undef.bind(this);
        requirees.on = this.events.subscribe.bind(this.events);
        requirees.subscribe = this.events.subscribe.bind(this.events);
        requirees.unsubscribe = this.events.unsubscribe.bind(this.events);
        requirees.publish = this.events.publish.bind(this.events);
        requirees.addWireTap = this.events.addWireTap.bind(this.events);
        requirees.events = this.events;
        return requirees;
    }

}
