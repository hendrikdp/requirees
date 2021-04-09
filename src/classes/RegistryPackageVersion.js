import {root, constants} from '../require-global.js';
import RegistryAttributes from "./RegistryAttributes.js";

export default class{

    constructor(options, parent){
        this.parent = parent;
        this.major = options.version.major;
        this.minor = options.version.minor;
        this.patch = options.version.patch;
        this.build = options.version.build;
        this.rc = options.version.rc;
        this.str = options.version.str || this._getVersionStr();
        this.filetypes = {};
    }

    addFileType(options){
        const that = this;
        const version = that.str;
        //at this point only one url should be registered at a time...
        if(!options.url && options.urls instanceof Array) options.url = options.urls[0];
        if(options.url && options.url.indexOf('${')>-1){
            try{
                return this._processFileType({...options, url: new Function(['version', 'obj'],"return `" + options.url + "`")(version, that)});
            }catch(e){
                console.warn('Error parsing registry URL', e);
            }
        }else{
            return this._processFileType(options);
        }
    }

    loadFileType(filetype){
        if(this.filetypes[filetype]){
            return root.requirees.loaders.loadTypeFromVersion(this, filetype);
        }else{
            console.warn(`RequireEs: There is no ${filetype}-file present in package ${this.parent.name} (version ${this.str})`);
        }
    }

    //check if the files for this packages are all loaded and ready to go
    isSpecified(filetype){
        const sFiletype = filetype?.type || filetype;
        if(typeof sFiletype === 'string'){
            const loadedFileType = this.filetypes[sFiletype];
            return loadedFileType?.hasOwnProperty('exports') || false;
        }else{
            const filetypes = Object.keys(this.filetypes);
            for(let i=0; filetypes.length > i; i++){
                if(this.filetypes[filetypes[i]].hasOwnProperty('exports')===false) return false;
            }
            return true;
        }
    }

    //load dependencies or define exports
    shim(filetype, shimConfig) {
        if(typeof shimConfig !== 'object') return;
        let sFiletype = filetype?.type || filetype;
        if(typeof sFiletype !== 'string') sFiletype = 'js';
        const file = this.filetypes[sFiletype];
        if(file){
            if(shimConfig.deps instanceof Array) this._addShimDependencies(file, shimConfig.deps);
            if(typeof shimConfig.exports === 'string') file.postFactory = () => root[shimConfig.exports];
            if(typeof shimConfig.exports === 'function') file.postFactory = shimConfig.exports();
        }
    }

    //multiple shim calls can add multiple dependencies
    _addShimDependencies(file, dependencies){
        if(!(file.dependenciesShim instanceof Array)) file.dependenciesShim = [];
        if(dependencies instanceof Array){
            dependencies.forEach(dep => {
                if(typeof dep === 'string' && file.dependenciesShim.indexOf(dep) > -1) file.dependenciesShim.push(dep);
            });
        }
    }

    //add urls, add factory, create filetype, ...
    _processFileType(options){
        options.type = options.type || RegistryAttributes.guessType(options.url) || 'js';
        if(typeof this.filetypes[options.type] !== 'object') this.filetypes[options.type] = {urls:[]};
        const fileToProcess = this.filetypes[options.type];
        if(typeof options.factory !== 'undefined') this._setFactory(options.factory, fileToProcess);
        if(options.dependencies instanceof Array) fileToProcess.dependencies = options.dependencies;
        if(typeof options.url === 'string' && fileToProcess.urls.indexOf(options.url)===-1) fileToProcess.urls.unshift(options.url);
        return fileToProcess;
    }

    //sets the factory for a certain filetype (if allowed)
    _setFactory(factory, file){
        if(this._canBeDefined(file)){
            delete file.dfr;
            delete file.exports;
            file.factory = factory;
        }else{
            console.warn(`RequireEs - Computer says no: package ${this.parent.name} - ${this.str} is already defined... Redefining this package is not allowed!`);
        }
    }

    //get the general settings from requirees.config()
    _getRequireEsConfigOptions(){
        return this.parent?.parent?.parent?.options;
    }

    //check if the package can be defined or redefined
    _canBeDefined(file){
        if(file.hasOwnProperty('exports')){
            const requireEsConfig = this._getRequireEsConfigOptions();
            return requireEsConfig.allowRedefine || false;
        }else{
            return true;
        }
    }

    _getVersionStr(){
        this.str = constants.versionFormat.map(fragmnt => fragmnt !== 'rc' && this[fragmnt]).filter(fragmnt => typeof fragmnt === 'number' || typeof fragmnt ==='string').join('.');
        if(typeof this.rc !== 'undefined' && this.rc !== null && this.rc !== "") this.str += `${typeof this.rc==='string' ? '-' : '.'}${this.rc}`;
        return this.str;
    }

    test(version){
        const tolerance = version.tolerance;
        if(tolerance === '*'){
            return true
        }else if(tolerance === '^'){
            return this.major === version.major;
        }else if(tolerance === '~'){
            return this.major === version.major && this.minor === version.minor;
        }else{
            //exact match
            for(let iFrag=0; iFrag < constants.versionFormat.length; iFrag++) {
                const fragmnt = constants.versionFormat[iFrag];
                if(!tolerance && (this[fragmnt]||0) !== (version[fragmnt]||0)){
                    return false;
                }
            }
            //if any tolerance was given >> return false ... else true
            return Boolean(!tolerance);
        }
    }

    toJson(){
        const version = {
            filetypes: this.filetypes,
            major: this.major,
            minor: this.minor,
            str: this.str
        };
        if(typeof this.patch !== 'undefined') version.patch = this.patch;
        if(typeof this.build !== 'undefined') version.build = this.build;
        if(typeof this.rc !== 'undefined') version.rc = this.rc;
        return version;
    }

}