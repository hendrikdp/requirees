function factoryRunner(factory){
    return typeof factory === 'string' ? JSON.parse(factory) : factory;
}

function load(url){
    return fetch(url).then(r => r.json());
}

export default {load, factoryRunner}