[![codecov](https://codecov.io/gh/hendrikdp/requirees/branch/master/graph/badge.svg?token)](https://codecov.io/gh/hendrikdp/requirees)

# Require-es
[A microfrontend module loader](#intro)<br/>
[Installation](#install)<br/>
[Register a package](#register)<br/>
[Require a package](#require)<br/>
[Define a package](#define)<br/>
[RequireEs options](#options)<br/>
[Hook into RequireEs events](#events)

<a name="intro"/>

## A microfrontend module loader

Require-es will:
* allow your micro-frontends to share dependencies
* help to find compatible package-versions

The project will be structured in 2 parts:
* provide a module loader which can:
    * load amd modules
    * loads multiple filetypes: js / json / xml / txt / html / css / wasm
    * register multiple versions of a single package
    * set default-versions
    * easily migrate from requirejs
    * emits events to allow usage monitoring
    
* create a require-es-server, where:
    * packages can be registered
    * usage of packages can be tracked
    * module loads can be predicted
    * predictive http2-pushes are possible

<a name="install"/>

## Installation
Add the package to your project
```sh
npm install requirees --save
```
Serve the file in node_modules/requirees/build/requirees.js in the header of your webpage (9Kb Gzipped)
```html
<!DOCTYPE html>
<html>
    <head>
        <title>Pagetitle</title>
        <script src="scripts/requirees.js"></script>
    </head>
    <body></body>
</html>
```

## Register a package
To register a package you can use both:
* require.register() - syntax specifically for RequireEs
* require.config({paths}) - requirejs syntax

Both .register() and .config() can be called multiple times. Packages will only be added.

<a name="register"/>

### require.register() 
#### Usage
```js
require.register({
    packageName1(@)(version)(.filetype)(-default): [
        url(.filetype), url(.filetype),
        url(.filetype),
        ...
    ],
    packageName2(@)(version)(.filetype)(-default): {
        versions, 
        url, 
        urls
    }
});
```
PackageName: the name of the package you want to define<br/>
Version: the version-number of the package - major.minor(.patch)(.build)(-releaseCandidate)<br/>
Filetype: the extension of the file - js/css/txt/xml/json/html/wasm/tag<br/>
Default: indicate that this version should be used when no version is specified while requiring<br/>
Versions: array of versions to fill out in the URL (use placeholder ${version} in the url-string)<br/>
Url: single url string<br/>
Urls: when multiple filetypes need to be associated to the package (bootstrap.css, bootstrap.js)

> Note - RequireEs will try to identify the version number in the following order:
> * Is the 'versions' attribute present in the package-value
> * Is @version present in the package-name
> * Is a version present in the url (/17.0.2/)

#### Samples
```js
//register react, version '17.0.2'
require.register({react: 'https://cdnjs.cloudflare.com/ajax/libs/react/17.0.2/umd/react.production.min.js'});

//register react, versions '0.14.9', '15.6.2', '15.7.0', '16.14.0' (set as default), '17.0.2'
require.register({
    react: {
        versions: ['0.14.9', '15.6.2', '15.7.0'],
        url: 'https://cdnjs.cloudflare.com/ajax/libs/react/${version}/react.min.js'
    },
    'react@16.14.0-default': 'https://cdnjs.cloudflare.com/ajax/libs/react/16.14.0/umd/react.production.min.js',
    'react@17.0.2': 'https://cdnjs.cloudflare.com/ajax/libs/react/17.0.2/umd/react.production.min.js'
});

//register react, versions '15.7.0', '16.14.0', '17.0.2'
require.register({
    react: [
        'https://cdnjs.cloudflare.com/ajax/libs/react/15.7.0/react.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/react/16.14.0/umd/react.production.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/react/17.0.2/umd/react.production.min.js',
    ]
})

//register bootstrap, both css and js
require.register({
    bootstrap: [
        "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.4.1/js/bootstrap.min.js",
        "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.4.1/css/bootstrap.css",
        "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.6.0/js/bootstrap.bundle.min.js",
        "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.6.0/css/bootstrap.min.css"
    ]
});
```

### .config({paths})
RequireEs allows a soft transition from RequireJs to RequireEs. Therefor we try to follow the same syntax where possible: https://requirejs.org/

<a name="require"/>

## Require a package
### Usage
```js
//async await
const packageInstance = await require('packageName(@)(^)(~)(*)(version)(.filetype)');
//mulitple packages
const [pckg1, packg2] = await require([
    'pckg1(@)(^)(~)(*)(version)(.filetype)',
    'pckg1(@)(^)(~)(*)(version)(.filetype)'
]);

//cjs style (only works when a package is already loaded once, or in a defined factory)
const packageInstance = require('packageName(@)(^)(~)(*)(version)(.filetype)');

//using promises
requirees('packageName(@)(^)(~)(*)(version)(.filetype)').then(packageInstance);
//multiple packages
requirees([
    'pckg1(@)(^)(~)(*)(version)(.filetype)',
    'pckg1(@)(^)(~)(*)(version)(.filetype)'
]).then(
    ([pckg1, pckg2]) => {}
 );

//using callbacks
require(['packageName(@)(^)(~)(*)(version)(.filetype)'], package => {});
//multiple packages
require([
    'pckg1(@)(^)(~)(*)(version)(.filetype)',
    'pckg1(@)(^)(~)(*)(version)(.filetype)'
], (pckg1, pckg2) => {});

//without registration
await require(url);
```
PackageName: the name of the package you want to define<br/>
Version: the version-number of the package - major.minor(.patch)(.build)(-releaseCandidate)<br/>
Filetype: the extension of the file - js/css/txt/xml/json/html/wasm/tag. If no filetype is specified ALL filetypes will be loaded<br/>
*: load highest version<br/>
^: load highest minor<br/>
~: load highest patch<br/>

> Note - Determining the version number happens in this order
> * Find best version match, if a versionnumber is specified
> * Find the default, if no versionnumber is specified
> * Take the highest version number if no default, nor versionnumber are specified

> Note - If no filetype is specified all registered filetypes will download

### Samples
```js
//register bootstrap
require.register({
    bootstrap: [
        "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.4.1/js/bootstrap.min.js",
        "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.4.1/css/bootstrap.css",
        "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.6.0/js/bootstrap.bundle.min.js",
        "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.6.0/css/bootstrap.min.css"
    ]
})

//load both css & js from the highest available version (4.6.0)
const bootstrap = await require('bootstrap'); //4.6.0 will be the default (no default is set)
const bootstrap = await require('bootstrap@*'); //4.6.0 is the highest registered version

//load only the css tag from version 3.4.1
const bootstrapCssTag = await require('bootstrap.css@3.4.1'); //fixed version number

//load only the js tag from version 3.x
const bootstrapJs = await require('bootstrap.js@^3.0.0'); //find highest minor

//try to load bootstrap 3.4.2
const bootstrap = await require('bootstrap@3.4.2');
//will result in a console.warn("package not found");
//version 3.4.2 was not registered using define(), require.register, nor require.config({paths})

//download without registration
const bootstrap = await require('https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.6.0/js/bootstrap.bundle.min.js')
```

<a name="define"/>

## Define a package
### Usage (follows AMD-pattern)
```js
//named define
define(packageName(@)(version)(.filetype)(-default), [dependencies], factory);
//anonymous define
define([dependencies], factory);
```
PackageName: the name of the package you want to define<br/>
Version: the version-number of the package - major.minor(.patch)(.build)(-releaseCandidate)<br/>
Filetype: the extension of the file - js/css/txt/xml/json/html/wasm/tag<br/>
Default: indicate that this version should be used when no version is specified while requiring<br/>
Dependencies: package names (or urls) on which this package is dependent
Factory: function / json / text / HTMLElement / xml / ...

> Note - The dependency naming rules are equal to the require naming rules:<br/>
packageName(@)(^)(~)(*)(version)(.filetype) 

> Note - The datatype of the factory can be different depending on the filetype:
> * js: function
> * json: json-text (gets converted to JSON) / json-object
> * css: css-text (gets converted to a script-tag)
> * txt: text
> * xml: text
> * html: html-text (gets converted to an HTMLElement) / HTMLElement-object

### Samples
```js
//define an amd module
define('hello.js', ['react@^16.0.0'], (react) => {
   function fn1(){}
   return {fn1} 
});

//define a CJS module
define('hello.js', [], () => {
    const react = require('react');
    function fn1(){}
    module.exports = {fn1};
});

//define a json object
define('hello.json', [], '{"foo": "bar"}');

//define css
define('hello.css', [], 'body{background-color: red}');

//define a specific version of hello.css
define('hello.css@1.0.0', [], 'body{background-color: red}');

//define an html fragment
define('hello.html', ['hello.css@^1.0.0'], '<div>bla</div>'); //gets converted to an HTMLElement when required + will automatically add the CSS to the page
define('hello.html', [], document.createElement('div')); //alternative
```

<a name="options"/>

## RequireEs options (coming soon)
```js
/**
* 
*/
require.config({
    
});
```

<a name="events"/>

## Hook into RequireEs events (coming soon)

<a name="events"/>

## Custom elements support (coming soon)