import {root} from '../require-global.js';

class CustomElementController{

    constructor(version){
        this.version = version;
        this.name = version.parent.name;
    }

    getAll(){
        return document.querySelectorAll(this.name);
    }

}

function registerCustomElement(factory, version){
    if(typeof factory === 'function'){
        factory.prototype.getAssociatedVersion = function(){
            return version;
        };
        customElements.define(version.parent.name, factory);
        return new CustomElementController(version);
    }else{
        console.warn('RequireEs: Custom elements should be functions (or classes) extended from any HTMLElement');
        return {error: 'Not a valid custom element factory'};
    }
}

function factoryRunner(factory, version){
    return factory instanceof CustomElementController ? factory : registerCustomElement(factory, version);
}

function load(url, version, versiontype){
    return new Promise(resolve => {
        root.require(url, CustomNode => resolve(registerCustomElement(CustomNode, version)));
    });
}

export default {load, factoryRunner}
