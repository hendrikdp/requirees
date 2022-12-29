import {constants} from '../require-global.js';

class WaitForRegistrationQueue{
    _queue=[];
    _require;

    constructor(_requireInstance) {
        this._require = _requireInstance;
        this._require.events.subscribe(
            `${constants.events.ns}${constants.events.register}`,
            this.processNewPackage.bind(this)
        );
    }

    queue(target, searchAttrs, options){
        return new Promise(resolve => this._queue.push({target, searchAttrs, options, resolve}));
    }

    processNewPackage(registrationArgs){
        //loop through queue and reduce the elements that are matched
        if(this._queue.length){
            this._queue = this._queue.reduce((acc, queueElement) => {
                const {target, searchAttrs, options, resolve} = queueElement;
                try{
                    if(searchAttrs.name === registrationArgs.package.name){
                        const version = this._require.findOne(target);
                        if(version.match){
                            this._require.getPromise(target, options).then(resolve);
                        }else{
                            acc.push(queueElement);
                        }
                    }else{
                        acc.push(queueElement);
                    }
                }catch(e){
                    console.warn(`RequireEs - Something went wrong while loading package from queue`, e, target);
                }
                return acc;
            }, []);
        }

    }

}

export default WaitForRegistrationQueue;