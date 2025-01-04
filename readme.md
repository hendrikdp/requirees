[![codecov](https://codecov.io/gh/hendrikdp/requirees/branch/master/graph/badge.svg?token)](https://codecov.io/gh/hendrikdp/requirees)

# Require-es
[A microfrontend module loader](#intro)<br/>
[Installation](#install)<br/>
[Migration from RequireJs](#migrage)<br/>
[Register a package](#register)<br/>
[Require a package](#require)<br/>
[Override amd dependencies](#overrideDependencies)<br/>
[Require.when - ONLY load after explicit define/register](#requireWhen)<br/>
[Define a package](#define)<br/>
[RequireEs options](#options)<br/>
[RequireEs events](#events)<br/>
[WebPack / Rollup bundling for RequireEs](#webpack)<br/>
[Custom elements support](#custom)

<a id="intro"/>

## A microfrontend module loader

Require-es will:
* allow micro-frontends to share dependencies
* help finding compatible package-versions

The project will be structured in 3 parts:

* provide a module loader which:
    * loads amd modules
    * loads multiple filetypes: js / json / xml / txt / html / css / wasm
    * registers multiple versions of a single package
    * can set default-versions
    * easily migrates from RequireJs
    * emits events to allow usage monitoring
    
* create a require-es-server, where:
    * packages can be registered
    * usage of package-version can be tracked
    * module loading can become predictable
    * predictive http2-pushes are possible
    
* create a webpack/rollup loader

<a id="install"/>

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

<a id="migrate"/>

## Migration from RequireJs
RequireEs allows a soft transition from RequireJs.
This means that most syntax of RequireJs, is also supported in RequireEs:
* define(packageName, [dependencies], factory);
* define([dependencies], factory);
* require(['packageName'], packageInstance => {});
* requirejs(['packageName'], packageInstance => {});
* require('packageName');
* requirejs.config({paths});

In a later version, require.config({shim}) will be supported as well. 

More info on RequireJs: https://requirejs.org/

<a id="register"/>

## Register a package

### Usage
```js
require.register({
    packageName1(@)(version)(.filetype)(-default): [
        url(.filetype),
        url(.filetype),
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

Key | Description
--- | ---
PackageName | the name of the package
Version | the version-number in string format: major.minor(.patch)(.build)(-releaseCandidate)
Filetype | the file-extension - js/css/txt/xml/json/html/wasm/tag
Default | indicates the default version
Versions | array of versions to fill out in the URL (use placeholder ${version} in the url-string)
Url | single url string
Urls | multiple urls for 1 package

> Note - Determining the version number, happens in this order:
> * Is a 'versions' attribute present in the package-value
> * Is '@version' present in the package-name
> * Is a version present in the url (cdnjs.com/17.0.2/package.js)

### Samples
```js
//register react, version '17.0.2'
require.register({
    react: 'https://cdnjs.cloudflare.com/ajax/libs/react/17.0.2/umd/react.production.min.js'
});

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
});

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

<a id="require"/>

## Require a package
### Usage
```js
//async await
const packageInstance = await require('packageName(@)(^)(~)(*)(version)(.filetype)');
//mulitple packages
const [pckg1, packg2] = await require([
    'pckg1(@)(^)(~)(*)(version)(.filetype)',
    'pckg2(@)(^)(~)(*)(version)(.filetype)'
]);

//cjs style (only works when a package is already loaded once, or in a defined factory)
const packageInstance = require('packageName(@)(^)(~)(*)(version)(.filetype)');

//using promises
requirees('packageName(@)(^)(~)(*)(version)(.filetype)').then(packageInstance);
//multiple packages
requirees([
    'pckg1(@)(^)(~)(*)(version)(.filetype)',
    'pckg2(@)(^)(~)(*)(version)(.filetype)'
]).then(
    ([pckg1, pckg2]) => {}
 );

//using callbacks
require(['packageName(@)(^)(~)(*)(version)(.filetype)'], package => {});
//multiple packages
require([
    'pckg1(@)(^)(~)(*)(version)(.filetype)',
    'pckg2(@)(^)(~)(*)(version)(.filetype)'
], (pckg1, pckg2) => {});

//without registration
await require(url);
```

Key | Description
--- | ---
PackageName | the name of the package
Version | the version-number in string format: major.minor(.patch)(.build)(-releaseCandidate)
Filetype | the file-extension - js/css/txt/xml/json/html/wasm/tag; if no filetype is specified ALL filetypes will be loaded
* | load highest version
^ | load highest minor-version
~ | load highest patch-version

> Note - Determining the version number happens in this order
> * Find best version match, if any versionnumber is specified
> * Find the default, if no versionnumber is specified
> * Take the highest version number if no default, nor versionnumber are specified

> Note - If no filetype is specified all registered filetypes will be loaded

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
//4.6.0 will be the default (no default is set)
const bootstrap = await require('bootstrap');
//4.6.0 is the highest registered version
const bootstrap = await require('bootstrap@*');

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

### Require using option
#### Syntax
```js
await require('packageName(@)(^)(~)(*)(version)(.filetype)', options);
//or
require('packageName(@)(^)(~)(*)(version)(.filetype)', successFn, failFn, options);
```
#### Options
Option | Description
--- | ---
loadTimeout | timeout before a require-call should fail (in ms)


<a id="overrideDependencies" />

## Override amd dependencies
Require-es provides more flexibility on loading multiple versions of a given package. <br/>
Unfortunately some amd/umd-packages include predefined dependencies. These can lead to unwanted / unexpected behavior.

### Example: react-dom + react
Let's take a look at the conflict below: react 16 + react 18
```js
require.register({
    'react': [
        'https://cdnjs.cloudflare.com/ajax/libs/react/16.14.0/umd/react.production.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.0.0/umd/react-dom.production.min.js'
    ],
    'react-dom': [
        'https://cdnjs.cloudflare.com/ajax/libs/react-dom/16.14.0/umd/react-dom.production.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.0.0/umd/react-dom.production.min.js'
    ]
});
const ReactDom = await require('react-dom@^16.0.0');
//react-dom     version 16.14.0 will download/initialize (it's the highest match within major 16)
//react         version 18.0.0 will download/initialize...
//this happens because react-dom has a dependency on 'react' baked into the module itself: define(['react'], factoryReactDom(React){})
//see code-snippet below
```
Why did react 18.0.0 initialize, when react-dom 16.x is required?<br/>
The answer can be found in the react-dom source-code itself:<br/>
https://cdnjs.cloudflare.com/ajax/libs/react-dom/16.14.0/umd/react-dom.production.min.js
```js
...nction"===typeof define&&define.amd?define(["exports","react"],ea):(I=I||self,ea(I.ReactDOM={},...
```
Pay close attention to the dependencies set by the react-dom definition: define(["exports",**"react"**]). <br/>
This instructs require-es to load **"react"** (without version number specified) before the "react-dom" factory runs. 
If no "react" version is specified, the default version will be loaded (if no default is specified, the highest version becomes the default) 

### Fix hardcoded amd-dependencies
To avoid mixing up versions, require-es allows dependency overrides.

This is done by providing the dependencyOverrides object while registering an amd module.

Syntax
```js
require.register({
  packageName: {
    url: 'urlToDownloadTheAmdModule',
    dependencyOverrides: {
          dependencyName: 'newDependencyName(@version)'
    }
  }
})
```

Example:
```js
require.register({
    'react-dom': [
        {
            url: 'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.0.0/umd/react-dom.production.min.js',
            dependencyOverrides: { react: 'react@18.0.0' }
        },
        {
            url: 'https://cdnjs.cloudflare.com/ajax/libs/react-dom/16.14.0/umd/react-dom.production.min.js',
            dependencyOverrides: { react: 'react@16.14.0' }
        }
    ],
    'react': [
        'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.0.0/umd/react-dom.production.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/react/16.14.0/umd/react.production.min.js'
    ]
});
```
This will override any hardcoded dependency on "react" to "react@18.0.0" (or "react@16.14.0") in both react-dom packages. <br/>
The react-dom factory will now receive a matching react-version.

Looking back at the react-dom source code:

https://cdnjs.cloudflare.com/ajax/libs/react-dom/16.14.0/umd/react-dom.production.min.js
```js
...nction"===typeof define&&define.amd?define(["exports","react"],ea):(I=I||self,ea(I.ReactDOM={},...
//will become
...nction"===typeof define&&define.amd?define(["exports","react@16.14.0"],ea):(I=I||self,ea(I.ReactDOM={},...
```
https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.0.0/umd/react-dom.production.min.js
```js
...nction"===typeof define&&define.amd?define(["exports","react"],eb):(M=M||self,eb(M.ReactDOM={},...
//will become
...nction"===typeof define&&define.amd?define(["exports","react@18.0.0"],eb):(M=M||self,eb(M.ReactDOM={},...
```

<a id="requireWhen" />

## Require.when() - only return explicitly defined/registered packages
By default requirees will **always** try to download a package, even when no registration/definition is available.

Example 
```js
require('myUnkownPackage')
//tries to download './myUnkownPackage.js'. 
```
Require.when() ensures the requested package are explicitly defined/registered! 
If the requested package is not defined/registered yet, require.when will wait for an explicit define/register.

### Usage
```js
//wait for a single package to get defined/registered
require.when('packageName(@)(^)(~)(*)(version)(.filetype)').then(packageInstance => {});
//wait for multiple packages to get defined/registered
require.when([
  'pckg1(@)(^)(~)(*)(version)(.filetype)',
  'pckg2(@)(^)(~)(*)(version)(.filetype)'
]).then((pckg1, pckg2) => {});
//using callbacks instead of promises
require.when('packageName(@)(^)(~)(*)(version)(.filetype)', callback, failCallback)
```
### Samples
```js
require.when('myUnkownPackage')
        .then(p => console.log('my unknown package is defined now', p))
//waits until someone explicitly defines the package
//the promise above will resolve with the 'myUnknownPackage'-exports after 5 seconds
setTimeout(
    () => define('myUnkownPackage', () => exports),
    5000
);
```
```js
require.when('three@^0.100.0')
        .then(three => console.log('three is registered and usable now', three))
//waits until someone explicitly registers the package
//
setTimeout(
    () => require.register({
        three: "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.148.0/three.min.js"
    }),
    5000
);
```

<a id="define"/>

## Define a package

### Usage (follows AMD-pattern)
```js
//named define
define(packageName(@)(version)(.filetype)(-default), [dependencies], factory);
//anonymous define
define([dependencies], factory);
```

Key | Description
--- | ---
PackageName | the name of the package
Version | the version-number in string format: major.minor(.patch)(.build)(-releaseCandidate)
Filetype | the file extension - js/css/txt/xml/json/html/wasm/tag
Default | indicates the default version
Dependencies | package names (or urls) on which this package is dependent
Factory | function / json / text / HTMLElement / xml / ...

> Note - The dependency naming rules are equal to the require naming rules:<br/>
packageName(@)(^)(~)(*)(version)(.filetype) 

> Note - The datatype of the factory can be different, depending on the filetype:
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
//gets converted to an HTMLElement when required + will automatically add the CSS to the page
define('hello.html', ['hello.css@^1.0.0'], '<div>bla</div>');
//alternative
define('hello.html', [], document.createElement('div'));

//define r.js style
define('react', reactFactoryFn);
//using version number
define('react@17.0.2', react1702FactoryFn);
```

<a id="options"/>

## RequireEs options
```js
require.config({
    allowRedefine: false,
    invokeNonMatchedDefines: true
});
```

Key | Description
--- | ---
allowRedefine | default: false;<br/>false: you cannot change the factory, for a given package (after it gets required for the first time)<br/>true: the factory can be changed at any time, next require will use the new factory
invokeNonMatchedDefines | default: false; <br/>automatically invoke anonymous defines which could not be matched to any package in the RequireEs register.

<a id="events"/>

## RequireEs events

### Usage
```js
//subscribe to an event
require.on(evtName, callback);
//require.subscribe is a synonym for require.on
require.subscribe(evtName, callback);

//publish an event
require.publish(evtName, payload);

//spy on all events
require.addWireTap(callback);
```

### Predefined events
Event | Trigger
--- | ---
requirees.pre-define | when define gets called, but the factory is not stored into the registry yet
requirees.define | when a package factory was added to the registry
requirees.pre-register | when require.register or require.config({paths}) are called, but the package it not added to the registry yet
requirees.register | when a package was added to the registry
requirees.pre-file-load | before an actual file/factory load is happening
requirees.file-load | when a file/factory load has completed
requirees.wiretaps | on all events
requirees.scripttag.preadd | triggers before requirees appends a script-tag to the dom
requirees.scripttag.added | tiggers after requirees appended a script-tag to the dom
requirees.styletag.preadd | triggers before requirees appends a script-tag to the dom
requirees.styletag.added | tiggers after requirees appended a style-tag to the dom

### Samples
```js
//listen to all files being loaded
requirees.subscribe('requirees.pre-file-load', ({package}) => {
    console.log(`start loading package: ${package.name}`);
})

//listen to all events being triggered
requirees.addWireTap(console.log);
//alternative:
requirees.subscribe('requirees.wiretaps', console.log);

//create custom events
requirees.subscribe('hendrik.sayHello', data => {
    console.log('hello!!', data)
});
requirees.publish('hendrik.sayHello', {foo: 'bar'});
```

<a id="webpack"/>

## WebPack / Rollup bundling for RequireEs

### Intro
In the examples below project-dependencies 'jquery', 'react' and 'lodash' will be removed from your bundle and loaded using RequireEs.

To make this happen:
* Add RequireEs to the top of your HTML-document
* Register your dependencies on the document (This will happen automatically using RequireEs-server, coming soon)
* Load your AMD (/UMD) bundle through RequireEs (recommended), or using a script-tag

Samples for Webpack and Rollup bundling can be found in the sections below.

```js
//require the AMD module
require.register({
    jquery: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js',
    react: [
        'https://cdnjs.cloudflare.com/ajax/libs/react/17.0.2/umd/react.production.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/react/16.14.0/umd/react.production.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/react/16.10.1/umd/react.production.min.js'
    ],
    lodash: [
        'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.10.1/lodash.min.js'
    ]
});

//require the application package
await require('/scripts/myLib.amd.js');
```

If your package is added through a script-tag, call require.config({invokeNonMatchedDefines: true}) to invoke the factory immediately:
```html
<script>
    requirees.config({
        invokeNonMatchedDefines: true
    })
</script>
<script src="/scripts/myLib.amd.js"></script>
```

### Build your bundle AMD style

#### Webpack
```js
module.exports = {
    //...
    output: {
        libraryTarget: 'amd',
        filename: 'scripts/myLib.amd.js'
    },
    //...
    externals: {
      jquery: 'jquery@*',
      react: 'react@^17.0.0',
      lodash: 'lodash@^4.17.0'
    },
};
```

#### Rollup

```js
export default {
    //...
    output: {
        format: 'amd',
        file: 'scripts/myLib.amd.js',
        external: ['react', 'jquery', 'lodash'],
        paths: {
            react: 'react@^17.0.0',
            jquery: 'jquery@*',
            lodash: 'lodash@^4.17.0'
        }
    },
    //...
};
```

### Build your bundle UMD style

#### Webpack

```js
module.exports = {
    //...
    output: {
        libraryTarget: 'umd',
        filename: 'scripts/myLib.amd.js',
        library: 'myLib'
    },
    //...
    externals: {
      jquery: {
          root: '$',
          amd: 'jquery@*',
          commonjs: 'jquery',
          commonjs2: 'jquery'
      },
      react: {
          root: 'React',
          amd: 'react@^17.0.0',
          commonjs: 'react',
          commonjs2: 'react'
      },
      lodash: {
          root: '_',
          amd: 'lodash@^4.17.0',
          commonjs: 'lodash',
          commonjs2: 'lodash'
      }
    },
};
```

#### Rollup

```js
export default {
    //...
    output: {
        format: 'umd',
        file: 'scripts/myLib.amd.js',
        name: 'myLib',
        external: ['react', 'jquery', 'lodash'],
        paths: {
            react: 'react@^17.0.0',
            jquery: 'jquery@*',
            lodash: 'lodash@^4.17.0'
        },
        globals: {
            react: 'React',
            jquery: '$',
            lodash: '_'
        }
    },
    //...
};
```

<a id="custom"/>

## Custom elements support (coming soon)
