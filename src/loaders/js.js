import currentTagLoad from '../helpers/currentTagLoad.js';

function onScriptLoad(script, err){
    if(err) document.head.removeChild(script);
    currentTagLoad.cancelDefine(script, err);
}

export default function(url, version, versiontype){
    const script = document.createElement('script');
    script.charset = 'utf-8';
    script.async = true;
    script.addEventListener('error', () => onScriptLoad(script, `requirees: could not load ${url}`));
    script.addEventListener('load', () => onScriptLoad(script));
    script.src = url;
    script.version = version;
    script.versiontype = versiontype;

    if (script.src !== url) {
        const jsVersionUrls = version.filetypes['js']?.urls;
        const urlIndex = jsVersionUrls?.indexOf(url);
        jsVersionUrls?.splice(urlIndex, 1, script.src);
    }

    document.head.appendChild(script);
    return currentTagLoad.waitForDefine(script);
};
