import {root, constants} from '../require-global';

//handle the amd define arguments
function getDefinitionArguments(args){
    const defineArguments = {};
    for(let iArg=0; iArg < args.length; iArg++) {
        const arg = args[iArg];
        if(typeof arg==='string' && !defineArguments.name){
            defineArguments.name = arg;
        }else if(arg instanceof Array && !defineArguments.dependencies){
            defineArguments.dependencies = convertRelativeUrls(arg);
        }else{
            defineArguments.factory = arg;
        }
    }
    //check for commonjs dependencies if dependencies are missing
    if(!(defineArguments.dependencies instanceof Array)){
        defineArguments.dependencies = [];
        if(typeof defineArguments.factory === 'function') getDependenciesFromFactory(defineArguments);
    }
    //expose defined module
    return defineArguments
}

//convert relative urls (./ ../)
function convertRelativeUrls(urls){
    return urls.map(url => url.charAt(0)==='.' ? normalizeRelativeUrl(url) : url);
}

//normalize the relative urls (only if a valid extention is provided), otherwise treat it as a package name (RequireJs)
function normalizeRelativeUrl(url){
    //todo: remove below with a dynamic list! (use loader registration)
    const ALLOWED_EXTENTIONS = ['css', 'js', 'html', 'htm', 'json', 'tag', 'txt', 'wasm', 'xml'];
    const urlFragments = url.match(constants.reExtension);
    //remove the ./ if no allowed extension is provided
    if(ALLOWED_EXTENTIONS.indexOf(urlFragments?.[1]) > -1){
        const currentScriptUrl = getCurrentScriptLocation();
        const absUrl = new URL(url, currentScriptUrl);
        return absUrl.href;
    }else{
        return url.replace(/^\.\//, '');
    }
}

//get the location of the current script
function getCurrentScriptLocation(){
    const baseUrl = document.currentScript?.src;
    if(baseUrl) {
        return baseUrl;
    }else{
        const scripts= document.getElementsByTagName('script');
        return scripts[scripts.length-1]?.src;
    }
}

//find all require() statements and push these as dependencies (to support cjs modules)
function getDependenciesFromFactory(defineArguments){
    defineArguments.factory.toString()
        .replace(constants.reComments, '')
        .replace(constants.reCjsRequireCalls, (match, dep) => defineArguments.dependencies.push(dep))
}

//parse the arguments comming into require method
function getRequireArguments(args){
    const requireArguments = {};
    for(let iArg=0; iArg < args.length; iArg++){
        const arg = args[iArg];
        if(arg instanceof Array){
            requireArguments.dependencies = arg;
        }else if(typeof arg==='string' && !requireArguments.dependencies){
            requireArguments.dependencies = [arg];
            requireArguments.loadSinglePackage = true;
        }else if(typeof arg ==='function'){
            if(typeof requireArguments.callback === 'undefined'){
                requireArguments.callback = arg;
            }else if(typeof requireArguments.callbackFail === 'undefined'){
                requireArguments.callbackFail = arg;
            }
        }else if(typeof arg==='object'){
            requireArguments.options = arg;
        }
    }
    //expose targets and callback
    return requireArguments;
}

//expose require arguments and definition arguments
export {getDefinitionArguments, getRequireArguments}
