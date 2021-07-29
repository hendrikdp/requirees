const waitForDefine = function(tag){
    return new Promise((resolve, reject) => {
        tag.confirmDefine=resolve;
        tag.rejectDefine=reject;
    });
};

function confirmDefine({factory, dependencies}){
    const currentTag = _getCurrentTag() || {};
    if(_isWaitingForDefineConfirmation(currentTag)){
        currentTag.versiontype.dependencies = dependencies;
        currentTag.confirmDefine(factory);
        currentTag.confirmDefine = null;
        return {currentTag, success: true}
    }else{
        return {currentTag, success: false}
    }
}

function _isWaitingForDefineConfirmation(currentTag){
    return typeof currentTag.confirmDefine === 'function' &&
        currentTag.versiontype?.urls?.indexOf?.(currentTag.src) > -1;
}

function getCurrentVersion() {
    const currentTag = _getCurrentTag();
    return currentTag.version;
}

function _getCurrentTag(){
    if(document.currentScript){
        return document.currentScript;
    }else{
        const scripts = document.head.getElementsByTagName('script');
        return scripts[scripts.length-1];
    }
}

function cancelDefine(tag, err){
    if(err){
        if(typeof tag.rejectDefine === 'function') tag.rejectDefine();
    }else{
        if(typeof tag.confirmDefine === 'function') tag.confirmDefine(tag);
    }
}

export default {waitForDefine, confirmDefine, cancelDefine, getCurrentVersion};
