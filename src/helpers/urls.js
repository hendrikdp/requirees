//convert relative urls (./ ../)
import {constants} from "../require-global";

//join relative paths
function pathJoin(base, url) {
    const baseParts = base.split('/');
    const urlParts =  url.split('/');
    if(baseParts[baseParts.length - 1]!=='') baseParts.pop();
    const parts = baseParts.concat(urlParts);
    const newParts = parts.reduce((acc,part,i) => {
        const ignore = !part || part === ".";
        if(!ignore){
            if (part === "..") acc.pop();
            acc.push(part);
        }
        return acc;
    }, []);
    // Preserve the initial slash if there was one.
    if (parts[0] === "") newParts.unshift("");
    return newParts.join("/") || (newParts.length ? "/" : ".");
}

export function convertRelativeUrls(urls, parentModuleName){
    return urls.map(url => url.charAt(0)==='.' ? normalizeRelativeUrl(url, parentModuleName) : url);
}

//normalize the relative urls (only if a valid extention is provided), otherwise treat it as a package name (RequireJs)
function normalizeRelativeUrl(url, parentModuleName){
    if(parentModuleName){
        return pathJoin(parentModuleName, url);
    }else{
        //todo: remove below with a dynamic list! (use loader registration)
        const ALLOWED_EXTENTIONS = ['css', 'js', 'html', 'htm', 'json', 'tag', 'txt', 'wasm', 'xml'];
        const urlFragments = url.match(constants.reExtension);
        if(ALLOWED_EXTENTIONS.indexOf(urlFragments?.[1]) > -1){
            const currentScriptUrl = getCurrentScriptLocation();
            const absUrl = new URL(url, currentScriptUrl);
            return absUrl.href;
        }else{
            //remove the ./ if no allowed extension is provided
            return url.replace(/^\.\//, '');
        }
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

//substitute path if needed
export function pathSubstitution(path, substitutions){
    if(substitutions && typeof substitutions === 'object'){
        const keys = Object.keys(substitutions);
        for(let i=0; i < keys.length; i++){
            if(path.startsWith(keys[i])) return path.replace(keys[i], substitutions[keys[i]]);
        }
    }
}
