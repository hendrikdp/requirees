!function(){"use strict";var a="undefined"!=typeof self?self:global,f={reIsAbsoluteUrl:/^(https?:)?\/\//i,reProtocolAndHost:/^(https?:)?\/\/.+?\//i,reComments:/\/\*[\s\S]*?\*\/|([^:"'=]|^)\/\/.*$/gm,reCjsRequireCalls:/[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g,reExtension:/\.(\w{2,4})(\?.*)?$/i,reVersionNumber:/^\s*([*<>^~])?(\d+)\.(\d+)(\.\d+)?(\.\d+)?(\-[\w\d]*)?(\-default)?\s*$/,reFindVersionNumber:/\s*@?(([*<>^~]?\d+\.\d+(\.\d+)?(\.\d+)?(\-[\w\d]*)?(\-default)?)|default)\s*/,reVersionNumberAtEnd:/\s*@?(([*<>^~]?\d+\.\d+(\.\d+)?(\.\d+)?(\-[\w\d]*)?(\-default)?)|default)\s*$/,reToleranceCharacters:/^[\^~*]/,reRelativePath:/\.\.?\//g,reVersionSplitters:/[.-]/,reUrlWithoutProtocolNorSpecialCharacters:/(https?:)|[\._:\?&=]/g,registryElementAttributeKeys:["version","url","urls","name","sort","versions","type","factory","dependencies"],versionFormat:["major","minor","patch","build","rc"],returnDefaultOnVersionStr:["default","anonymous"],toleranceFormat:["*","^","~"],events:{ns:"requirees.",pre:"pre-",register:"register",define:"define",loadFile:"file-load",wireTapEventName:"requirees.wiretaps",resolve:{regexp:/^([\w\.]*)(\[([0-9]*)\])?$/,fnName:1,fnIndex:3}}};function r(t,e){var n,r=Object.keys(t);return Object.getOwnPropertySymbols&&(n=Object.getOwnPropertySymbols(t),e&&(n=n.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),r.push.apply(r,n)),r}function d(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?r(Object(n),!0).forEach(function(e){o(t,e,n[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))})}return t}function u(e){return(u="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function h(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function s(e,t,n){t&&i(e.prototype,t),n&&i(e,n),Object.defineProperty(e,"prototype",{writable:!1})}function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function c(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function l(e,t){var n,r="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!r){if(Array.isArray(e)||(r=function(e,t){if(e){if("string"==typeof e)return c(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Map"===(n="Object"===n&&e.constructor?e.constructor.name:n)||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?c(e,t):void 0}}(e))||t&&e&&"number"==typeof e.length)return r&&(e=r),n=0,{s:t=function(){},n:function(){return n>=e.length?{done:!0}:{done:!1,value:e[n++]}},e:function(e){throw e},f:t};throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,s=!0,o=!1;return{s:function(){r=r.call(e)},n:function(){var e=r.next();return s=e.done,e},e:function(e){o=!0,i=e},f:function(){try{s||null==r.return||r.return()}finally{if(o)throw i}}}}function p(e){for(var n,t={},r=0;r<e.length;r++){var i=e[r];"string"!=typeof i||t.name?i instanceof Array&&!t.dependencies?t.dependencies=i.map(function(e){return"."===e.charAt(0)?(n=(t=e).match(f.reExtension),-1<["css","js","html","htm","json","tag","txt","wasm","xml"].indexOf(null==n?void 0:n[1])?(n=function(){var e=null==(e=document.currentScript)?void 0:e.src;return e||(e=document.getElementsByTagName("script"),null==(e=e[e.length-1])?void 0:e.src)}(),new URL(t,n).href):t.replace(/^\.\//,"")):e;var t,n}):t.factory=i:t.name=i}return t.dependencies instanceof Array||(t.dependencies=[],"function"==typeof t.factory&&(n=t).factory.toString().replace(f.reComments,"").replace(f.reCjsRequireCalls,function(e,t){return n.dependencies.push(t)})),t}function y(){var e;return document.currentScript||(e=document.head.getElementsByTagName("script"))[e.length-1]}var v={waitForDefine:function(n){return new Promise(function(e,t){n.confirmDefine=e,n.rejectDefine=t})},confirmDefine:function(e){var t,n=e.factory,e=e.dependencies,r=y()||{};return"function"==typeof(t=r).confirmDefine&&function(e){var t=e.src,n=null==(e=e.versiontype)?void 0:e.urls;if(n instanceof Array)for(var r=0;r<n.length;r++){var i=n[r].replace(f.reRelativePath,"");if(-1<t.indexOf(i))return 1}return}(t)?(r.versiontype.dependencies=e,r.confirmDefine(n),r.confirmDefine=null,{currentTag:r,success:!0}):{currentTag:r,success:!1}},cancelDefine:function(e,t){t?"function"==typeof e.rejectDefine&&e.rejectDefine():"function"==typeof e.confirmDefine&&e.confirmDefine(e)},getCurrentVersion:function(){return y().version}},m=function(){function c(e){h(this,c);var t,n,r,i,s,o,a=u(e);"string"===a?this.parse(e):"object"===a&&null!==e&&(a=e.tolerance,t=e.minor,n=e.major,r=e.patch,i=e.build,s=e.rc,o=e.isdefault,e=e.str,this.tolerance=a,this.minor=t,this.major=n,this.patch=r,this.build=i,this.rc=s,this._isdefault=o,this._str=e)}return s(c,[{key:"parse",value:function(e){this._str=e.replace("-default",""),"*"===this._str&&(this.tolerance="*");var t=e.match(f.reVersionNumber);-1<e.indexOf("default")&&(this._isdefault=!0),t&&8===t.length&&(-1<(e=t.indexOf("-default"))&&t.splice(e,1),"string"==typeof t[1]&&(this.tolerance=t[1]),this.major=c.toNumber(t[2]),this.minor=c.toNumber(t[3]),"string"==typeof t[4]&&(this.patch=c.toNumber(t[4].substr(1))),"string"==typeof t[5]&&(this.build=c.toNumber(t[5].substr(1))),"string"==typeof t[6]&&(this.rc=c.toNumber(t[6].substr(1))))}},{key:"default",get:function(){return this._isdefault||!1}},{key:"str",get:function(){var e,t,n,r;return this._str||(void 0===this.major?"anonymous":(e=this.tolerance||"",t=void 0!==this.patch?".".concat(this.patch):"",n=void 0!==this.build?".".concat(this.build):"",r=void 0!==this.rc?"-".concat(this.rc):"","".concat(e).concat(this.major,".").concat(this.minor).concat(t).concat(n).concat(r)))}}],[{key:"toNumber",value:function(e){var t=Number(e);return isNaN(t)?e:t}}]),c}(),g=function(){function l(e){h(this,l),this.files=[],this._splitEachArgumentIntoSingleFiles(e)}return s(l,[{key:"_splitEachArgumentIntoSingleFiles",value:function(e){for(var t=0;t<e.length;t++){var n=e[t],r=u(n);"string"===r?this._addFile(n):n instanceof Array?this._splitArrayIntoSingleFiles(n):"object"===r&&this._splitObjectIntoSingleFiles(n)}}},{key:"_splitArrayIntoSingleFiles",value:function(e){var t=this;e.forEach(function(e){"string"==typeof e?t._addFile(e):"object"===u(e)&&null!==e&&t._splitObjectIntoSingleFiles(e)})}},{key:"_splitObjectIntoSingleFiles",value:function(r){var i=this;Object.keys(r).forEach(function(n){var e=r[n],t=u(r[n]);"string"===t?i._addFile(n,e):e instanceof Array?e.forEach(function(e){var t=u(e);"string"===t?i._addFile(n,e):"object"===t&&i._splitPackageConfigObjectIntoFiles(n,e)}):"object"===t&&i._splitPackageConfigObjectIntoFiles(n,e)})}},{key:"_splitPackageConfigObjectIntoFiles",value:function(t,n){var r=this,e=n.version,i=n.versions,s=n.url,o=n.urls,a=n.type,c=n.dependencies,u=n.factory,l=n.preventReregistration,f=n.dependencyOverrides;i instanceof Array&&0<i.length?i.forEach(function(e){return r._splitPackageConfigObjectIntoFiles(t,d(d({},n),{},{version:e,versions:null}))}):o instanceof Array?o.forEach(function(e){return r._splitPackageConfigObjectIntoFiles(t,d(d({},n),{},{url:e,urls:null}))}):this._addFile(t,s,e,a,c,u,l,f)}},{key:"_addFile",value:function(e,t,n,r,i,s,o,a){var c,u;e&&(void 0===t&&(t=e.replace(f.reVersionNumberAtEnd,"")),c=(r=r||l.guessType(e)||l.guessType(t))?new RegExp("^".concat(r,"!")):"",u=r?new RegExp("^".concat(r,"!|\\.").concat(r,"$"),"g"):"",(n=n||this._getVersionInfo(e,t))instanceof m||(n=new m(n)),this.files.push({name:e.replace(f.reFindVersionNumber,"").replace(u,"").replace(f.reUrlWithoutProtocolNorSpecialCharacters,""),url:"string"==typeof t&&t.replace(c,""),version:n,type:r,dependencies:i,factory:s,preventReregistration:o,dependencyOverrides:a}))}},{key:"_getVersionInfo",value:function(e,t){e=l.getVersionString(e);return null===e||"default"===e?(t=l.getVersionString(t),"default"===e?t?"".concat(t,"-default"):"default":t):e}}],[{key:"getVersionString",value:function(e){if(e)return(e=e.match(f.reFindVersionNumber))&&7===e.length?e[1]:null}},{key:"guessType",value:function(e){if(e){var t=(e=e.replace(f.reFindVersionNumber,"")).indexOf("!");if(-1<t)return e.substr(0,t);t=f.reExtension.exec(e);return t&&3===t.length?t[1]:void 0}}}]),l}(),b=function(){function n(e,t){h(this,n),this.parent=t,this.major=e.version.major,this.minor=e.version.minor,this.patch=e.version.patch,this.build=e.version.build,this.rc=e.version.rc,this.str=e.version.str||this._getVersionStr(),this.filetypes={}}return s(n,[{key:"addFileType",value:function(e){var t=this.str;if(!e.url&&e.urls instanceof Array&&(e.url=e.urls[0]),!(e.url&&-1<e.url.indexOf("${")))return this._processFileType(e);try{return this._processFileType(d(d({},e),{},{url:new Function(["version","obj"],"return `"+e.url+"`")(t,this)}))}catch(e){console.warn("Error parsing registry URL",e)}}},{key:"loadFileType",value:function(e){if(this.filetypes[e])return a.requirees.loaders.loadTypeFromVersion(this,e);console.warn("RequireEs: There is no ".concat(e,"-file present in package ").concat(this.parent.name," (version ").concat(this.str,")"))}},{key:"isSpecified",value:function(e){var e=(null==e?void 0:e.type)||e;if("string"==typeof e)return(null==(e=this.filetypes[e])?void 0:e.hasOwnProperty("exports"))||!1;for(var t=Object.keys(this.filetypes),n=0;t.length>n;n++)if(!1===this.filetypes[t[n]].hasOwnProperty("exports"))return!1;return!0}},{key:"undef",value:function(e){var t=this,e=(null==e?void 0:e.type)||e;"string"==typeof e?delete this.filetypes[e]:Object.keys(this.filetypes).forEach(function(e){return delete t.filetypes[e]})}},{key:"shim",value:function(e,t){"object"===u(t)&&(e=this._getFile(e))&&(t.deps instanceof Array&&this._addDependencies(e,t.deps,"PreLoad"),"string"==typeof t.exports&&(e.postFactory=function(){return a[t.exports]}),"function"==typeof t.exports&&(e.postFactory=t.exports))}},{key:"addDependencies",value:function(e,t,n){"object"===u(t)&&(e=this._getFile(e),this._addDependencies(e,t,n?"PreLoad":"Extra"))}},{key:"_getFile",value:function(e){e=(null==e?void 0:e.type)||e;return this.filetypes[e="string"!=typeof e?"js":e]}},{key:"_addDependencies",value:function(t,e,n){var r="dependencies".concat(n);t[r]instanceof Array||(t[r]=[]),e instanceof Array&&e.forEach(function(e){"string"==typeof e&&-1===t[r].indexOf(e)&&t[r].push(e)})}},{key:"_processFileType",value:function(e){e.type=e.type||g.guessType(e.url)||"js","object"!==u(this.filetypes[e.type])&&(this.filetypes[e.type]={urls:[]});var t=this.filetypes[e.type];return e.dependencyOverrides&&this._addDependencyOverrides(t,e.dependencyOverrides),void 0!==e.factory&&this._setFactory(e.factory,t),e.dependencies instanceof Array&&(t.dependencies=e.dependencies),"string"==typeof e.url&&-1===t.urls.indexOf(e.url)&&t.urls.unshift(e.url),t}},{key:"_addDependencyOverrides",value:function(e,t){"object"===u(t)&&("object"!==u(e.dependencyOverrides)&&(e.dependencyOverrides={}),Object.assign(e.dependencyOverrides,t))}},{key:"_setFactory",value:function(e,t){this._canBeDefined(t)?(delete t.dfr,delete t.exports,t.factory=e):console.warn("RequireEs - Computer says no: package ".concat(this.parent.name," - ").concat(this.str," is already defined... Redefining this package is not allowed!"))}},{key:"_getRequireEsConfigOptions",value:function(){var e;return null==(e=this.parent)||null==(e=e.parent)||null==(e=e.parent)?void 0:e.options}},{key:"_canBeDefined",value:function(e){return!e.hasOwnProperty("exports")||(this._getRequireEsConfigOptions().allowRedefine||!1)}},{key:"_getVersionStr",value:function(){var t=this;return this.str=f.versionFormat.map(function(e){return"rc"!==e&&t[e]}).filter(function(e){return"number"==typeof e||"string"==typeof e}).join("."),void 0!==this.rc&&null!==this.rc&&""!==this.rc&&(this.str+="".concat("string"==typeof this.rc?"-":".").concat(this.rc)),this.str}},{key:"test",value:function(e){var t=e.tolerance;if("*"===t)return!0;if("^"===t)return this.major===e.major;if("~"===t)return this.major===e.major&&this.minor===e.minor;for(var n=0;n<f.versionFormat.length;n++){var r=f.versionFormat[n];if(!t&&(this[r]||0)!==(e[r]||0))return!1}return Boolean(!t)}},{key:"toJson",value:function(){var e={filetypes:this.filetypes,major:this.major,minor:this.minor,str:this.str};return void 0!==this.patch&&(e.patch=this.patch),void 0!==this.build&&(e.build=this.build),void 0!==this.rc&&(e.rc=this.rc),e}}]),n}(),k=function(){function n(e,t){h(this,n),this.parent=t,this.versions=[],this.isDirty=!1,this.name=e.name}return s(n,[{key:"find",value:function(t){return this.versions.filter(function(e){return e.test(t)})}},{key:"findOne",value:function(e){var t,n=l(this.versions);try{for(n.s();!(t=n.n()).done;){var r=t.value;if(r instanceof b&&r.test(e))return r}}catch(e){n.e(e)}finally{n.f()}return null}},{key:"remove",value:function(t){return t instanceof Array||(t=[t]),this.versions=this.versions.filter(function(e){return-1===t.indexOf(e)}),this}},{key:"length",value:function(){return this.versions.length}},{key:"add",value:function(e){e.version&&void 0!==e.version.tolerance&&delete e.version.tolerance;var t=this.findOne(e.version);return t instanceof b||(t=new b(e,this),this.versions.push(t),this.isDirty=!0,"boolean"==typeof e.sort&&!e.sort||this.sort(e)),t.addFileType(e),e.version.default&&(this.default=t),t}},{key:"sort",value:function(e){return this.isDirty&&(this.versions=this.versions.sort(function(e,t){for(var n=0;n<f.versionFormat.length;n++){var r=f.versionFormat[n];if(e[r]!==t[r])return e[r]<t[r]?1:-1}})),this.isDirty=!1,this}},{key:"toJson",value:function(){return this.versions.map(function(e){return e.toJson()})}}]),n}(),n=function(){function n(e,t){h(this,n),this.parent=t,this.options=e,this.packages={}}return s(n,[{key:"add",value:function(){var t=this,e=new g(arguments).files;return e instanceof Array&&e.forEach(function(e){t._allowRegister(e)&&(t._publish("".concat(f.events.ns).concat(f.events.pre).concat(f.events.register),{file:e}),t.packages[e.name]||(t.packages[e.name]=new k(e,t)),t.packages[e.name].add(e),t._publish("".concat(f.events.ns).concat(f.events.register),{package:t.packages[e.name],file:e}))}),this.sort(),this}},{key:"_allowRegister",value:function(e){return!e.preventReregistration||void 0===this.packages[e.name]}},{key:"_publish",value:function(e,t){var n;null!=(n=this.parent)&&null!=(n=n.events)&&n.publish(e,t)}},{key:"sort",value:function(){var t=this;Object.keys(this.packages).forEach(function(e){return t.packages[e].sort()})}},{key:"remove",value:function(){var e=new g(arguments),e=this.find(e);return e&&(e.pckg.length()===e.versions.length?delete this.packages[e.pckg.name]:e.pckg.delete(e.versions)),this}},{key:"find",value:function(){var e=new g(arguments).files;return e instanceof Array?this._find(e[0],!1):[]}},{key:"findOne",value:function(){var e=new g(arguments).files;return e instanceof Array?this._find(e[0],!0):null}},{key:"_find",value:function(e,t){var n,r,i=this.packages[e.name];return i?(n={pckg:i,attrs:e},i=-1<f.returnDefaultOnVersionStr.indexOf(e.version.str)&&i.default?t?i.default:[i.default]:(r=e.version&&void 0!==e.version.major?e.version:{tolerance:"*"},i[t?"findOne":"find"](r)),n["match".concat(t?"":"es")]=i,n):{attrs:e}}},{key:"toJson",value:function(){var t=this,n={};return Object.keys(this.packages).forEach(function(e){return n[e]=t.packages[e].toJson()}),n}}]),n}(),O=function(){function e(){h(this,e),this._reservedDependencies={},this.add("require",this.requireHandler.bind(this)).add("requirees",this.requireEsHandler.bind(this)).add("exports",this.exportsHandler.bind(this)).add("mdl",this.moduleHandler.bind(this))}return s(e,[{key:"add",value:function(e,t){return"function"==typeof t&&"string"==typeof e&&(this._reservedDependencies[e]=t),this}},{key:"get",value:function(e,t){e=this._reservedDependencies[e];return e?e(t):null}},{key:"moduleHandler",value:function(e){var t;return e.uri=e.urls,e.id=null==(t=e.parent)?void 0:t.name,void 0===e.exports&&(e.exports={}),e}},{key:"exportsHandler",value:function(e){return void 0===e.exportsPreFactoryRun&&(e.exportsPreFactoryRun={}),e.exportsPreFactoryRun}},{key:"requireHandler",value:function(e){return e.require||this._makeNewRequireEsContext(e).require}},{key:"requireEsHandler",value:function(e){return e.requirees||this._makeNewRequireEsContext(e).requirees}},{key:"_makeNewRequireEsContext",value:function(e){var t=new T;return e.require=t.asFunction(!1),e.requirees=t.asFunction(!0),{requirees:e.requirees,require:e.require}}},{key:"reservedDependencyNames",get:function(){return Object.keys(this._reservedDependencies)}}]),e}();var _={load:function(n,r,e){return new Promise(function(e){var t=document.createElement("link");t.type="text/css",t.rel="stylesheet",t.href=n,t.onload=e.bind(r,t),document.head.appendChild(t)})},factoryRunner:function(e){var t;if("string"==typeof e)return(t=document.createElement("style")).innerText=e,document.head.appendChild(t)}};function w(e){return fetch(e).then(function(e){return e.text()})}var j=null;function F(e){var t,n=(j=j||new DOMParser).parseFromString(e,"text/html");return n.documentElement?-1===e.indexOf("<body>")?1===(t=n.body&&n.body.children||[]).length?t[0]:t:n.documentElement:e}var x={load:function(e,t,n){return new Promise(function(t){a.require("txt!".concat(e),function(e){t(F(e))})})},factoryRunner:function(e){return"string"==typeof e?F(e):e}},t=null;function E(e){return(t=t||new DOMParser).parseFromString(e,"application/xml")}var P={factoryRunner:function(e){return"string"==typeof e?E(e):e},load:function(e,t,n){return new Promise(function(t){a.require("txt!".concat(e),function(e){return t(E(e))})})}};function D(e,t){t&&document.head.removeChild(e),v.cancelDefine(e,t)}function A(e,t,n){var r=document.createElement("script");return r.charset="utf-8",r.async=!0,r.addEventListener("error",function(){return D(r,"requirees: could not load ".concat(e))}),r.addEventListener("load",function(){return D(r)}),r.src=e,r.version=t,r.versiontype=n,r.src!==e&&(n=null==(t=null==(n=t.filetypes.js)?void 0:n.urls)?void 0:t.indexOf(e),null!=t&&t.splice(n,1,r.src)),document.head.appendChild(r),v.waitForDefine(r)}var q={load:function(e){return fetch(e).then(function(e){return e.json()})},factoryRunner:function(e){return"string"==typeof e?JSON.parse(e):e}},R=function(){function t(e){h(this,t),this.version=e,this.name=e.parent.name}return s(t,[{key:"getAll",value:function(){return document.querySelectorAll(this.name)}}]),t}();function S(e,t){return"function"==typeof e?(e.prototype.getAssociatedVersion=function(){return t},customElements.define(t.parent.name,e),new R(t)):(console.warn("RequireEs: Custom elements should be functions (or classes) extended from any HTMLElement"),{error:"Not a valid custom element factory"})}var N={load:function(e,n,t){return new Promise(function(t){a.require(e,function(e){return t(S(e,n))})})},factoryRunner:function(e,t){return e instanceof R?e:S(e,t)}};function C(e,t){if(void 0!==a.WebAssembly)return fetch(e).then(function(e){return e.arrayBuffer()}).then(function(e){return WebAssembly.instantiate(e)}).then(function(e){return e.instance.exports});console.warn("Requirees: this browser does not support WebAssembly... Package ".concat(t.parent.name," cannot be loaded"))}var V=function(){function t(e){h(this,t),this.requireContext=e,this.reservedDependencies=new O(e),this.loaders={},this.unloaders={},this.factoryRunners={},this.add("js",A),this.add("wasm",C),this.add("tag",N),this.add("html",x),this.add("htm",x),this.add("xml",P),this.add("txt",w),this.add("json",q),this.add("css",_)}return s(t,[{key:"add",value:function(e,t){var n,r,i;"object"===u(t)?(n=t.load||t.loader||t.get,r=t.unload||t.unloader||t.remove||t.delete,i=t.handleFactory||t.factory||t.factoryRunner||t.factoryLoader,"function"==typeof n&&(this.loaders[e]=n),"function"==typeof r&&(this.unloaders[e]=r),"function"==typeof i&&(this.factoryRunners[e]=i)):"function"==typeof t&&(this.loaders[e]=t)}},{key:"get",value:function(e){return this.loaders[e]||this.loaders.js}},{key:"load",value:function(){var e,t,n,r=this,i=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{},s=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{},o=i.attrs;return i.match?(e=i.match.filetypes,(n=o&&o.type)&&e[n]?this.loadTypeFromVersion(i.match,n):(t=!1,n=Object.keys(e).map(function(e){e=r.loadTypeFromVersion(i.match,e);return e instanceof Promise&&(t=!0),e}),t?Promise.all(n).then(this._returnMultiFiletypeLoad.bind(this,e,s)):this._returnMultiFiletypeLoad(e,s,n))):(console.warn("RequireEs - Oh fudge, we did not find any package '".concat(o&&o.name||"<unknown>","' that matches version '").concat(o&&o.version&&o.version.str||"<unknown>","'")),null)}},{key:"_returnMultiFiletypeLoad",value:function(e,t,n){var r,i=Object.keys(e);if(t.returnAll)return r={},i.forEach(function(e,t){return r[e]=n[t]}),r;for(var s=Object.keys(this.loaders),o=0;o<s.length;o++){var a=i.indexOf(s[o]);if(-1<a)return n[a]}}},{key:"loadTypeFromVersion",value:function(n,r){var i=this,s=n.filetypes[r];if(this._publishEvt("".concat(f.events.ns).concat(f.events.pre).concat(f.events.loadFile),{package:n.parent,versiontype:s,version:n}),"object"===u(s)&&null!==s)return void 0!==s.exports?s.exports:s.dfr instanceof Promise?s.dfr:s.dfr=new Promise(function(t,e){s.factory?i._resolveFactoryDependencies(t,n,r):i._loadFromUrl(n,r).then(function(e){s.factory=e,i._resolveFactoryDependencies(t,n,r)}).catch(e)}).then(function(e){return i._publishEvt("".concat(f.events.ns).concat(f.events.loadFile),{package:n.parent,instance:e,versiontype:s,version:n}),e})}},{key:"_publishEvt",value:function(e,t){this.requireContext.events.publish(e,t)}},{key:"_getDependencies",value:function(t){return t.dependencies instanceof Array?"object"===u(t.dependencyOverrides)?t.dependencies.map(function(e){return t.dependencyOverrides[e]||e}):t.dependencies:[]}},{key:"_resolveFactoryDependencies",value:function(t,n,r){var i=this,s=n.filetypes[r],e=this._getDependencies(s),o=s.dependenciesExtra instanceof Array?s.dependenciesExtra:[],a=s.dependenciesPreLoad instanceof Array?s.dependenciesPreLoad:[],e=e.concat(o).concat(a),c=this.reservedDependencies.reservedDependencyNames;return e.length?(o=e.map(function(e){return-1<c.indexOf(e)?i.reservedDependencies.get(e,s):i.requireContext.get(e)}),Promise.all(o).then(function(e){return i._resolveFactory(t,n,r,e)})):this._resolveFactory(t,n,r,[])}},{key:"_resolveFactory",value:function(e,t,n,r){var i=t.filetypes[n],n="function"==typeof this.factoryRunners[n]?this.factoryRunners[n].call(t,i.factory,t,i,r):"function"==typeof i.factory?i.factory.apply(t,r):i.factory;void 0!==i.exportsPreFactoryRun&&(i.exports=i.exportsPreFactoryRun),void 0===i.exports&&("function"==typeof i.postFactory&&(n=i.postFactory(n)),i.exports=n),e(i.exports)}},{key:"_getDownloadUrl",value:function(e){var t=this._getBaseUrl();return t&&!f.reIsAbsoluteUrl.test(e)?new URL(e,t).href:e}},{key:"_getBaseUrl",value:function(){var e;return null==(e=this.requireContext)||null==(e=e.options)?void 0:e.baseUrl}},{key:"_loadFromUrl",value:function(t,n){var r=2<arguments.length&&void 0!==arguments[2]?arguments[2]:0,e=this.get(n);if("function"==typeof e){var i=t.filetypes[n],s=i.urls;if(r<s.length){var o=this._getDownloadUrl(s[r]);try{return this._waitForPreLoadDependencies(i).then(function(){return e(o,t,i)})}catch(e){return this._loadFromUrl(t,n,r+1)}}}}},{key:"_waitForPreLoadDependencies",value:function(e){return e.dependenciesPreLoad instanceof Array&&0<e.dependenciesPreLoad.length?this.requireContext.getPromise(e.dependenciesPreLoad):Promise.resolve()}}]),t}(),U=function(){function e(){h(this,e),this.register={}}return s(e,[{key:"subscribe",value:function(e,t){return this.register[e]instanceof Array||(this.register[e]=[]),this.register[e].push(t),"".concat(e,"[").concat(this.register[e].length-1,"]")}},{key:"unsubscribe",value:function(t){try{var e=t.match(f.events.resolve.regexp),n=e[f.events.resolve.fnName],r=e[f.events.resolve.fnIndex];void 0===r?delete this.register[n]:delete this.register[n][r]}catch(e){console.warn("RequireEs: we could not unsubscribe from ".concat(t),e)}}},{key:"publish",value:function(t,n){(this.register[t]instanceof Array?this.register[t]:[]).concat(this.register[f.events.wireTapEventName]).forEach(function(e){try{"function"==typeof e&&e(n,t)}catch(e){console.error("RequireEs: Error while executing a function in ".concat(t),e)}})}},{key:"addWireTap",value:function(e){return"function"==typeof e?this.subscribe(f.events.wireTapEventName,e):null}}]),e}();function I(t){var r=[];return"object"===u(t)&&Object.keys(t).forEach(function(n){var e=t[n];(e="string"==typeof e?[e]:e)instanceof Array&&e.forEach(function(e){return r.push(o({},n,-1!==(t=e).indexOf("!")||/\.js(\?.*)?$/.test(t)?e:"".concat(e,".js")));var t})}),r}var T=function(){function t(e){h(this,t),this.events=new U,this.registry=new n(e,this),this.loaders=new V(this),this.options=e||{},this.amd={}}return s(t,[{key:"define",value:function(){var e=p(arguments),t=e.name,n=e.dependencies,r=e.factory,i=(this.events.publish("".concat(f.events.ns).concat(f.events.pre).concat(f.events.define),{args:e}),"string"==typeof t&&!("jquery"===t&&void 0===r)),s=this._defineAnonymousModule(n,r,i),i=i?this._defineNamedModule(t,n,r):null;return this.events.publish("".concat(f.events.ns).concat(f.events.define),{args:e}),i||s}},{key:"_defineNamedModule",value:function(e,t,n,r){var i={};return i[e]={dependencies:t,factory:n,url:!1,preventReregistration:r},this.register(i)}},{key:"_defineAnonymousModule",value:function(e,t,n){var r=v.confirmDefine({dependencies:e,factory:t});if(!r.success&&r.currentTag instanceof HTMLElement)return e=this._defineNamedModule(r.currentTag.src,e,t,!0),!n&&this.options.invokeNonMatchedDefines&&(r=null==(t=new g([r.currentTag.src]).files)||null==(n=t[0])?void 0:n.name)&&this.get(r),e}},{key:"get",value:function(){var n=this,e=function(e){for(var t={},n=0;n<e.length;n++){var r=e[n];r instanceof Array?t.dependencies=r:"string"!=typeof r||t.dependencies?"function"==typeof r?void 0===t.callback?t.callback=r:void 0===t.callbackFail&&(t.callbackFail=r):"object"===u(r)&&(t.options=r):(t.dependencies=[r],t.loadSinglePackage=!0)}return t}(arguments),t=e.dependencies,r=e.callback,i=e.callbackFail,s=e.loadSinglePackage,o=e.options,e=t.map(function(e){var t=n.findOne(e);return void 0===t.match&&(n.register(e,o),t=n.findOne(e)),n.loaders.load(t,o)}),t=Promise.all(e);return"function"==typeof r&&t.then(function(e){return r.apply(a,e)}).catch(function(e){return i.apply(a,e)}),s?e[0]:t}},{key:"getPromise",value:function(){var t=arguments,n=this;return new Promise(function(e){return e(n.get.apply(n,t))})}},{key:"register",value:function(){return this.registry.add.apply(this.registry,arguments)}},{key:"find",value:function(){return this.registry.find.apply(this.registry,arguments)}},{key:"findOne",value:function(){return this.registry.findOne.apply(this.registry,arguments)}},{key:"_setBaseUrl",value:function(e){e="".concat(e).concat(e.endsWith("/")?"":"/");this.options.baseUrl=f.reIsAbsoluteUrl.test(e)?e:new URL(e,window.location.origin).href}},{key:"config",value:function(){var t=this,e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{};void 0!==e.paths&&I(e.paths).forEach(function(e){return t.register(e)}),void 0!==e.allowRedefine&&(this.options.allowRedefine=e.allowRedefine),void 0!==e.invokeNonMatchedDefines&&(this.options.invokeNonMatchedDefines=e.invokeNonMatchedDefines),"object"===u(e.shim)&&this.shim(e.shim),"string"==typeof e.baseUrl&&this._setBaseUrl(e.baseUrl)}},{key:"specified",value:function(e){return"string"==typeof e&&(e=this.findOne(e)).match&&e.match.isSpecified(e.attrs)||!1}},{key:"undef",value:function(e){if("string"==typeof e)return(e=this.findOne(e)).match&&e.match.undef(e.attrs)}},{key:"shim",value:function(r){var i=this;Object.keys(r).forEach(function(e){var t,n;"string"==typeof e&&(void 0===(n=i.findOne(e)).match&&(i.register(o({},e,{url:!1})),n=i.findOne(e)),null!=(t=n.match)&&t.shim(n.attrs,r[e]))})}},{key:"asFunction",value:function(e){e=(e?this.getPromise:this.get).bind(this);return e.register=this.register.bind(this),e.find=this.find.bind(this),e.findOne=this.findOne.bind(this),e.loaders=this.loaders,e.define=this.define.bind(this),e.config=this.config.bind(this),e.specified=this.specified.bind(this),e.shim=this.shim.bind(this),e.undef=this.undef.bind(this),e.on=this.events.subscribe.bind(this.events),e.subscribe=this.events.subscribe.bind(this.events),e.unsubscribe=this.events.unsubscribe.bind(this.events),e.publish=this.events.publish.bind(this.events),e.addWireTap=this.events.addWireTap.bind(this.events),e.events=this.events,e}}]),t}(),e=new(a.RequireEs=T);a.require=a.requirejs=e.asFunction(!1),a.requirees=e.asFunction(!0),a.define=a.require.define,a.define.amd={}}();
