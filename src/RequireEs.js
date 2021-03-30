import {getDefinitionArguments, getRequireArguments} from "./helpers/arguments.js";
import currentTagLoad from './helpers/currentTagLoad.js';
import Registry from './classes/Registry.js';
import Loaders from './classes/Loaders.js';
import {root} from "./require-global";
import {transformRJSPaths} from './helpers/requireJsTransformers.js';

export default class{

    constructor(options){
        this.registry = new Registry(options, this);
        this.options = options || {};
        this.amd = {};
        this.loaders = new Loaders(this);
    }

    define(){
        const {name, dependencies, factory} = getDefinitionArguments(arguments);
        //Carefull with jQuery: In general, explicitly naming modules in the define() call are discouraged, but jQuery has some special constraints.
        const isNamed = typeof name === 'string' && !(name==='jquery' && typeof factory === 'undefined');
        if(isNamed){
            const registryElement = {};
            registryElement[name] = {dependencies, factory};
            this.register(registryElement);
        }else{
            //if this is an anonymous define, confirm the currently loading script that loading is done...
            currentTagLoad.confirmDefine({dependencies, factory});
        }
    }

    get(){
        //todo: build in fail callback logic
        const {dependencies, callback, loadSinglePackage, options} = getRequireArguments(arguments);
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
            allScriptsLoaded.then(instances => callback.apply(root, instances));
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
        if(typeof options.paths !== 'undefined') transformRJSPaths(options.paths).forEach(this.register.bind(this));
        if(typeof options.allowRedefine !== 'undefined') this.options.allowRedefine = options.allowRedefine;
    }

    specified(packageName){
        if(typeof packageName === 'string'){
            const result = this.findOne(packageName);
            return result.match && result.match.isSpecified(result.attrs) || false;
        }
        return false;
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
        return requirees;
    }

}