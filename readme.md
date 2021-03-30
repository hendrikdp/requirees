[![codecov](https://codecov.io/gh/peter-vdc/requirees/branch/master/graph/badge.svg?token=16BBJ12T4U)](https://codecov.io/gh/peter-vdc/requirees)

# Require-es
## A microfrontend module loader

Require-es will:
* allow your micro-frontends to share dependencies
* help to find compatible package-versions

The project will be structured in 2 parts:
* provide a module loader which can:
    * load amd modules
    * register multiple versions of a single package
    * set default-versions
    * easily migrate from requirejs
    
* create a require-es-server, where:
    * packages can be registered
    * where usage of packages can be tracked
    
## Coming soon (under construction)
```js
//version indication in URL
require.register({
    react: {
        versions: ['0.14.9', '15.6.2', '15.6.1', '15.3.1'],
        url:'https://cdnjs.cloudflare.com/ajax/libs/react/${version}/react.min.js'
    }
});

//consume package (uses package 15.6.2)
require(['react@^15.6.0'], react => console.log(react.version));
```