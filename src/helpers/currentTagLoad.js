const waitForDefine = function(tag){
    return new Promise(res => tag.confirmDefine=res);
};

const confirmDefine = function({factory, dependencies}){
    const currentTag = _getCurrentTag();
    if(typeof currentTag.confirmDefine === 'function' && typeof currentTag.versiontype === 'object'){
        currentTag.versiontype.dependencies = dependencies;
        currentTag.confirmDefine(factory);
        currentTag.confirmDefine = null;
        return {currentTag, success: true}
    }else{
        return {currentTag, success: false}
    }
};

const getCurrentVersion = function() {
    const currentTag = _getCurrentTag();
    return currentTag.version;
};

const _getCurrentTag = function(){
    if(document.currentScript){
        return document.currentScript;
    }else{
        const scripts = document.head.getElementsByTagName('script');
        return scripts[scripts.length-1];
    }
};

const cancelDefine = function(tag){
    if(typeof tag.confirmDefine === 'function') tag.confirmDefine(tag);
};

export default {waitForDefine, confirmDefine, cancelDefine, getCurrentVersion};