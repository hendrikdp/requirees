import ReservedDependencies from './ReservedDependenciesHandlers.js';
import {constants} from "../require-global.js";

import css from '../loaders/css.js';
import txt from '../loaders/txt.js';
import html from '../loaders/html.js';
import xml from '../loaders/xml.js';
import js from '../loaders/js.js';
import json from '../loaders/json.js';
import tag from '../loaders/tag.js';
import wasm from '../loaders/wasm.js';

export default class{

    constructor(requireContext){
        this.requireContext = requireContext;
        this.reservedDependencies = new ReservedDependencies(requireContext);
        this.loaders = {};
        this.unloaders = {};
        this.factoryRunners = {};
        this.add('js', js);
        this.add('wasm', wasm);
        this.add('tag', tag);
        this.add('html', html);
        this.add('htm', html);
        this.add('xml', xml);
        this.add('txt', txt);
        this.add('json', json);
        this.add('css', css);
    }

    add(type, loader){
        if(typeof loader === 'object'){
            const fn = loader.load || loader.loader || loader.get;
            const fnUnload = loader.unload || loader.unloader || loader.remove || loader.delete;
            const fnFactory = loader.handleFactory || loader.factory || loader.factoryRunner || loader.factoryLoader;
            if(typeof fn === 'function') this.loaders[type] = fn;
            if(typeof fnUnload === 'function') this.unloaders[type] = fnUnload;
            if(typeof fnFactory === 'function') this.factoryRunners[type] = fnFactory;
        }else if(typeof loader === 'function'){
            this.loaders[type] = loader;
        }
    }

    get(type){
        return this.loaders[type] || this.loaders['js'];
    }

    load(searchResult={}, options={}){
        const attrs = searchResult.attrs;
        if(!searchResult.match){
            console.warn(`RequireEs - Oh fudge, we did not find any package '${attrs && attrs.name || '<unknown>'}' that matches version '${attrs && attrs.version && attrs.version.str || '<unknown>'}'`);
            return null;
        }else{
            let packageFiletypes = searchResult.match.filetypes;
            const type = attrs && attrs.type;
            if(type && packageFiletypes[type]){
                return this.loadTypeFromVersion(searchResult.match, type);
            }else{
                //download all the filetypes for this package... If waiting is needed, use promises, otherwise sync response (for cjs usage)
                let hasPromise = false;
                const instanceResolves =  Object.keys(packageFiletypes).map(type => {
                    const instanceResolver = this.loadTypeFromVersion(searchResult.match, type);
                    if(instanceResolver instanceof Promise) hasPromise = true;
                    return instanceResolver;
                });
                if(hasPromise){
                    return Promise.all(instanceResolves).then(this._returnMultiFiletypeLoad.bind(this, packageFiletypes, options));
                }else{
                    return this._returnMultiFiletypeLoad(packageFiletypes, options, instanceResolves);
                }
            }
        }
    }

    _returnMultiFiletypeLoad(packageFiletypes, options, allInstances){
        const arrPackageFiletypes = Object.keys(packageFiletypes);
        if(options.returnAll) {
            //return all the instances back... create an object with all loaded filetypes
            const returnObj = {};
            arrPackageFiletypes.forEach((key, i) => returnObj[key] = allInstances[i]);
            return returnObj;
        }else{
            // try to return the most obvious instance back as default
            // use the same order as in which the loaders are defined (js / wasm / tag / html /...)
            const loaderTypes = Object.keys(this.loaders);
            for(let iType=0; iType < loaderTypes.length; iType++){
                const loader = arrPackageFiletypes.indexOf(loaderTypes[iType]);
                if(loader > -1) return allInstances[loader];
            }
        }
    }

