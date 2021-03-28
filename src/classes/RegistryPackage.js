import Version from './RegistryPackageVersion.js';
import {constants} from "../require-global.js";

export default class{

    constructor(options){
        this.versions = [];
        this.isDirty = false;
        this.name = options.name;
    }

    find(versionObj){
        return this.versions.filter(version => version.test(versionObj));
    }

    findOne(versionObj){
        for(let version of this.versions){
            if(version instanceof Version && version.test(versionObj)) return version;
        }
        return null;
    }

    remove(versionsToDelete){
        if(!(versionsToDelete instanceof Array)) versionsToDelete = [versionsToDelete];
        this.versions = this.versions.filter(version => versionsToDelete.indexOf(version)===-1);
        return this;
    }

    length(){
        return this.versions.length;
    }

    //add possible multiple versions to this package
    add(options){
        if(options.version && typeof options.version.tolerance !== 'undefined') delete options.version.tolerance;
        let target = this.findOne(options.version);
        if(!(target instanceof Version)){
            target = new Version(options, this);
            this.versions.push(target);
            this.isDirty = true;
            if(typeof options.sort==='boolean' ? options.sort : true) this.sort(options);
        }
        target.addFileType(options);
        if(options.version.default) this.default = target;
        return target;
    }

    sort(options){
        if(this.isDirty){
            this.versions = this.versions.sort((a,b)=>{
                for(let iFragment=0; iFragment < constants.versionFormat.length; iFragment++){
                    const fragmnt = constants.versionFormat[iFragment];
                    if(a[fragmnt]!==b[fragmnt]) return  a[fragmnt] < b[fragmnt] ? 1 : -1
                }
            });
        }
        this.isDirty = false;
        return this;
    }

    toJson(){
        return this.versions.map(version => version.toJson());
    }
}