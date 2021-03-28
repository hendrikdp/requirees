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
        if(!options.url) options.url = '';
        if(options.url.indexOf('${')>-1){
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

    _processFileType(options){
        options.type = options.type || RegistryAttributes.guessType(options.url) || 'js';
        if(!(typeof this.filetypes[options.type] === 'object')) this.filetypes[options.type] = {urls:[]};
        if(typeof options.factory !== 'undefined') this.filetypes[options.type].factory = options.factory;
        if(options.dependencies instanceof Array) this.filetypes[options.type].dependencies = options.dependencies;
        if(this.filetypes[options.type].urls.indexOf(options.url)===-1) this.filetypes[options.type].urls.push(options.url);
        return this.filetypes[options.type];
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