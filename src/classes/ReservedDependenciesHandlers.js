import RequireEs from '../RequireEs.js';

export default class {

    constructor(){
        this._reservedDependencies = {};
        this.add('require', this.requireHandler.bind(this))
            .add('requirees', this.requireEsHandler.bind(this))
            .add('exports', this.exportsHandler.bind(this))
            .add('mdl', this.moduleHandler.bind(this))
    }

    add(handlerName, handler){
        if(typeof handler === 'function' && typeof handlerName === 'string'){
            this._reservedDependencies[handlerName] = handler;
        }
        return this;
    }

    get(handlerName, mdl) {
        const handler = this._reservedDependencies[handlerName];
        return handler ? handler(mdl) : null;
    }


    moduleHandler(mdl){
        mdl.uri = mdl.urls;
        mdl.id = mdl.parent?.name;
        if(typeof mdl.exports === 'undefined') mdl.exports = {};
        return mdl;
    }

    exportsHandler(mdl){
        if(typeof mdl.exports === 'undefined') mdl.exports = {};
        return mdl.exports;
    }

    requireHandler(mdl){
        if(mdl.require){
            return mdl.require;
        }else{
            const {require} = this._makeNewRequireEsContext(mdl);
            return require;
        }
    }

    requireEsHandler(mdl){
        if(mdl.requirees){
            return mdl.requirees
        }else {
            const {requirees} = this._makeNewRequireEsContext(mdl);
            return requirees;
        }
    }

    _makeNewRequireEsContext(mdl){
        const requireEs = new RequireEs();
        mdl.require = requireEs.asFunction(false);
        mdl.requirees = requireEs.asFunction(true);
        return {'requirees': mdl.requirees, 'require': mdl.require};
    }

    get reservedDependencyNames(){
        return Object.keys(this._reservedDependencies);
    }

}