import {constants} from "../require-global";
import VersionNumber from "./VersionNumber.js";

class RegistryAttributes{

    //['http://anyurl.com/mypackage.js', 'http://anyurl.com/mypackage.css']
    //or ({'mypackage': {version:'3.5.1', urls:['http://anyurl.com/mypackage.js', 'http://anyurl.com/mypackage.css'])
    //or ([{'mypackage': {version:'3.5.1', urls:['http://anyurl.com/mypackage.js', 'http://anyurl.com/mypackage.css']])
    //or ({'mypackage': {version:'3.5.1', urls:['http://anyurl.com/mypackage.js','http://anyalternativeurl.com/mypackage.js']}})
    //or ({mypackage@3.5.1:'http://anyurl.com/mypackage.js'})
    //or ({mypackage@3.5.1:['http://anyurl.com/mypackage.js','http://anyurl.com/mypackage.css']})
    //or ({mypackage:[
    //          {version:'3.5.1', url: 'http://anyurl.com/3.5.1/mypackage.js'},
    //          {version:'3.6.0', urls: ['http://anyurl.com/3.6.0/mypackage.js', 'http://anyurl.com/3.6.0/mypackage.css']}
    //    ]})
    //or ({mypackage: {version: '3.5.1', url: 'http://anyurl.com/mypackage.js'}}
    constructor(args){
        this.files = [];
        this._splitEachArgumentIntoSingleFiles(args);
    }

    //run through each of the arguments passed to the constructor, and create a flat list of files (1 per url)
    _splitEachArgumentIntoSingleFiles(args){
        for(let i=0; i < args.length; i++){
            const arg = args[i];
            const argType = typeof arg;
            if(argType === 'string'){
                this._addFile(arg);
            }else if(arg instanceof Array){
                this._splitArrayIntoSingleFiles(arg);
            }else if(argType === 'object'){
                this._splitObjectIntoSingleFiles(arg);
            }
        }
    };

    //if the the argument is an array, iterate through all array-elements
    //if the array element is a string (= url or packagename) add
    _splitArrayIntoSingleFiles(arr){
        arr.forEach(arrElement => {
            if(typeof arrElement === 'string'){
                this._addFile(arrElement);
            }else if(typeof arrElement === 'object' && arrElement !== null){
                this._splitObjectIntoSingleFiles(arrElement);
            }
        })
    }

    //run through each object key-value pair...
    //The key needs to be the packgename, the value needs to be the url(s), or config object
    _splitObjectIntoSingleFiles(obj){
        Object.keys(obj).forEach(packageName => {
            const objElement = obj[packageName];
            const objElementType = typeof obj[packageName];
            if(objElementType === 'string') {
                this._addFile(packageName, objElement); //format === {package: 'packageurl'}
            }else if(objElement instanceof Array){
                objElement.forEach(packageConfig => {
                    const packageConfigType = typeof packageConfig;
                    if(packageConfigType === 'string'){
                        this._addFile(packageName, packageConfig); //it's an array of urls; format === {package: [file1, file2, file3, ...]}
                    }else if(packageConfigType === 'object'){
                        this._splitPackageConfigObjectIntoFiles(packageName, packageConfig); //array of objects; format === {package: [{version: '', url: ''}, {...}]}
                    }
                })
            }else if(objElementType === 'object'){
                this._splitPackageConfigObjectIntoFiles(packageName, objElement);
            }
        });
    }

    //each config object can have 1 or more versions and 1 or more urls
    _splitPackageConfigObjectIntoFiles(packageName, obj){
        let {version, versions, url, urls, type, dependencies, factory} = obj;
        if(versions instanceof Array && versions.length > 0){
            versions.forEach(
                singleVersion => this._splitPackageConfigObjectIntoFiles(packageName, {...obj, version: singleVersion, versions: null})
            )
        }else{
            if(urls instanceof Array){
                urls.forEach(
                    singleUrl => this._splitPackageConfigObjectIntoFiles(packageName, {...obj, url: singleUrl, urls: null})
                )
            }else{
                this._addFile(packageName, url, version, type, dependencies, factory);
            }
        }
    }

    _addFile(packageName, url, version, type, dependencies, factory){
        if(packageName){
            //if there is no package-name, use the url without versionnumber
            if(typeof url === 'undefined') url = packageName.replace(constants.reVersionNumberAtEnd, '');
            //get the package filetype
            type = type || RegistryAttributes.guessType(packageName) || RegistryAttributes.guessType(url);
            const reCleanTypePrefixOnly = type ? new RegExp(`^${type}\!`) : '';
            const reCleanType = type ? new RegExp(`^${type}\!|\\\.${type}$`, 'g') : '';
            //try to get a versionnumber
            version = version || this._getVersionInfo(packageName, url);
            if(!(version instanceof VersionNumber)) version = new VersionNumber(version);
            //clean package-name and url
            this.files.push({
                name: packageName
                    .replace(constants.reFindVersionNumber, '')
                    .replace(reCleanType, '')
                    .replace(constants.reUrlWithoutProtocolNorSpecialCharacters, ''),
                url: typeof url === 'string' ? url
                    .replace(reCleanTypePrefixOnly, '') : false,
                version,
                type,
                dependencies,
                factory
            });
        }
    }

    _getVersionInfo(packageName, url){
        const versionFromPackageName = RegistryAttributes.getVersionString(packageName);
        if(versionFromPackageName === null || versionFromPackageName === 'default'){
            const versionFromUrl = RegistryAttributes.getVersionString(url);
            if(versionFromPackageName === 'default'){
                return versionFromUrl ? `${versionFromUrl}-default` : 'default';
            }else{
                return versionFromUrl;
            }
        }else{
            return versionFromPackageName;
        }
    }

    static getVersionString(value){
        //check the version-number is present in the url or packagename
        if(value){
            const version = value.match(constants.reFindVersionNumber);
            return (version && version.length===7) ? version[1] : null;
        }
    }

    //guess the filetype from the name or url
    static guessType(value){
        if(value){
            //remove version if present
            value = value.replace(constants.reFindVersionNumber, '');
            //first check if the filetype is provided in the name (html!myHtmlFragment)
            const indexOfExclamation = value.indexOf('!');
            if(indexOfExclamation > -1){
                return value.substr(0, indexOfExclamation);
            }else{
                //try to fetch a valid extension from the first urls
                const extension = constants.reExtension.exec(value);
                if(extension && extension.length===3) return extension[1];
            }
        }
    }

}

export default RegistryAttributes;
