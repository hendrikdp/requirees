function factoryRunner(factory){
    if(typeof factory === 'string'){
        const style = document.createElement('style');
        style.innerText = factory;
        return document.head.appendChild(style);
    }
}

function load(url, version, versiontype, requireContext){
    return new Promise(resolve => {
        const link = document.createElement('link');
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = url;
        link.onload = resolve.bind(version, link);
        if(requireContext) requireContext.events.publish('requirees.styletag.preadd', link);
        document.head.appendChild(link);
        if(requireContext) requireContext.events.publish('requirees.styletag.added', link);
    });
}

export default {load, factoryRunner}
