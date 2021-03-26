import {root} from '../require-global.js';
let domparser = null;

function parseHtml(txtHtml){
    if(!domparser) domparser = new DOMParser();
    const doc = domparser.parseFromString(txtHtml, 'text/html');
    if(doc.documentElement){
        if(txtHtml.indexOf('<body>')===-1){
            const nodes = doc.body && doc.body.children || [];
            return nodes.length === 1 ? nodes[0] : nodes;
        }else{
            return doc.documentElement;
        }
    }else{
        return txtHtml;
    }
}

function factoryRunner(factory){
    return typeof factory === 'string' ? parseHtml(factory) : factory;
}

function load(url, version, versiontype) {
    return new Promise(resolve => {
        root.require(`txt!${url}`, txtHtml => {
            resolve(parseHtml(txtHtml));
        });
    });
}

export default {load, factoryRunner};