!function(){"use strict";var u="undefined"!=typeof self?self:global,l={reProtocolAndHost:/^(https?:)?\/\/.+?\//i,reComments:/\/\*[\s\S]*?\*\/|([^:"'=]|^)\/\/.*$/gm,reCjsRequireCalls:/[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g,reExtension:/\.(\w{2,4})$/i,reVersionNumber:/^\s*([*<>^~])?(\d+)\.(\d+)(\.\d+)?(\.\d+)?(\-[\w\d]*)?(\-default)?\s*$/,reVersionNumberInUrl:/\/(\d*\.\d+(.\d*)?(.\d*)?(\-[\w\d]*)?)\//,reToleranceCharacters:/^[\^~*]/,reVersionSplitters:/[.-]/,reUrlWithoutProtocolNorSpecialCharacters:/(https?:)|[\._\/:\?&=]/g,registryElementAttributeKeys:["version","url","urls","name","sort","versions","type","factory","dependencies"],versionFormat:["major","minor","patch","build","rc"],returnDefaultOnVersionStr:["default","anonymous"],toleranceFormat:["*","^","~"],events:{ns:"requirees.",pre:"pre-",register:"register",define:"define",loadFile:"file-load",wireTapEventName:"requirees.wiretaps",resolve:{regexp:/^([\w\.]*)(\[([0-9]*)\])?$/,fnName:1,fnIndex:3}}};function d(e){return(d="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function h(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function i(e,t,n){return t&&r(e.prototype,t),n&&r(e,n),e}function s(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),n.push.apply(n,r)}return n}function f(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?o(Object(n),!0).forEach(function(e){s(t,e,n[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))})}return t}function a(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function c(e){if("undefined"==typeof Symbol||null==e[Symbol.iterator]){if(Array.isArray(e)||(e=function(e,t){if(e){if("string"==typeof e)return a(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?a(e,t):void 0}}(e))){var t=0,n=function(){};return{s:n,n:function(){return t>=e.length?{done:!0}:{done:!1,value:e[t++]}},e:function(e){throw e},f:n}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var r,i,s=!0,o=!1;return{s:function(){r=e[Symbol.iterator]()},n:function(){var e=r.next();return s=e.done,e},e:function(e){o=!0,i=e},f:function(){try{s||null==r.return||r.return()}finally{if(o)throw i}}}}function v(e){for(var t={},n=0;n<e.length;n++){var r=e[n];"string"!=typeof r||t.name?r instanceof Array&&!t.dependencies?t.dependencies=r.map(function(e){return"."===e.charAt(0)?function(e){var t=e.match(l.reExtension);{if(-1<["css","js","html","htm","json","tag","txt","wasm","xml"].indexOf(null==t?void 0:t[1])){var n=function(){var e,t=null===(e=document.currentScript)||void 0===e?void 0:e.src;{if(t)return t;var n,r=document.getElementsByTagName("script");return null===(n=r[r.length-1])||void 0===n?void 0:n.src}}();return new URL(e,n).href}return e.replace(/^\.\//,"")}}(e):e}):t.factory=r:t.name=r}return t.dependencies instanceof Array||(t.dependencies=[]),"function"==typeof t.factory&&function(n){n.factory.toString().replace(l.reComments,"").replace(l.reCjsRequireCalls,function(e,t){return n.dependencies.push(t)})}(t),t}function p(){if(document.currentScript)return document.currentScript;var e=document.head.getElementsByTagName("script");return e[e.length-1]}var y={waitForDefine:function(t){return new Promise(function(e){return t.confirmDefine=e})},confirmDefine:function(e){var t=e.factory,n=e.dependencies,r=p()||{};return function(e){var t,n,r;return"function"==typeof e.confirmDefine&&-1<(null===(t=e.versiontype)||void 0===t?void 0:null===(n=t.urls)||void 0===n?void 0:null===(r=n.indexOf)||void 0===r?void 0:r.call(n,e.src))}(r)?(r.versiontype.dependencies=n,r.confirmDefine(t),r.confirmDefine=null,{currentTag:r,success:!0}):{currentTag:r,success:!1}},cancelDefine:function(e){"function"==typeof e.confirmDefine&&e.confirmDefine(e)},getCurrentVersion:function(){return p().version}},m=function(){function f(e){h(this,f);var t=d(e);if("string"===t)this.parse(e);else if("object"===t&&null!==e){var n=e.tolerance,r=e.minor,i=e.major,s=e.patch,o=e.build,a=e.rc,u=e.isdefault,c=e.str;this.tolerance=n,this.minor=r,this.major=i,this.patch=s,this.build=o,this.rc=a,this._isdefault=u,this._str=c}}return i(f,[{key:"parse",value:function(e){this._str=e.replace("-default",""),"*"===this._str&&(this.tolerance="*");var t=e.match(l.reVersionNumber);if(-1<e.indexOf("default")&&(this._isdefault=!0),t&&8===t.length){var n=t.indexOf("-default");-1<n&&t.splice(n,1),"string"==typeof t[1]&&(this.tolerance=t[1]),this.major=f.toNumber(t[2]),this.minor=f.toNumber(t[3]),"string"==typeof t[4]&&(this.patch=f.toNumber(t[4].substr(1))),"string"==typeof t[5]&&(this.build=f.toNumber(t[5].substr(1))),"string"==typeof t[6]&&(this.rc=f.toNumber(t[6].substr(1)))}}},{key:"default",get:function(){return this._isdefault||!1}},{key:"str",get:function(){if(this._str)return this._str;if(void 0===this.major)return"anonymous";var e=this.tolerance||"",t=void 0!==this.patch?".".concat(this.patch):"",n=void 0!==this.build?".".concat(this.build):"",r=void 0!==this.rc?"-".concat(this.rc):"";return"".concat(e).concat(this.major,".").concat(this.minor).concat(t).concat(n).concat(r)}}],[{key:"toNumber",value:function(e){var t=Number(e);return isNaN(t)?e:t}}]),f}(),g=function(){function c(e){h(this,c),this.files=[],this._splitEachArgumentIntoSingleFiles(e)}return i(c,[{key:"_splitEachArgumentIntoSingleFiles",value:function(e){for(var t=0;t<e.length;t++){var n=e[t],r=d(n);"string"===r?this._addFile(n):n instanceof Array?this._splitArrayIntoSingleFiles(n):"object"===r&&this._splitObjectIntoSingleFiles(n)}}},{key:"_splitArrayIntoSingleFiles",value:function(e){var t=this;e.forEach(function(e){"string"==typeof e?t._addFile(e):"object"===d(e)&&null!==e&&t._splitObjectIntoSingleFiles(e)})}},{key:"_splitObjectIntoSingleFiles",value:function(r){var i=this;Object.keys(r).forEach(function(n){var e=r[n],t=d(r[n]);"string"===t?i._addFile(n,e):e instanceof Array?e.forEach(function(e){var t=d(e);"string"===t?i._addFile(n,e):"object"===t&&i._splitPackageConfigObjectIntoFiles(n,e)}):"object"===t&&i._splitPackageConfigObjectIntoFiles(n,e)})}},{key:"_splitPackageConfigObjectIntoFiles",value:function(t,n){var r=this,e=n.version,i=n.versions,s=n.url,o=n.urls,a=n.type,u=n.dependencies,c=n.factory;i instanceof Array&&0<i.length?i.forEach(function(e){return r._splitPackageConfigObjectIntoFiles(t,f(f({},n),{},{version:e,versions:null}))}):o instanceof Array?o.forEach(function(e){return r._splitPackageConfigObjectIntoFiles(t,f(f({},n),{},{url:e,urls:null}))}):this._addFile(t,s,e,a,u,c)}},{key:"_addFile",value:function(e,t,n,r,i,s){if(e){void 0===t&&(t=e);var o=(r=r||c.guessType(e)||c.guessType(t))?new RegExp("^".concat(r,"!")):"",a=r?new RegExp("^".concat(r,"!|\\.").concat(r,"$"),"g"):"";(n=n||this._getVersionInfo(e,t))instanceof m||(n=new m(n));var u=new RegExp(this._getRegexpVersionString(n));this.files.push({name:e.replace(u,"").replace(a,"").replace(l.reVersionNumberInUrl,"").replace(l.reUrlWithoutProtocolNorSpecialCharacters,""),url:"string"==typeof t&&t.replace(u,"").replace(o,""),version:n,type:r,dependencies:i,factory:s})}}},{key:"_getVersionInfo",value:function(e,t){var n=c.getVersionFromName(e);if(null!==n&&"default"!==n)return n;var r=c.getVersionFromUrl(t);return"default"===n?r?"".concat(r,"-default"):"default":r}},{key:"_getRegexpVersionString",value:function(e){return"@("+e.str.replace(/\./g,"\\.").replace("^","\\^").replace("*","\\*")+")?(-?default)?$"}}],[{key:"guessType",value:function(e){if(e){var t=e.indexOf("@");-1<t&&(e=e.substring(0,t));var n=e.indexOf("!");if(-1<n)return e.substr(0,n);var r=l.reExtension.exec(e);if(r&&2===r.length)return r[1]}}},{key:"getVersionFromName",value:function(e){if(e){var t=e.indexOf("@");return-1<t?e.substr(t+1):null}}},{key:"getVersionFromUrl",value:function(e){if(e){var t=e.match(l.reVersionNumberInUrl);return t&&5===t.length?t[1]:null}}}]),c}(),b=function(){function n(e,t){h(this,n),this.parent=t,this.major=e.version.major,this.minor=e.version.minor,this.patch=e.version.patch,this.build=e.version.build,this.rc=e.version.rc,this.str=e.version.str||this._getVersionStr(),this.filetypes={}}return i(n,[{key:"addFileType",value:function(e){var t=this.str;if(!e.url&&e.urls instanceof Array&&(e.url=e.urls[0]),!(e.url&&-1<e.url.indexOf("${")))return this._processFileType(e);try{return this._processFileType(f(f({},e),{},{url:new Function(["version","obj"],"return `"+e.url+"`")(t,this)}))}catch(e){console.warn("Error parsing registry URL",e)}}},{key:"loadFileType",value:function(e){if(this.filetypes[e])return u.requirees.loaders.loadTypeFromVersion(this,e);console.warn("RequireEs: There is no ".concat(e,"-file present in package ").concat(this.parent.name," (version ").concat(this.str,")"))}},{key:"isSpecified",value:function(e){var t=(null==e?void 0:e.type)||e;if("string"==typeof t){var n=this.filetypes[t];return(null==n?void 0:n.hasOwnProperty("exports"))||!1}for(var r=Object.keys(this.filetypes),i=0;r.length>i;i++)if(!1===this.filetypes[r[i]].hasOwnProperty("exports"))return!1;return!0}},{key:"undef",value:function(e){var t=this,n=(null==e?void 0:e.type)||e;"string"==typeof n?delete this.filetypes[n]:Object.keys(this.filetypes).forEach(function(e){return delete t.filetypes[e]})}},{key:"shim",value:function(e,t){if("object"===d(t)){var n=this._getFile(e);n&&(t.deps instanceof Array&&this._addDependencies(n,t.deps,"PreLoad"),"string"==typeof t.exports&&(n.postFactory=function(){return u[t.exports]}),"function"==typeof t.exports&&(n.postFactory=t.exports))}}},{key:"addDependencies",value:function(e,t,n){if("object"===d(t)){var r=this._getFile(e);this._addDependencies(r,t,n?"PreLoad":"Extra")}}},{key:"_getFile",value:function(e){var t=(null==e?void 0:e.type)||e;return"string"!=typeof t&&(t="js"),this.filetypes[t]}},{key:"_addDependencies",value:function(t,e,n){var r="dependencies".concat(n);t[r]instanceof Array||(t[r]=[]),e instanceof Array&&e.forEach(function(e){"string"==typeof e&&-1===t[r].indexOf(e)&&t[r].push(e)})}},{key:"_processFileType",value:function(e){e.type=e.type||g.guessType(e.url)||"js","object"!==d(this.filetypes[e.type])&&(this.filetypes[e.type]={urls:[]});var t=this.filetypes[e.type];return void 0!==e.factory&&this._setFactory(e.factory,t),e.dependencies instanceof Array&&(t.dependencies=e.dependencies),"string"==typeof e.url&&-1===t.urls.indexOf(e.url)&&t.urls.unshift(e.url),t}},{key:"_setFactory",value:function(e,t){this._canBeDefined(t)?(delete t.dfr,delete t.exports,t.factory=e):console.warn("RequireEs - Computer says no: package ".concat(this.parent.name," - ").concat(this.str," is already defined... Redefining this package is not allowed!"))}},{key:"_getRequireEsConfigOptions",value:function(){var e,t,n;return null===(e=this.parent)||void 0===e?void 0:null===(t=e.parent)||void 0===t?void 0:null===(n=t.parent)||void 0===n?void 0:n.options}},{key:"_canBeDefined",value:function(e){return!e.hasOwnProperty("exports")||(this._getRequireEsConfigOptions().allowRedefine||!1)}},{key:"_getVersionStr",value:function(){var t=this;return this.str=l.versionFormat.map(function(e){return"rc"!==e&&t[e]}).filter(function(e){return"number"==typeof e||"string"==typeof e}).join("."),void 0!==this.rc&&null!==this.rc&&""!==this.rc&&(this.str+="".concat("string"==typeof this.rc?"-":".").concat(this.rc)),this.str}},{key:"test",value:function(e){var t=e.tolerance;if("*"===t)return!0;if("^"===t)return this.major===e.major;if("~"===t)return this.major===e.major&&this.minor===e.minor;for(var n=0;n<l.versionFormat.length;n++){var r=l.versionFormat[n];if(!t&&(this[r]||0)!==(e[r]||0))return!1}return Boolean(!t)}},{key:"toJson",value:function(){var e={filetypes:this.filetypes,major:this.major,minor:this.minor,str:this.str};return void 0!==this.patch&&(e.patch=this.patch),void 0!==this.build&&(e.build=this.build),void 0!==this.rc&&(e.rc=this.rc),e}}]),n}(),k=function(){function n(e,t){h(this,n),this.parent=t,this.versions=[],this.isDirty=!1,this.name=e.name}return i(n,[{key:"find",value:function(t){return this.versions.filter(function(e){return e.test(t)})}},{key:"findOne",value:function(e){var t,n=c(this.versions);try{for(n.s();!(t=n.n()).done;){var r=t.value;if(r instanceof b&&r.test(e))return r}}catch(e){n.e(e)}finally{n.f()}return null}},{key:"remove",value:function(t){return t instanceof Array||(t=[t]),this.versions=this.versions.filter(function(e){return-1===t.indexOf(e)}),this}},{key:"length",value:function(){return this.versions.length}},{key:"add",value:function(e){e.version&&void 0!==e.version.tolerance&&delete e.version.tolerance;var t=this.findOne(e.version);return t instanceof b||(t=new b(e,this),this.versions.push(t),this.isDirty=!0,"boolean"==typeof e.sort&&!e.sort||this.sort(e)),t.addFileType(e),e.version.default&&(this.default=t),t}},{key:"sort",value:function(){return this.isDirty&&(this.versions=this.versions.sort(function(e,t){for(var n=0;n<l.versionFormat.length;n++){var r=l.versionFormat[n];if(e[r]!==t[r])return e[r]<t[r]?1:-1}})),this.isDirty=!1,this}},{key:"toJson",value:function(){return this.versions.map(function(e){return e.toJson()})}}]),n}(),n=function(){function n(e,t){h(this,n),this.parent=t,this.options=e,this.packages={}}return i(n,[{key:"add",value:function(){var t=this,e=new g(arguments).files;return e instanceof Array&&e.forEach(function(e){t._publish("".concat(l.events.ns).concat(l.events.pre).concat(l.events.register),{file:e}),t.packages[e.name]||(t.packages[e.name]=new k(e,t)),t.packages[e.name].add(e),t._publish("".concat(l.events.ns).concat(l.events.register),{package:t.packages[e.name],file:e})}),this.sort(),this}},{key:"_publish",value:function(e,t){var n,r;null===(n=this.parent)||void 0===n||null===(r=n.events)||void 0===r||r.publish(e,t)}},{key:"sort",value:function(){var t=this;Object.keys(this.packages).forEach(function(e){return t.packages[e].sort()})}},{key:"remove",value:function(){var e=new g(arguments),t=this.find(e);return t&&(t.pckg.length()===t.versions.length?delete this.packages[t.pckg.name]:t.pckg.delete(t.versions)),this}},{key:"find",value:function(){var e=new g(arguments).files;return e instanceof Array?this._find(e[0],!1):[]}},{key:"findOne",value:function(){var e=new g(arguments).files;return e instanceof Array?this._find(e[0],!0):null}},{key:"_find",value:function(e,t){var n=this.packages[e.name];if(n){var r,i={pckg:n,attrs:e};if(-1<l.returnDefaultOnVersionStr.indexOf(e.version.str)&&n.default)r=t?n.default:[n.default];else{var s=e.version&&void 0!==e.version.major?e.version:{tolerance:"*"};r=n[t?"findOne":"find"](s)}return i["match".concat(t?"":"es")]=r,i}return{attrs:e}}},{key:"toJson",value:function(){var t=this,n={};return Object.keys(this.packages).forEach(function(e){return n[e]=t.packages[e].toJson()}),n}}]),n}(),w=function(){function e(){h(this,e),this._reservedDependencies={},this.add("require",this.requireHandler.bind(this)).add("requirees",this.requireEsHandler.bind(this)).add("exports",this.exportsHandler.bind(this)).add("mdl",this.moduleHandler.bind(this))}return i(e,[{key:"add",value:function(e,t){return"function"==typeof t&&"string"==typeof e&&(this._reservedDependencies[e]=t),this}},{key:"get",value:function(e,t){var n=this._reservedDependencies[e];return n?n(t):null}},{key:"moduleHandler",value:function(e){var t;return e.uri=e.urls,e.id=null===(t=e.parent)||void 0===t?void 0:t.name,void 0===e.exports&&(e.exports={}),e}},{key:"exportsHandler",value:function(e){return void 0===e.exports&&(e.exports={}),e.exports}},{key:"requireHandler",value:function(e){return e.require?e.require:this._makeNewRequireEsContext(e).require}},{key:"requireEsHandler",value:function(e){return e.requirees?e.requirees:this._makeNewRequireEsContext(e).requirees}},{key:"_makeNewRequireEsContext",value:function(e){var t=new L;return e.require=t.asFunction(!1),e.requirees=t.asFunction(!0),{requirees:e.requirees,require:e.require}}},{key:"reservedDependencyNames",get:function(){return Object.keys(this._reservedDependencies)}}]),e}();var _={load:function(n,r,e){return new Promise(function(e){var t=document.createElement("link");t.type="text/css",t.rel="stylesheet",t.href=n,t.onload=e.bind(r,t),document.head.appendChild(t)})},factoryRunner:function(e){if("string"==typeof e){var t=document.createElement("style");return t.innerText=e,document.head.appendChild(t)}}};function O(e){return fetch(e).then(function(e){return e.text()})}var j=null;function F(e){var t=(j=j||new DOMParser).parseFromString(e,"text/html");if(t.documentElement){if(-1!==e.indexOf("<body>"))return t.documentElement;var n=t.body&&t.body.children||[];return 1===n.length?n[0]:n}return e}var x={load:function(e,t,n){return new Promise(function(t){u.require("txt!".concat(e),function(e){t(F(e))})})},factoryRunner:function(e){return"string"==typeof e?F(e):e}},t=null;function E(e){return(t=t||new DOMParser).parseFromString(e,"application/xml")}var P={factoryRunner:function(e){return"string"==typeof e?E(e):e},load:function(e,t,n){return new Promise(function(t){u.require("txt!".concat(e),function(e){return t(E(e))})})}};function q(e,t,n){if(window.removeEventListener("error",n),t)throw t;y.cancelDefine(e)}function D(t,e,n){function r(e){return e.filename===t?i=e.error:null}var i;window.addEventListener("error",r);var s=document.createElement("script");return s.charset="utf-8",s.async=!0,s.addEventListener("error",function(){return q(s,"Error loading script: ".concat(t),r)}),s.addEventListener("load",function(){return q(s,i,r)}),s.src=t,s.version=e,s.versiontype=n,document.head.appendChild(s),y.waitForDefine(s)}var A={load:function(e){return fetch(e).then(function(e){return e.json()})},factoryRunner:function(e){return"string"==typeof e?JSON.parse(e):e}},S=function(){function t(e){h(this,t),this.version=e,this.name=e.parent.name}return i(t,[{key:"getAll",value:function(){return document.querySelectorAll(this.name)}}]),t}();function N(e,t){return"function"==typeof e?(e.prototype.getAssociatedVersion=function(){return t},customElements.define(t.parent.name,e),new S(t)):(console.warn("RequireEs: Custom elements should be functions (or classes) extended from any HTMLElement"),{error:"Not a valid custom element factory"})}var R={load:function(e,n,t){return new Promise(function(t){u.require(e,function(e){return t(N(e,n))})})},factoryRunner:function(e,t){return e instanceof S?e:N(e,t)}};function T(e,t){if(void 0!==u.WebAssembly)return fetch(e).then(function(e){return e.arrayBuffer()}).then(function(e){return WebAssembly.instantiate(e)}).then(function(e){return e.instance.exports});console.warn("Requirees: this browser does not support WebAssembly... Package ".concat(t.parent.name," cannot be loaded"))}var C=function(){function t(e){h(this,t),this.requireContext=e,this.reservedDependencies=new w(e),this.loaders={},this.unloaders={},this.factoryRunners={},this.add("js",D),this.add("wasm",T),this.add("tag",R),this.add("html",x),this.add("htm",x),this.add("xml",P),this.add("txt",O),this.add("json",A),this.add("css",_)}return i(t,[{key:"add",value:function(e,t){if("object"===d(t)){var n=t.load||t.loader||t.get,r=t.unload||t.unloader||t.remove||t.delete,i=t.handleFactory||t.factory||t.factoryRunner||t.factoryLoader;"function"==typeof n&&(this.loaders[e]=n),"function"==typeof r&&(this.unloaders[e]=r),"function"==typeof i&&(this.factoryRunners[e]=i)}else"function"==typeof t&&(this.loaders[e]=t)}},{key:"get",value:function(e){return this.loaders[e]||this.loaders.js}},{key:"load",value:function(e,t){var n=this,r=0<arguments.length&&void 0!==e?e:{},i=1<arguments.length&&void 0!==t?t:{},s=r.attrs;if(r.match){var o=r.match.filetypes,a=s&&s.type;if(a&&o[a])return this.loadTypeFromVersion(r.match,a);var u=!1,c=Object.keys(o).map(function(e){var t=n.loadTypeFromVersion(r.match,e);return t instanceof Promise&&(u=!0),t});return u?Promise.all(c).then(this._returnMultiFiletypeLoad.bind(this,o,i)):this._returnMultiFiletypeLoad(o,i,c)}return console.warn("RequireEs - Oh fudge, we did not find any package '".concat(s&&s.name||"<unknown>","' that matches version '").concat(s&&s.version&&s.version.str||"<unknown>","'")),null}},{key:"_returnMultiFiletypeLoad",value:function(e,t,n){var r=Object.keys(e);if(t.returnAll){var i={};return r.forEach(function(e,t){return i[e]=n[t]}),i}for(var s=Object.keys(this.loaders),o=0;o<s.length;o++){var a=r.indexOf(s[o]);if(-1<a)return n[a]}}},{key:"loadTypeFromVersion",value:function(n,r){var i=this,s=n.filetypes[r];if(this._publishEvt("".concat(l.events.ns).concat(l.events.pre).concat(l.events.loadFile),{package:n.parent,versiontype:s,version:n}),"object"===d(s)&&null!==s)return void 0!==s.exports?s.exports:s.dfr instanceof Promise?s.dfr:s.dfr=new Promise(function(t){s.factory?i._resolveFactoryDependencies(t,n,r):i._loadFromUrl(n,r).then(function(e){s.factory=e,i._resolveFactoryDependencies(t,n,r)})}).then(function(e){return i._publishEvt("".concat(l.events.ns).concat(l.events.loadFile),{package:n.parent,instance:e,versiontype:s,version:n}),e})}},{key:"_publishEvt",value:function(e,t){this.requireContext.events.publish(e,t)}},{key:"_resolveFactoryDependencies",value:function(t,n,r){var i=this,s=n.filetypes[r],e=s.dependencies instanceof Array?s.dependencies:[],o=s.dependenciesExtra instanceof Array?s.dependenciesExtra:[],a=s.dependenciesPreLoad instanceof Array?s.dependenciesPreLoad:[],u=e.concat(o).concat(a),c=this.reservedDependencies.reservedDependencyNames;if(u.length){var f=u.map(function(e){return-1<c.indexOf(e)?i.reservedDependencies.get(e,s):i.requireContext.get(e)});return Promise.all(f).then(function(e){return i._resolveFactory(t,n,r,e)})}return this._resolveFactory(t,n,r,[])}},{key:"_resolveFactory",value:function(e,t,n,r){var i,s=t.filetypes[n];i="function"==typeof this.factoryRunners[n]?i=this.factoryRunners[n].call(t,s.factory,t,s,r):"function"==typeof s.factory?s.factory.apply(t,r):s.factory,void 0===s.exports&&("function"==typeof s.postFactory&&(i=s.postFactory(i)),s.exports=i),e(s.exports)}},{key:"_loadFromUrl",value:function(t,n,e){var r=2<arguments.length&&void 0!==e?e:0,i=this.get(n);if("function"==typeof i){var s=t.filetypes[n],o=s.urls;if(r<o.length)try{return this._waitForPreLoadDependencies(s).then(function(){return i(o[r],t,s)})}catch(e){return this._loadFromUrl(t,n,r+1)}}}},{key:"_waitForPreLoadDependencies",value:function(e){return e.dependenciesPreLoad instanceof Array&&0<e.dependenciesPreLoad.length?this.requireContext.getPromise(e.dependenciesPreLoad):Promise.resolve()}}]),t}(),V=function(){function e(){h(this,e),this.register={}}return i(e,[{key:"subscribe",value:function(e,t){return this.register[e]instanceof Array||(this.register[e]=[]),this.register[e].push(t),"".concat(e,"[").concat(this.register[e].length-1,"]")}},{key:"unsubscribe",value:function(t){try{var e=t.match(l.events.resolve.regexp),n=e[l.events.resolve.fnName],r=e[l.events.resolve.fnIndex];void 0===r?delete this.register[n]:delete this.register[n][r]}catch(e){console.warn("RequireEs: we could not unsubscribe from ".concat(t),e)}}},{key:"publish",value:function(t,n){(this.register[t]instanceof Array?this.register[t]:[]).concat(this.register[l.events.wireTapEventName]).forEach(function(e){try{"function"==typeof e&&e(n,t)}catch(e){console.error("RequireEs: Error while executing a function in ".concat(t),e)}})}},{key:"addWireTap",value:function(e){return"function"==typeof e?this.subscribe(l.events.wireTapEventName,e):null}}]),e}();function I(n){var r=[];return"object"===d(n)&&Object.keys(n).forEach(function(t){var e=n[t];"string"==typeof e&&(e=[e]),e instanceof Array&&e.forEach(function(e){return r.push(s({},t,function(e){return-1===e.indexOf("!")&&!/\.js(\?.*)?$/.test(e)}(e)?"".concat(e,".js"):e))})}),r}var L=function(){function t(e){h(this,t),this.events=new V,this.registry=new n(e,this),this.loaders=new C(this),this.options=e||{},this.amd={}}return i(t,[{key:"define",value:function(){var e=v(arguments),t=e.name,n=e.dependencies,r=e.factory;this.events.publish("".concat(l.events.ns).concat(l.events.pre).concat(l.events.define),{args:e});var i="string"==typeof t&&!("jquery"===t&&void 0===r),s=this._defineAnonymousModule(n,r,i),o=i?this._defineNamedModule(t,n,r):null;return this.events.publish("".concat(l.events.ns).concat(l.events.define),{args:e}),o||s}},{key:"_defineNamedModule",value:function(e,t,n){var r={};return r[e]={dependencies:t,factory:n,url:!1},this.register(r)}},{key:"_defineAnonymousModule",value:function(e,t,n){var r=y.confirmDefine({dependencies:e,factory:t});if(!r.success&&r.currentTag instanceof HTMLElement){var i=this._defineNamedModule(r.currentTag.src,e,t);if(!n&&this.options.invokeNonMatchedDefines){var s,o,a=null===(s=new g([r.currentTag.src]).files)||void 0===s?void 0:null===(o=s[0])||void 0===o?void 0:o.name;a&&this.get(a)}return i}}},{key:"get",value:function(){var n=this,e=function(e){for(var t={},n=0;n<e.length;n++){var r=e[n];r instanceof Array?t.dependencies=r:"string"!=typeof r||t.dependencies?"function"==typeof r?void 0===t.callback?t.callback=r:void 0===t.callbackFail&&(t.callbackFail=r):"object"===d(r)&&(t.options=r):(t.dependencies=[r],t.loadSinglePackage=!0)}return t}(arguments),t=e.dependencies,r=e.callback,i=e.loadSinglePackage,s=e.options,o=t.map(function(e){var t=n.findOne(e);return void 0===t.match&&(n.register(e,s),t=n.findOne(e)),n.loaders.load(t,s)}),a=Promise.all(o);return"function"==typeof r&&a.then(function(e){return r.apply(u,e)}),i?o[0]:a}},{key:"getPromise",value:function(){var t=arguments,n=this;return new Promise(function(e){return e(n.get.apply(n,t))})}},{key:"register",value:function(){return this.registry.add.apply(this.registry,arguments)}},{key:"find",value:function(){return this.registry.find.apply(this.registry,arguments)}},{key:"findOne",value:function(){return this.registry.findOne.apply(this.registry,arguments)}},{key:"config",value:function(e){var t=this,n=0<arguments.length&&void 0!==e?e:{};void 0!==n.paths&&I(n.paths).forEach(function(e){return t.register(e)}),void 0!==n.allowRedefine&&(this.options.allowRedefine=n.allowRedefine),void 0!==n.invokeNonMatchedDefines&&(this.options.invokeNonMatchedDefines=n.invokeNonMatchedDefines),"object"===d(n.shim)&&this.shim(n.shim)}},{key:"specified",value:function(e){if("string"!=typeof e)return!1;var t=this.findOne(e);return t.match&&t.match.isSpecified(t.attrs)||!1}},{key:"undef",value:function(e){if("string"==typeof e){var t=this.findOne(e);return t.match&&t.match.undef(t.attrs)}}},{key:"shim",value:function(r){var i=this;Object.keys(r).forEach(function(e){if("string"==typeof e){var t,n=i.findOne(e);void 0===n.match&&(i.register(s({},e,{url:!1})),n=i.findOne(e)),null===(t=n.match)||void 0===t||t.shim(n.attrs,r[e])}})}},{key:"asFunction",value:function(e){var t=e?this.getPromise.bind(this):this.get.bind(this);return t.register=this.register.bind(this),t.find=this.find.bind(this),t.findOne=this.findOne.bind(this),t.loaders=this.loaders,t.define=this.define.bind(this),t.config=this.config.bind(this),t.specified=this.specified.bind(this),t.shim=this.shim.bind(this),t.undef=this.undef.bind(this),t.on=this.events.subscribe.bind(this.events),t.subscribe=this.events.subscribe.bind(this.events),t.unsubscribe=this.events.unsubscribe.bind(this.events),t.publish=this.events.publish.bind(this.events),t.addWireTap=this.events.addWireTap.bind(this.events),t.events=this.events,t}}]),t}(),e=new(u.RequireEs=L);u.require=u.requirejs=e.asFunction(!1),u.requirees=e.asFunction(!0),u.define=u.require.define,u.define.amd={}}();
