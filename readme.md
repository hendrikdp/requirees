[![codecov](https://codecov.io/gh/hendrikdp/requirees/branch/master/graph/badge.svg?token)](https://codecov.io/gh/hendrikdp/requirees)

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

### Examples
In the example below we register:
* Boostrap v3.4.1
    * javascript (identified by the js-extension)
    * css (identified by the css-extension)
* Boostrap v4.6.0
    * javascript (identified by the js-extension)
    * css (identified by the css-extension)
```js
require.register({
	bootstrap: [
		"https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.4.1/js/bootstrap.min.js",
		"https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.4.1/css/bootstrap.css",
		"https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.6.0/js/bootstrap.bundle.min.js",
		"https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.6.0/css/bootstrap.min.css"
	]
})
```
To load all file-types (both javascript and css), you can run:
* await require('bootstrap') => downloads both css and javascript, version 4.6.0
* await require('bootstrap@^3.0.0') => downloads both css and javascript, version 3.4.1

Filetypes can be loaded separately using the following syntax:
* extension!packageName@version
* packageName.extension@version

3 ways to only add the css to the page for version 3.4.1:
```js
await require('bootstrap.css@^3.0.0');
requirees('bootstrap.css@^3.0.0').then(cssTag => console.log('bootstrap css tag', cssTag))
require(['bootstrap.css@^3.0.0'], cssTag => console.log('bootstrap css tag', cssTag));
```

