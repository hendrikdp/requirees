//transforms the RequireJs paths format to RequireEs register format
// -> add js extensions if needed
// from: {paths: {react: 'https://foo.bar/react'}} to: [{name: 'react', url: 'https://foo.bar/react.js'}]
export function transformRJSPaths(packages){
    const requireEsFormat = [];
    if(typeof packages === 'object'){
        Object.keys(packages).forEach(packageName => {
            let urls = packages[packageName];
            if(typeof urls === 'string') urls = [urls];
            if(urls instanceof Array){
                urls.forEach(url => requireEsFormat.push({
                    [packageName]: doesUrlNeedJsExtention(url) ? `${url}.js` : url
                }));
            }
        });
    }
    return requireEsFormat;
}

function doesUrlNeedJsExtention(url){
    const reHasJsExtention = /\.js(\?.*)?$/
    return url.indexOf('!')===-1 && !reHasJsExtention.test(url);
}