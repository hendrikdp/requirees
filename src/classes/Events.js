import {constants} from '../require-global.js';

export default class{

    constructor(){
        this.register = {};
    }

    subscribe(evt, callback){
        if(!(this.register[evt] instanceof Array)) this.register[evt] = [];
        this.register[evt].push(callback);
        return `${evt}[${this.register[evt].length - 1}]`;
    }

    unsubscribe(key){
        try {
            const keyFragments = key.match(constants.events.resolve.regexp);
            const fnName = keyFragments[constants.events.resolve.fnName];
            const fnIndex = keyFragments[constants.events.resolve.fnIndex];
            if(typeof fnIndex === 'undefined'){
                delete this.register[fnName];
            }else{
                delete this.register[fnName][fnIndex];
            }
        }catch(e){
            console.warn(`RequireEs: we could not unsubscribe from ${key}`, e);
        }
    }

    publish(evt, payload){
        const evts = this.register[evt] instanceof Array ? this.register[evt] : [];
        const evtsAndWireTaps = evts.concat(this.register[constants.events.wireTapEventName]);
        evtsAndWireTaps.forEach(fn => {
            try{
                if(typeof fn === 'function') fn(payload, evt);
            }catch(e){
                console.error(`RequireEs: Error while executing a function in ${evt}`, e)
            }
        });
    }

    addWireTap(fn){
        return typeof fn === 'function' ? this.subscribe(constants.events.wireTapEventName, fn) : null;
    }

}