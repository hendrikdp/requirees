import currentTagLoad from '../helpers/currentTagLoad.js';

function onScriptLoad(script, err, onWindowError){
    window.removeEventListener('error', onWindowError);
    if(err){
        throw err;
        document.head.removeChild(script);
    }
    currentTagLoad.cancelDefine(script);
}

export default function(url, version, versiontype){
    let err;
    const onWindowError = evt => (evt.filename===url) ? err = evt.error : null;
    window.addEventListener('error', onWindowError);
    const script = document.createElement('script');
    script.charset = 'utf-8';
    script.async = true;
    script.addEventListener('error', () => onScriptLoad(script, `Error loading script: ${url}`, onWindowError));
    script.addEventListener('load', () => onScriptLoad(script, err, onWindowError));
    script.src = url;
    script.version = version;
    script.versiontype = versiontype;
    document.head.appendChild(script);
    return currentTagLoad.waitForDefine(script);
};