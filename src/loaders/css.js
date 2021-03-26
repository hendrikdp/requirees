function factoryRunner(factory){
    if(typeof factory === 'string'){
        const style = document.createElement('style');
        style.innerText = factory;
        return document.head.appendChild(style);
    }
}

function load(url, version, versiontype){
    return new Promise(resolve => {
        const link = document.createElement('link');
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = url;
        link.onload = resolve.bind(version, link);
        document.head.appendChild(link);
    });
}

export default {load, factoryRunner}