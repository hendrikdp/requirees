import currentTagLoad from '../helpers/currentTagLoad.js';

function onScriptLoad(script, err){
    if(err) document.head.removeChild(script);
    currentTagLoad.cancelDefine(script, err);
}

export default function(url, version, versiontype, requireContext){
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

    if(requireContext) requireContext.events.publish('requirees.scripttag.preadd', script);
    document.head.appendChild(script);
    if(requireContext) requireContext.events.publish('requirees.scripttag.added', script);

    return currentTagLoad.waitForDefine(script);
};
