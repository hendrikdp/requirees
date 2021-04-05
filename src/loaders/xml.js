import {root} from '../require-global.js';
let domparser = null;

function parseXml(txt){
    if(!domparser) domparser = new DOMParser();
    return domparser.parseFromString(txt, 'application/xml');
}

function factoryRunner(factory){
    return typeof factory === 'string' ? parseXml(factory) : factory;
}

function load(url, version, versiontype){
    return new Promise(resolve => {
        root.require(`txt!${url}`, txtXml => resolve(parseXml(txtXml)));
    });
}

export default {factoryRunner, load};