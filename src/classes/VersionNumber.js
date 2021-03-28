import {constants} from "../require-global";

class VersionNumber{

    constructor(version){
        const versionType = typeof version;
        if(versionType === 'string'){
            this.parse(version);
        }else if(versionType === 'object' && version !== null){
            const {tolerance, minor, major, patch, build, rc, isdefault, str} = version;
            this.tolerance = tolerance;
            this.minor = minor;
            this.major = major;
            this.patch = patch;
            this.build = build;
            this.rc = rc;
            this._isdefault = isdefault;
            this._str = str;
        }
    }

    parse(str){
        this._str = str.replace('-default', '');
        if(this._str === '*') this.tolerance = '*';
        const versionFragments = str.match(constants.reVersionNumber);
        if(str.indexOf('default')>-1) this._isdefault = true;
        if(versionFragments && versionFragments.length === 8){
            //check if this is a default package
            const indexOfDefault = versionFragments.indexOf('-default');
            if(indexOfDefault > -1) versionFragments.splice(indexOfDefault,1);
            //fill out the rest of the version object
            if(typeof versionFragments[1] === 'string') this.tolerance = versionFragments[1];
            this.major = VersionNumber.toNumber(versionFragments[2]);
            this.minor = VersionNumber.toNumber(versionFragments[3]);
            if(typeof versionFragments[4] === 'string') this.patch = VersionNumber.toNumber(versionFragments[4].substr(1));
            if(typeof versionFragments[5] === 'string') this.build = VersionNumber.toNumber(versionFragments[5].substr(1));
            if(typeof versionFragments[6] === 'string') this.rc = VersionNumber.toNumber(versionFragments[6].substr(1));
        }
    }

    static toNumber(str){
        const castedNum = Number(str);
        return isNaN(castedNum) ? str : castedNum;
    }

    get default(){
        return this._isdefault || false;
    }

    get str(){
        if(this._str) {
            return this._str;
        }else if(typeof this.major === 'undefined'){
            return 'anonymous';
        }else{
            const strTolerance = this.tolerance || '';
            const strPatch = typeof this.patch !== 'undefined' ? `.${this.patch}` : '';
            const strBuild = typeof this.build !== 'undefined' ? `.${this.build}` : '';
            const strRc = typeof this.rc !== 'undefined' ? `-${this.rc}` : '';
            return `${strTolerance}${this.major}.${this.minor}${strPatch}${strBuild}${strRc}`;
        }
    }

}

export default VersionNumber;