    loadTypeFromVersion(version, type){
        const versiontype = version.filetypes[type];
        this._publishEvt(`${constants.events.ns}${constants.events.pre}${constants.events.loadFile}`,{package: version.parent, versiontype, version});
        if(typeof versiontype === 'object' && versiontype !== null){
            if(typeof versiontype.exports !== 'undefined'){
                return versiontype.exports;
            }else if(versiontype.dfr instanceof Promise) {
                return versiontype.dfr;
            }else{
                return versiontype.dfr = new Promise((resolve, reject) => {
                    if(versiontype.factory){
                        this._resolveFactoryDependencies(resolve, version, type);
                    }else{
                        this._loadFromUrl(version, type).then(factory => {
                            versiontype.factory = factory;
                            this._resolveFactoryDependencies(resolve, version, type)
                        }).catch(reject);
                    }
                }).then(
                    instance => {
                        this._publishEvt(`${constants.events.ns}${constants.events.loadFile}`, {package: version.parent, instance, versiontype, version});
                        return instance;
                    }
                );
            }
        }
    }

    _publishEvt(evt, data){
        this.requireContext.events.publish(evt,data);
    }

    _resolveFactoryDependencies(resolve, version, type){
        const versiontype = version.filetypes[type];
        const dependencies = versiontype.dependencies instanceof Array ? versiontype.dependencies : [];
        const dependenciesExtra = versiontype.dependenciesExtra instanceof Array ? versiontype.dependenciesExtra : [];
        const dependenciesPreLoad = versiontype.dependenciesPreLoad instanceof Array ? versiontype.dependenciesPreLoad : [];
        const allDependencies = dependencies.concat(dependenciesExtra).concat(dependenciesPreLoad);
        const reservedDependencyNames = this.reservedDependencies.reservedDependencyNames;
        if(allDependencies.length){
            const loadingDependencies = allDependencies.map(dependency => {
                if(reservedDependencyNames.indexOf(dependency)>-1){
                    return this.reservedDependencies.get(dependency, versiontype);
                }else{
                    return this.requireContext.get(dependency);
                }
            });
            return Promise.all(loadingDependencies).then(deps => this._resolveFactory(resolve, version, type, deps));
        }else{
            return this._resolveFactory(resolve, version, type, []);
        }
    }

    _resolveFactory(resolve, version, type, deps){
        const versiontype = version.filetypes[type];
        let factoryResult;
        if(typeof this.factoryRunners[type] === 'function'){
            //with this type of file the factory data of the module needs post-processing (css factory data for instance)
            factoryResult = factoryResult = this.factoryRunners[type].call(version, versiontype.factory, version, versiontype,  deps);
        }else if(typeof versiontype.factory === 'function'){
            //this factory is a javascript function... execute it to know the factory result
            factoryResult = versiontype.factory.apply(version, deps);
        }else{
            //just serve the factory data as is to the module (for instance text)
            factoryResult = versiontype.factory;
        }
        if(typeof versiontype.exportsPreFactoryRun !== 'undefined') versiontype.exports = versiontype.exportsPreFactoryRun;
        if(typeof versiontype.exports === 'undefined'){
            if(typeof versiontype.postFactory === 'function') factoryResult = versiontype.postFactory(factoryResult);
            versiontype.exports = factoryResult;
        }
        resolve(versiontype.exports);
    }

    _getDownloadUrl(configuredUrl){
        const baseUrl = this._getBaseUrl();
        const applyBaseUrl = baseUrl && !constants.reIsAbsoluteUrl.test(configuredUrl);
        return applyBaseUrl ? (new URL(configuredUrl, baseUrl)).href : configuredUrl;
    }

    _getBaseUrl(){
        return this.requireContext?.options?.baseUrl;
    }

    _loadFromUrl(version, type, index=0){
        const loader = this.get(type);
        if(typeof loader === 'function'){
            const file = version.filetypes[type];
            const urls = file.urls;
            if(index < urls.length){
                const url = this._getDownloadUrl(urls[index]);
                try{
                    return this._waitForPreLoadDependencies(file)
                        .then(()=>loader(url, version, file));
                }catch(e){
                    return this._loadFromUrl(version, type,index+1);
                }
            }
        }
    }

    _waitForPreLoadDependencies(file){
        if(file.dependenciesPreLoad instanceof Array && file.dependenciesPreLoad.length > 0){
            return this.requireContext.getPromise(file.dependenciesPreLoad);
        }else{
            return Promise.resolve();
        }
    }

}
