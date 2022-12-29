import {root, constants} from '../require-global.js';
import {convertRelativeUrls} from "./urls.js";

//handle the amd define arguments
function getDefinitionArguments(args){
    const defineArguments = {};
    for(let iArg=0; iArg < args.length; iArg++) {
        const arg = args[iArg];
        if(typeof arg==='string' && !defineArguments.name){
            defineArguments.name = arg;
        }else if(arg instanceof Array && !defineArguments.dependencies){
            defineArguments.dependencies = convertRelativeUrls(arg, defineArguments.name);
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
