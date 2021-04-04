import Package from './RegistryPackage.js';
import Attributes from './RegistryAttributes.js';
import {constants} from '../require-global.js';

export default class{

    constructor(options, parent){
        this.parent = parent;
        this.options = options;
        this.packages = {};
    }

    //add packages
    add(){
        //one package can have multiple js, css, wasm, ... sources... if multiple urls are provided, split them further up, per type
        const {files} = new Attributes(arguments);
        //loop through files and add to the packages one by one
        if(files instanceof Array){
            files.forEach(file =>{
                this._publish(`${constants.events.ns}${constants.events.pre}${constants.events.register}`, {file});
                if(!this.packages[file.name]){
                    this.packages[file.name] = new Package(file, this);
                }
                this.packages[file.name].add(file);
                this._publish(`${constants.events.ns}${constants.events.register}`, {package: this.packages[file.name], file});
            });
        }
        this.sort(); //sort the packages to be easily searchable
        return this; //make chainable
    }

    _publish(evtName, data){
        this.parent?.events?.publish(evtName, data);
    }

    //sort all packages on version number
    sort(){
        Object.keys(this.packages).forEach(pckg => this.packages[pckg].sort());
    }

    //remove a package
    remove(){
        const attrs = new Attributes(arguments);
        const match = this.find(attrs);
        if(match){
            if(match.pckg.length() === match.versions.length){
                //all versions need to be delete => remove the complete package
                delete this.packages[match.pckg.name];
            }else{
                //delete only the pakcages which are found
                match.pckg.delete(match.versions);
            }
        }
        return this;
    }

    //find all matching packages
    find(){
        const {files} = new Attributes(arguments);
        return files instanceof Array ? this._find(files[0], false) : [];
    }

    //find the first match
    findOne(){
        const {files} = new Attributes(arguments);
        return files instanceof Array ? this._find(files[0], true) : null;
    }

    //internal find in registry logic
    _find(attrs, findOne){
        const pckg = this.packages[attrs.name];
        if(pckg){
            let foundPackages;
            const results = {pckg, attrs};
            if(constants.returnDefaultOnVersionStr.indexOf(attrs.version.str)>-1 && pckg.default){
                foundPackages = findOne ? pckg.default : [pckg.default];
            }else{
                const targetVersion = (attrs.version && typeof attrs.version.major !== 'undefined') ? attrs.version : {tolerance: '*'};
                foundPackages = pckg[findOne ? 'findOne' : 'find'](targetVersion);
            }
            results[`match${findOne ? '' : 'es'}`] = foundPackages;
            return results;
        }else{
            return {attrs};
        }
    }

    //return registry to json
    toJson(){
        const registry = {};
        Object.keys(this.packages).forEach(pckg => registry[pckg] = this.packages[pckg].toJson());
        return registry;
    }

}