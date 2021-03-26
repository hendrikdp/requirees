!function(){"use strict";function l(e){return(l="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function d(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function i(e,t,n){return t&&r(e.prototype,t),n&&r(e,n),e}function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function s(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),n.push.apply(n,r)}return n}function f(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?s(Object(n),!0).forEach(function(e){o(t,e,n[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):s(Object(n)).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))})}return t}function a(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function u(e){if("undefined"==typeof Symbol||null==e[Symbol.iterator]){if(Array.isArray(e)||(e=function(e,t){if(e){if("string"==typeof e)return a(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?a(e,t):void 0}}(e))){var t=0,n=function(){};return{s:n,n:function(){return t>=e.length?{done:!0}:{done:!1,value:e[t++]}},e:function(e){throw e},f:n}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var r,i,o=!0,s=!1;return{s:function(){r=e[Symbol.iterator]()},n:function(){var e=r.next();return o=e.done,e},e:function(e){s=!0,i=e},f:function(){try{o||null==r.return||r.return()}finally{if(s)throw i}}}}function e(t){var n=this.constructor;return this.then(function(e){return n.resolve(t()).then(function(){return e})},function(e){return n.resolve(t()).then(function(){return n.reject(e)})})}var t=setTimeout;function c(e){return Boolean(e&&void 0!==e.length)}function h(){}function p(e){if(!(this instanceof p))throw new TypeError("Promises must be constructed via new");if("function"!=typeof e)throw new TypeError("not a function");this._state=0,this._handled=!1,this._value=void 0,this._deferreds=[],k(e,this)}function y(n,r){for(;3===n._state;)n=n._value;0!==n._state?(n._handled=!0,p._immediateFn(function(){var e=1===n._state?r.onFulfilled:r.onRejected;if(null!==e){var t;try{t=e(n._value)}catch(e){return void m(r.promise,e)}v(r.promise,t)}else(1===n._state?v:m)(r.promise,n._value)})):n._deferreds.push(r)}function v(t,e){try{if(e===t)throw new TypeError("A promise cannot be resolved with itself.");if(e&&("object"===l(e)||"function"==typeof e)){var n=e.then;if(e instanceof p)return t._state=3,t._value=e,void g(t);if("function"==typeof n)return void k(function(e,t){return function(){e.apply(t,arguments)}}(n,e),t)}t._state=1,t._value=e,g(t)}catch(e){m(t,e)}}function m(e,t){e._state=2,e._value=t,g(e)}function g(e){2===e._state&&0===e._deferreds.length&&p._immediateFn(function(){e._handled||p._unhandledRejectionFn(e._value)});for(var t=0,n=e._deferreds.length;t<n;t++)y(e,e._deferreds[t]);e._deferreds=null}function b(e,t,n){this.onFulfilled="function"==typeof e?e:null,this.onRejected="function"==typeof t?t:null,this.promise=n}function k(e,t){var n=!1;try{e(function(e){n||(n=!0,v(t,e))},function(e){n||(n=!0,m(t,e))})}catch(e){if(n)return;n=!0,m(t,e)}}p.prototype.catch=function(e){return this.then(null,e)},p.prototype.then=function(e,t){var n=new this.constructor(h);return y(this,new b(e,t,n)),n},p.prototype.finally=e,p.all=function(t){return new p(function(r,i){if(!c(t))return i(new TypeError("Promise.all accepts an array"));var o=Array.prototype.slice.call(t);if(0===o.length)return r([]);var s=o.length;function a(t,e){try{if(e&&("object"===l(e)||"function"==typeof e)){var n=e.then;if("function"==typeof n)return void n.call(e,function(e){a(t,e)},i)}o[t]=e,0==--s&&r(o)}catch(e){i(e)}}for(var e=0;e<o.length;e++)a(e,o[e])})},p.resolve=function(t){return t&&"object"===l(t)&&t.constructor===p?t:new p(function(e){e(t)})},p.reject=function(n){return new p(function(e,t){t(n)})},p.race=function(i){return new p(function(e,t){if(!c(i))return t(new TypeError("Promise.race accepts an array"));for(var n=0,r=i.length;n<r;n++)p.resolve(i[n]).then(e,t)})},p._immediateFn="function"==typeof setImmediate&&function(e){setImmediate(e)}||function(e){t(e,0)},p._unhandledRejectionFn=function(e){"undefined"!=typeof console&&console&&console.warn("Possible Unhandled Promise Rejection:",e)};var n=function(){if("undefined"!=typeof self)return self;if("undefined"!=typeof window)return window;if("undefined"!=typeof global)return global;throw new Error("unable to locate global object")}();"Promise"in n?n.Promise.prototype.finally||(n.Promise.prototype.finally=e):n.Promise=p;var _="undefined"!=typeof self?self:global,w={reProtocolAndHost:/^(https?:)?\/\/.+?\//i,reComments:/\/\*[\s\S]*?\*\/|([^:"'=]|^)\/\/.*$/gm,reCjsRequireCalls:/[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g,reExtension:/\.(\w{2,4})$/i,reVersionNumber:/^\s*([*<>^~])?(\d+)\.(\d+)(\.\d+)?(\.\d+)?(\-[\w\d]*)?(\-default)?\s*$/,reVersionNumberInUrl:/\/(\d*\.\d+(.\d*)?(.\d*)?(\-[\w\d]*)?)\//,reToleranceCharacters:/^[\^~*]/,reVersionSplitters:/[.-]/,reUrlWithoutProtocolNorSpecialCharacters:/(https?:)|[\._\/:\?&=]/g,registryElementAttributeKeys:["version","url","urls","name","sort","versions","type","factory","dependencies"],versionFormat:["major","minor","patch","build","rc"],returnDefaultOnVersionStr:["default","anonymous"],toleranceFormat:["*","^","~"]};function j(e){for(var t={},n=0;n<e.length;n++){var r=e[n];"string"!=typeof r||t.name?r instanceof Array&&!t.dependencies?t.dependencies=F(r):t.factory=r:t.name=r}return t.dependencies instanceof Array||(t.dependencies=[]),"function"==typeof t.factory&&function(n){n.factory.toString().replace(w.reComments,"").replace(w.reCjsRequireCalls,function(e,t){return n.dependencies.push(t)})}(t),t}function F(e){var t=function(){var e,t=null===(e=document.currentScript)||void 0===e?void 0:e.src;{if(t)return t;var n=document.getElementsByTagName("script");return n[n.length-1].src}}();return e.map(function(e){return"."!==e.charAt(0)?e:new URL(e,t).href})}var O=function(){if(document.currentScript)return document.currentScript;var e=document.head.getElementsByTagName("script");return e[e.length-1]},E={waitForDefine:function(t){return new Promise(function(e){return t.confirmDefine=e})},confirmDefine:function(e){var t=e.factory,n=e.dependencies,r=O();"function"==typeof r.confirmDefine&&"object"===l(r.versiontype)&&(r.versiontype.dependencies=n,r.confirmDefine(t)),r.confirmDefine=null},cancelDefine:function(e){"function"==typeof e.confirmDefine&&e.confirmDefine(e)},getCurrentVersion:function(){return O().version}},x=function(){function f(e){d(this,f);var t=l(e);if("string"===t)this.parse(e);else if("object"===t&&null!==e){var n=e.tolerance,r=e.minor,i=e.major,o=e.patch,s=e.build,a=e.rc,u=e.isdefault,c=e.str;this.tolerance=n,this.minor=r,this.major=i,this.patch=o,this.build=s,this.rc=a,this._isdefault=u,this._str=c}}return i(f,[{key:"parse",value:function(e){this._str=e.replace("-default",""),"*"===this._str&&(this.tolerance="*");var t=e.match(w.reVersionNumber);if(-1<e.indexOf("default")&&(this._isdefault=!0),t&&8===t.length){var n=t.indexOf("-default");-1<n&&t.splice(n,1),"string"==typeof t[1]&&(this.tolerance=t[1]),this.major=f.toNumber(t[2]),this.minor=f.toNumber(t[3]),"string"==typeof t[4]&&(this.patch=f.toNumber(t[4].substr(1))),"string"==typeof t[5]&&(this.build=f.toNumber(t[5].substr(1))),"string"==typeof t[6]&&(this.rc=f.toNumber(t[6].substr(1)))}}},{key:"default",get:function(){return this._isdefault||!1}},{key:"str",get:function(){if(this._str)return this._str;if(void 0===this.major)return"anonymous";var e=this.tolerance||"",t=void 0!==this.patch?".".concat(this.patch):"",n=void 0!==this.build?".".concat(this.build):"",r=void 0!==this.rc?"-".concat(this.rc):"";return"".concat(e).concat(this.major,".").concat(this.minor).concat(t).concat(n).concat(r)}}],[{key:"toNumber",value:function(e){var t=Number(e);return isNaN(t)?e:t}}]),f}(),P=function(){function c(e){d(this,c),this.files=[],this._splitEachArgumentIntoSingleFiles(e)}return i(c,[{key:"_splitEachArgumentIntoSingleFiles",value:function(e){for(var t=0;t<e.length;t++){var n=e[t],r=l(n);"string"===r?this._addFile(n):n instanceof Array?this._splitArrayIntoSingleFiles(n):"object"===r&&this._splitObjectIntoSingleFiles(n)}}},{key:"_splitArrayIntoSingleFiles",value:function(e){var t=this;e.forEach(function(e){"string"==typeof e?t._addFile(e):"object"===l(e)&&null!==e&&t._splitObjectIntoSingleFiles(e)})}},{key:"_splitObjectIntoSingleFiles",value:function(r){var i=this;Object.keys(r).forEach(function(n){var e=r[n],t=l(r[n]);"string"===t?i._addFile(n,e):e instanceof Array?e.forEach(function(e){var t=l(e);"string"===t?i._addFile(n,e):"object"===t&&i._splitPackageConfigObjectIntoFiles(n,e)}):"object"===t&&i._splitPackageConfigObjectIntoFiles(n,e)})}},{key:"_splitPackageConfigObjectIntoFiles",value:function(t,n){var r=this,e=n.version,i=n.versions,o=n.url,s=n.urls,a=n.type,u=n.dependencies,c=n.factory;i instanceof Array&&0<i.length?i.forEach(function(e){return r._splitPackageConfigObjectIntoFiles(t,f(f({},n),{},{version:e,versions:null}))}):s instanceof Array?s.forEach(function(e){return r._splitPackageConfigObjectIntoFiles(t,f(f({},n),{},{url:e,urls:null}))}):this._addFile(t,o,e,a,u,c)}},{key:"_addFile",value:function(e,t,n,r,i,o){if(e){t=t||e;var s=(r=r||c.guessType(e)||c.guessType(t))?new RegExp("^".concat(r,"!")):"",a=r?new RegExp("^".concat(r,"!|\\.").concat(r,"$"),"g"):"";(n=n||this._getVersionInfo(e,t))instanceof x||(n=new x(n));var u=new RegExp(this._getRegexpVersionString(n));this.files.push({name:e.replace(u,"").replace(a,"").replace(w.reVersionNumberInUrl,"").replace(w.reUrlWithoutProtocolNorSpecialCharacters,""),url:t.replace(u,"").replace(s,""),version:n,type:r,dependencies:i,factory:o})}}},{key:"_getVersionInfo",value:function(e,t){var n=c.getVersionFromName(e);if(n&&"default"===n){var r=c.getVersionFromUrl(t);return r?"".concat(r,"-default"):"default"}return c.getVersionFromUrl(t)}},{key:"_getRegexpVersionString",value:function(e){return"@("+e.str.replace(/\./g,"\\.").replace("^","\\^").replace("*","\\*")+")?(-?default)?$"}}],[{key:"guessType",value:function(e){if(e){var t=e.indexOf("@");-1<t&&(e=e.substring(0,t));var n=e.indexOf("!");if(-1<n)return e.substr(0,n);var r=w.reExtension.exec(e);if(r&&2===r.length)return r[1]}}},{key:"getVersionFromName",value:function(e){if(e){var t=e.indexOf("@");return-1<t?e.substr(t+1):null}}},{key:"getVersionFromUrl",value:function(e){if(e){var t=e.match(w.reVersionNumberInUrl);return t&&5===t.length?t[1]:null}}}]),c}(),q=function(){function n(e,t){d(this,n),this.parent=t,this.major=e.version.major,this.minor=e.version.minor,this.patch=e.version.patch,this.build=e.version.build,this.rc=e.version.rc,this.str=e.version.str||this._getVersionStr(),this.filetypes={}}return i(n,[{key:"addFileType",value:function(e){var t=this.str;if(!e.url&&e.urls instanceof Array&&(e.url=e.urls[0]),e.url||(e.url=""),!(-1<e.url.indexOf("${")))return this._processFileType(e);try{return this._processFileType(f(f({},e),{},{url:new Function(["version","obj"],"return `"+e.url+"`")(t,this)}))}catch(e){console.warn("Error parsing registry URL",e)}}},{key:"loadFileType",value:function(e){if(this.filetypes[e])return _.requirees.loaders.loadTypeFromVersion(this,e);console.warn("RequireEs: There is no ".concat(e,"-file present in package ").concat(this.parent.name," (version ").concat(this.str,")"))}},{key:"_processFileType",value:function(e){return e.type=e.type||P.guessType(e.url)||"js","object"!==l(this.filetypes[e.type])&&(this.filetypes[e.type]={urls:[]}),void 0!==e.factory&&(this.filetypes[e.type].factory=e.factory),e.dependencies instanceof Array&&(this.filetypes[e.type].dependencies=e.dependencies),-1===this.filetypes[e.type].urls.indexOf(e.url)&&this.filetypes[e.type].urls.push(e.url),this.filetypes[e.type]}},{key:"_getVersionStr",value:function(){var t=this;return this.str=w.versionFormat.map(function(e){return"rc"!==e&&t[e]}).filter(function(e){return"number"==typeof e||"string"==typeof e}).join("."),void 0!==this.rc&&null!==this.rc&&""!==this.rc&&(this.str+="".concat("string"==typeof this.rc?"-":".").concat(this.rc)),this.str}},{key:"test",value:function(e){var t=e.tolerance;if("*"===t)return!0;if("^"===t)return this.major===e.major;if("~"===t)return this.major===e.major&&this.minor===e.minor;for(var n=0;n<w.versionFormat.length;n++){var r=w.versionFormat[n];if(!t&&(this[r]||0)!==(e[r]||0))return!1}return Boolean(!t)}},{key:"toJson",value:function(){var e={filetypes:this.filetypes,major:this.major,minor:this.minor,str:this.str};return void 0!==this.patch&&(e.patch=this.patch),void 0!==this.build&&(e.build=this.build),void 0!==this.rc&&(e.rc=this.rc),e}}]),n}(),S=function(){function t(e){d(this,t),this.versions=[],this.isDirty=!1,this.name=e.name}return i(t,[{key:"find",value:function(t){return this.versions.filter(function(e){return e.test(t)})}},{key:"findOne",value:function(e){var t,n=u(this.versions);try{for(n.s();!(t=n.n()).done;){var r=t.value;if(r instanceof q&&r.test(e))return r}}catch(e){n.e(e)}finally{n.f()}return null}},{key:"remove",value:function(t){return t instanceof Array||(t=[t]),this.versions=this.versions.filter(function(e){return-1===t.indexOf(e)}),this}},{key:"length",value:function(){return this.versions.length}},{key:"add",value:function(e){e.version&&void 0!==e.version.tolerance&&delete e.version.tolerance;var t=this.findOne(e.version);return t instanceof q||(t=new q(e,this),this.versions.push(t),this.isDirty=!0,"boolean"==typeof e.sort&&!e.sort||this.sort(e)),t.addFileType(e),e.version.default&&(this.default=t),t}},{key:"sort",value:function(){return this.isDirty&&(this.versions=this.versions.sort(function(e,t){for(var n=0;n<w.versionFormat.length;n++){var r=w.versionFormat[n];if(e[r]!==t[r])return e[r]<t[r]?1:-1}})),this.isDirty=!1,this}},{key:"toJson",value:function(){return this.versions.map(function(e){return e.toJson()})}}]),t}(),A=function(){function t(e){d(this,t),this.options=e,this.packages={}}return i(t,[{key:"add",value:function(){var t=this,e=new P(arguments).files;return e instanceof Array&&e.forEach(function(e){t.packages[e.name]||(t.packages[e.name]=new S(e)),t.packages[e.name].add(e)}),this.sort(),this}},{key:"sort",value:function(){var t=this;Object.keys(this.packages).forEach(function(e){return t.packages[e].sort()})}},{key:"remove",value:function(){var e=new P(arguments),t=this.find(e);return t&&(t.pckg.length()===t.versions.length?delete this.packages[t.pckg.name]:t.pckg.delete(t.versions)),this}},{key:"find",value:function(){var e=new P(arguments).files;return e instanceof Array?this._find(e[0],!1):[]}},{key:"findOne",value:function(){var e=new P(arguments).files;return e instanceof Array?this._find(e[0],!0):null}},{key:"_find",value:function(e,t){var n=this.packages[e.name];if(n){var r,i={pckg:n,attrs:e};if(-1<w.returnDefaultOnVersionStr.indexOf(e.version.str)&&n.default)r=t?n.default:[n.default];else{var o=e.version&&void 0!==e.version.major?e.version:{tolerance:"*"};r=n[t?"findOne":"find"](o)}return i["match".concat(t?"":"es")]=r,i}return{attrs:e}}},{key:"toJson",value:function(){var t=this,n={};return Object.keys(this.packages).forEach(function(e){return n[e]=t.packages[e].toJson()}),n}}]),t}(),D=function(){function e(){d(this,e),this._reservedDependencies={},this.add("require",this.requireHandler.bind(this)).add("requirees",this.requireEsHandler.bind(this)).add("exports",this.exportsHandler.bind(this)).add("mdl",this.moduleHandler.bind(this))}return i(e,[{key:"add",value:function(e,t){return"function"==typeof t&&"string"==typeof e&&(this._reservedDependencies[e]=t),this}},{key:"get",value:function(e,t){var n=this._reservedDependencies[e];return n?n(t):null}},{key:"moduleHandler",value:function(e){return e.module||(e.module={id:e.parent.name,version:e,uri:e.urls,exports:e.exports||(e.exports={})})}},{key:"exportsHandler",value:function(e){return e.exports||(e.exports={})}},{key:"requireHandler",value:function(e){return e.require?e.require:this._makeNewRequireEsContext(e).require}},{key:"requireEsHandler",value:function(e){return e.requirees?e.requirees:this._makeNewRequireEsContext(e).requirees}},{key:"_makeNewRequireEsContext",value:function(e){var t=new G;return e.require=t.asFunction(!1),e.requirees=t.asFunction(!0),{requirees:e.requirees,require:e.require}}},{key:"reservedDependencyNames",get:function(){return Object.keys(this._reservedDependencies)}}]),e}();var R={load:function(n,r,e){return new Promise(function(e){var t=document.createElement("link");t.type="text/css",t.rel="stylesheet",t.href=n,t.onload=e.bind(r,t),document.head.appendChild(t)})},factoryRunner:function(e){if("string"==typeof e){var t=document.createElement("style");return t.innerText=e,document.head.appendChild(t)}}};function T(e){return fetch(e).then(function(e){return e.text()})}var N=null;function C(e){var t=(N=N||new DOMParser).parseFromString(e,"text/html");if(t.documentElement){if(-1!==e.indexOf("<body>"))return t.documentElement;var n=t.body&&t.body.children||[];return 1===n.length?n[0]:n}return e}var V={load:function(e,t,n){return new Promise(function(t){_.require("txt!".concat(e),function(e){t(C(e))})})},factoryRunner:function(e){return"string"==typeof e?C(e):e}},I=null;function U(){return(I=I||new DOMParser).parseFromString(txtXml,"application/xml")}var L={factoryRunner:function(e){return"string"==typeof e?U():e},load:function(e,t,n){return new Promise(function(t){_.require("txt!".concat(e),function(e){return t(U())})})}};function H(e,t,n){if(window.removeEventListener("error",n),t)throw t;E.cancelDefine(e)}function $(t,e,n){function r(e){return e.filename===t?i=e.error:null}var i;window.addEventListener("error",r);var o=document.createElement("script");return o.charset="utf-8",o.async=!0,o.addEventListener("error",function(){return H(o,"Error loading script: ".concat(t),r)}),o.addEventListener("load",function(){return H(o,i,r)}),o.src=t,o.version=e,o.versiontype=n,document.head.appendChild(o),E.waitForDefine(o)}var M={load:function(e){return fetch(e).then(function(e){return e.json()})},factoryRunner:function(e){return"string"==typeof e?JSON.parse(e):e}},J=function(){function t(e){d(this,t),this.version=e,this.name=e.parent.name}return i(t,[{key:"getAll",value:function(){return document.querySelectorAll(this.name)}}]),t}();function B(e,t){return"function"==typeof e?(e.prototype.getAssociatedVersion=function(){return t},customElements.define(t.parent.name,e),new J(t)):(console.warn("RequireEs: Custom elements should be functions (or classes) extended from any HTMLElement"),{error:"Not a valid custom element factory"})}var W={load:function(e,n,t){return new Promise(function(t){_.require(e,function(e){return t(B(e,n))})})},factoryRunner:function(e,t){return e instanceof J?e:B(e,t)}};function K(e,t){if(void 0!==_.WebAssembly)return fetch(e).then(function(e){return e.arrayBuffer()}).then(function(e){return WebAssembly.instantiate(e)}).then(function(e){return e.instance.exports});console.warn("Requirees: this browser does not support WebAssembly... Package ".concat(t.parent.name," cannot be loaded"))}var X=function(){function t(e){d(this,t),this.requireContext=e,this.reservedDependencies=new D,this.loaders={},this.unloaders={},this.factoryRunners={},this.add("js",$),this.add("wasm",K),this.add("tag",W),this.add("html",V),this.add("htm",V),this.add("xml",L),this.add("txt",T),this.add("json",M),this.add("css",R)}return i(t,[{key:"add",value:function(e,t){if("object"===l(t)){var n=t.load||t.loader||t.get,r=t.unload||t.unloader||t.remove||t.delete,i=t.handleFactory||t.factory||t.factoryRunner||t.factoryLoader;"function"==typeof n&&(this.loaders[e]=n),"function"==typeof r&&(this.unloaders[e]=r),"function"==typeof i&&(this.factoryRunners[e]=i)}else"function"==typeof t&&(this.loaders[e]=t)}},{key:"get",value:function(e){return this.loaders[e]||this.loaders.js}},{key:"load",value:function(e,t){var n=this,r=0<arguments.length&&void 0!==e?e:{},i=1<arguments.length&&void 0!==t?t:{},o=r.attrs;if(r.match){var s=r.match.filetypes,a=o&&o.type;if(a&&s[a])return this.loadTypeFromVersion(r.match,a);var u=!1,c=Object.keys(s).map(function(e){var t=n.loadTypeFromVersion(r.match,e);return t instanceof Promise&&(u=!0),t});return u?Promise.all(c).then(this._returnMultiFiletypeLoad.bind(this,s,i)):this._returnMultiFiletypeLoad(s,i,c)}return console.warn("Oh fudge, we did not find any package '".concat(o&&o.name||"<unknown>","' that matches version '").concat(o&&o.version&&o.version.str||"<unknown>","'")),null}},{key:"_returnMultiFiletypeLoad",value:function(e,t,n){var r=Object.keys(e);if(t.returnAll){var i={};return r.forEach(function(e,t){return i[e]=n[t]}),i}for(var o=Object.keys(this.loaders),s=0;s<o.length;s++){var a=r.indexOf(o[s]);if(-1<a)return n[a]}}},{key:"loadTypeFromVersion",value:function(n,r){var i=this,o=n.filetypes[r];if("object"===l(o)&&null!==o)return void 0!==o.exports?o.exports:o.dfr instanceof Promise?o.dfr:o.dfr=new Promise(function(t){o.factory?i._resolveFactoryDependencies(t,n,r):i._loadFromUrl(n,r).then(function(e){o.factory=e,i._resolveFactoryDependencies(t,n,r)})})}},{key:"_resolveFactoryDependencies",value:function(t,n,r){var i=this,o=n.filetypes[r],e=o.dependencies instanceof Array&&o.dependencies.length,s=this.reservedDependencies.reservedDependencyNames;if(e){var a=o.dependencies.map(function(e){return-1<s.indexOf(e)?i.reservedDependencies.get(e,o):i.requireContext.getPromise(e)});return Promise.all(a).then(function(e){return i._resolveFactory(t,n,r,e)})}return this._resolveFactory(t,n,r,[])}},{key:"_resolveFactory",value:function(e,t,n,r){var i,o=t.filetypes[n];i="function"==typeof this.factoryRunners[n]?i=this.factoryRunners[n].call(t,o.factory,t,o,r):"function"==typeof o.factory?o.factory.apply(t,r):o.factory,void 0===o.exports&&(o.exports=i),e(o.exports)}},{key:"_loadFromUrl",value:function(t,n,e){var r=2<arguments.length&&void 0!==e?e:0,i=this.get(n);if("function"==typeof i){var o=t.filetypes[n].urls;if(r<o.length)try{return i(o[r],t,t.filetypes[n])}catch(e){return this._loadFromUrl(t,n,r+1)}}}}]),t}();function z(n){var r=[];return"object"===l(n)&&Object.keys(n).forEach(function(t){var e=n[t];"string"==typeof e&&(e=[e]),e instanceof Array&&e.forEach(function(e){return r.push(o({},t,function(e){return-1===e.indexOf("!")&&!/\.js(\?.*)?$/.test(e)}(e)?"".concat(e,".js"):e))})}),r}var G=function(){function e(){d(this,e),this.registry=new A,this.amd={},this.loaders=new X(this)}return i(e,[{key:"define",value:function(){var e=j(arguments),t=e.name,n=e.dependencies,r=e.factory;if("string"==typeof t&&!("jquery"===t&&void 0===r)){var i={};i[t]={dependencies:n,factory:r},this.register(i)}else E.confirmDefine({dependencies:n,factory:r})}},{key:"get",value:function(){var n=this,e=function(e){for(var t={},n=0;n<e.length;n++){var r=e[n];r instanceof Array?t.dependencies=r:"string"!=typeof r||t.dependencies?"function"==typeof r?void 0===t.callback?t.callback=r:void 0===t.callbackFail&&(t.callbackFail=r):"object"===l(r)&&(t.options=r):(t.dependencies=[r],t.loadSinglePackage=!0)}return t}(arguments),t=e.dependencies,r=e.callback,i=e.loadSinglePackage,o=e.options,s=t.map(function(e){var t=n.findOne(e);return void 0===t.match&&(n.register(e,o),t=n.findOne(e)),n.loaders.load(t,o)}),a=Promise.all(s);return"function"==typeof r&&a.then(function(e){return r.apply(_,e)}),i?s[0]:a}},{key:"getPromise",value:function(){var t=arguments,n=this;return new Promise(function(e){return e(n.get.apply(n,t))})}},{key:"register",value:function(){return this.registry.add.apply(this.registry,arguments)}},{key:"find",value:function(){return this.registry.find.apply(this.registry,arguments)}},{key:"findOne",value:function(){return this.registry.findOne.apply(this.registry,arguments)}},{key:"config",value:function(e){var t=0<arguments.length&&void 0!==e?e:{};void 0!==t.paths&&z(t.paths).forEach(this.register.bind(this))}},{key:"specified",value:function(e){if("string"!=typeof e)return!1;var t=this.findOne(e);return console.log("is this package specified",t),!1}},{key:"asFunction",value:function(e){var t=e?this.getPromise.bind(this):this.get.bind(this);return t.register=this.register.bind(this),t.find=this.find.bind(this),t.findOne=this.findOne.bind(this),t.loaders=this.loaders,t.define=this.define.bind(this),t.config=this.config.bind(this),t.specified=this.specified.bind(this),t}}]),e}(),Q=new(_.RequireEs=G);_.require=_.requirejs=Q.asFunction(!1),_.requirees=Q.asFunction(!0),_.define=_.require.define,_.define.amd={}}();
