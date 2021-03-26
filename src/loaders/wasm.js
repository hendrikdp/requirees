import {root} from '../require-global';

export default function(url, version){
    if(typeof root.WebAssembly === 'undefined'){
        console.warn(`Requirees: this browser does not support WebAssembly... Package ${version.parent.name} cannot be loaded`);
    }else{
        return fetch(url).then(resp => resp.arrayBuffer())
            .then(bytes => WebAssembly.instantiate(bytes))
            .then(result => result.instance.exports);
    }
}