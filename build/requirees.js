!function(){"use strict";const e="undefined"!=typeof self?self:global,t={reIsAbsoluteUrl:/^(https?:)?\/\//i,reProtocolAndHost:/^(https?:)?\/\/.+?\//i,reComments:/\/\*[\s\S]*?\*\/|([^:"'=]|^)\/\/.*$/gm,reCjsRequireCalls:/[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g,reExtension:/\.(\w{2,4})(\?.*)?$/i,reVersionNumber:/^\s*([*<>^~])?(\d+)\.(\d+)(\.\d+)?(\.\d+)?(\-[\w\d]*)?(\-default)?\s*$/,reFindVersionNumber:/\s*@?(([*<>^~]?\d+\.\d+(\.\d+)?(\.\d+)?(\-[\w\d]*)?(\-default)?)|default)\s*/,reVersionNumberAtEnd:/\s*@?(([*<>^~]?\d+\.\d+(\.\d+)?(\.\d+)?(\-[\w\d]*)?(\-default)?)|default)\s*$/,reToleranceCharacters:/^[\^~*]/,reRelativePath:/\.\.?\//g,reVersionSplitters:/[.-]/,reUrlWithoutProtocolNorSpecialCharacters:/(https?:)|[\._:\?&=]/g,registryElementAttributeKeys:["version","url","urls","name","sort","versions","type","factory","dependencies"],versionFormat:["major","minor","patch","build","rc"],returnDefaultOnVersionStr:["default","anonymous"],toleranceFormat:["*","^","~"],events:{ns:"requirees.",pre:"pre-",register:"register",define:"define",loadFile:"file-load",wireTapEventName:"requirees.wiretaps",resolve:{regexp:/^([\w\.]*)(\[([0-9]*)\])?$/,fnName:1,fnIndex:3}}};function n(e){const n={};for(let r=0;r<e.length;r++){const s=e[r];"string"!=typeof s||n.name?s instanceof Array&&!n.dependencies?n.dependencies=s.map((e=>"."===e.charAt(0)?function(e){const n=["css","js","html","htm","json","tag","txt","wasm","xml"],r=e.match(t.reExtension);if(n.indexOf(null==r?void 0:r[1])>-1){const t=function(){var e;const t=null===(e=document.currentScript)||void 0===e?void 0:e.src;if(t)return t;{var n;const e=document.getElementsByTagName("script");return null===(n=e[e.length-1])||void 0===n?void 0:n.src}}();return new URL(e,t).href}return e.replace(/^\.\//,"")}(e):e)):n.factory=s:n.name=s}return n.dependencies instanceof Array||(n.dependencies=[],"function"==typeof n.factory&&function(e){e.factory.toString().replace(t.reComments,"").replace(t.reCjsRequireCalls,((t,n)=>e.dependencies.push(n)))}(n)),n}function r(){if(document.currentScript)return document.currentScript;{const e=document.head.getElementsByTagName("script");return e[e.length-1]}}var s={waitForDefine:function(e){return new Promise(((t,n)=>{e.confirmDefine=t,e.rejectDefine=n}))},confirmDefine:function(e){let{factory:n,dependencies:s}=e;const i=r()||{};return function(e){return"function"==typeof e.confirmDefine&&function(e){var n;const r=e.src,s=null===(n=e.versiontype)||void 0===n?void 0:n.urls;if(s instanceof Array)for(let e=0;e<s.length;e++){const n=s[e].replace(t.reRelativePath,"");if(r.indexOf(n)>-1)return!0}return!1}(e)}(i)?(i.versiontype.dependencies=s,i.confirmDefine(n),i.confirmDefine=null,{currentTag:i,success:!0}):{currentTag:i,success:!1}},cancelDefine:function(e,t){t?"function"==typeof e.rejectDefine&&e.rejectDefine():"function"==typeof e.confirmDefine&&e.confirmDefine(e)},getCurrentVersion:function(){return r().version}};function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}class c{constructor(e){const t=typeof e;if("string"===t)this.parse(e);else if("object"===t&&null!==e){const{tolerance:t,minor:n,major:r,patch:s,build:i,rc:o,isdefault:a,str:c}=e;this.tolerance=t,this.minor=n,this.major=r,this.patch=s,this.build=i,this.rc=o,this._isdefault=a,this._str=c}}parse(e){this._str=e.replace("-default",""),"*"===this._str&&(this.tolerance="*");const n=e.match(t.reVersionNumber);if(e.indexOf("default")>-1&&(this._isdefault=!0),n&&8===n.length){const e=n.indexOf("-default");e>-1&&n.splice(e,1),"string"==typeof n[1]&&(this.tolerance=n[1]),this.major=c.toNumber(n[2]),this.minor=c.toNumber(n[3]),"string"==typeof n[4]&&(this.patch=c.toNumber(n[4].substr(1))),"string"==typeof n[5]&&(this.build=c.toNumber(n[5].substr(1))),"string"==typeof n[6]&&(this.rc=c.toNumber(n[6].substr(1)))}}static toNumber(e){const t=Number(e);return isNaN(t)?e:t}get default(){return this._isdefault||!1}get str(){if(this._str)return this._str;if(void 0===this.major)return"anonymous";{const e=this.tolerance||"",t=void 0!==this.patch?`.${this.patch}`:"",n=void 0!==this.build?`.${this.build}`:"",r=void 0!==this.rc?`-${this.rc}`:"";return`${e}${this.major}.${this.minor}${t}${n}${r}`}}}class d{constructor(e){this.files=[],this._splitEachArgumentIntoSingleFiles(e)}_splitEachArgumentIntoSingleFiles(e){for(let t=0;t<e.length;t++){const n=e[t],r=typeof n;"string"===r?this._addFile(n):n instanceof Array?this._splitArrayIntoSingleFiles(n):"object"===r&&this._splitObjectIntoSingleFiles(n)}}_splitArrayIntoSingleFiles(e){e.forEach((e=>{"string"==typeof e?this._addFile(e):"object"==typeof e&&null!==e&&this._splitObjectIntoSingleFiles(e)}))}_splitObjectIntoSingleFiles(e){Object.keys(e).forEach((t=>{const n=e[t],r=typeof e[t];"string"===r?this._addFile(t,n):n instanceof Array?n.forEach((e=>{const n=typeof e;"string"===n?this._addFile(t,e):"object"===n&&this._splitPackageConfigObjectIntoFiles(t,e)})):"object"===r&&this._splitPackageConfigObjectIntoFiles(t,n)}))}_splitPackageConfigObjectIntoFiles(e,t){let{version:n,versions:r,url:s,urls:i,type:a,dependencies:c,factory:d,preventReregistration:l,dependencyOverrides:u}=t;r instanceof Array&&r.length>0?r.forEach((n=>this._splitPackageConfigObjectIntoFiles(e,o(o({},t),{},{version:n,versions:null})))):i instanceof Array?i.forEach((n=>this._splitPackageConfigObjectIntoFiles(e,o(o({},t),{},{url:n,urls:null})))):this._addFile(e,s,n,a,c,d,l,u)}_addFile(e,n,r,s,i,o,a,l){if(e){void 0===n&&(n=e.replace(t.reVersionNumberAtEnd,""));const u=(s=s||d.guessType(e)||d.guessType(n))?new RegExp(`^${s}!`):"",h=s?new RegExp(`^${s}!|\\.${s}$`,"g"):"";(r=r||this._getVersionInfo(e,n))instanceof c||(r=new c(r)),this.files.push({name:e.replace(t.reFindVersionNumber,"").replace(h,"").replace(t.reUrlWithoutProtocolNorSpecialCharacters,""),url:"string"==typeof n&&n.replace(u,""),version:r,type:s,dependencies:i,factory:o,preventReregistration:a,dependencyOverrides:l})}}_getVersionInfo(e,t){const n=d.getVersionString(e);if(null===n||"default"===n){const e=d.getVersionString(t);return"default"===n?e?`${e}-default`:"default":e}return n}static getVersionString(e){if(e){const n=e.match(t.reFindVersionNumber);return n&&7===n.length?n[1]:null}}static guessType(e){if(e){const n=(e=e.replace(t.reFindVersionNumber,"")).indexOf("!");if(n>-1)return e.substr(0,n);{const n=t.reExtension.exec(e);if(n&&3===n.length)return n[1]}}}}class l{constructor(e,t){this.parent=t,this.major=e.version.major,this.minor=e.version.minor,this.patch=e.version.patch,this.build=e.version.build,this.rc=e.version.rc,this.str=e.version.str||this._getVersionStr(),this.filetypes={}}addFileType(e){const t=this,n=t.str;if(!e.url&&e.urls instanceof Array&&(e.url=e.urls[0]),!(e.url&&e.url.indexOf("${")>-1))return this._processFileType(e);try{return this._processFileType(o(o({},e),{},{url:new Function(["version","obj"],"return `"+e.url+"`")(n,t)}))}catch(e){console.warn("Error parsing registry URL",e)}}loadFileType(t){if(this.filetypes[t])return e.requirees.loaders.loadTypeFromVersion(this,t);console.warn(`RequireEs: There is no ${t}-file present in package ${this.parent.name} (version ${this.str})`)}isSpecified(e){const t=(null==e?void 0:e.type)||e;if("string"==typeof t){const e=this.filetypes[t];return(null==e?void 0:e.hasOwnProperty("exports"))||!1}{const e=Object.keys(this.filetypes);for(let t=0;e.length>t;t++)if(!1===this.filetypes[e[t]].hasOwnProperty("exports"))return!1;return!0}}undef(e){const t=(null==e?void 0:e.type)||e;"string"==typeof t?delete this.filetypes[t]:Object.keys(this.filetypes).forEach((e=>delete this.filetypes[e]))}shim(t,n){if("object"!=typeof n)return;const r=this._getFile(t);r&&(n.deps instanceof Array&&this._addDependencies(r,n.deps,"PreLoad"),"string"==typeof n.exports&&(r.postFactory=()=>e[n.exports]),"function"==typeof n.exports&&(r.postFactory=n.exports))}addDependencies(e,t,n){if("object"!=typeof t)return;const r=this._getFile(e);this._addDependencies(r,t,n?"PreLoad":"Extra")}_getFile(e){let t=(null==e?void 0:e.type)||e;return"string"!=typeof t&&(t="js"),this.filetypes[t]}_addDependencies(e,t,n){const r=`dependencies${n}`;e[r]instanceof Array||(e[r]=[]),t instanceof Array&&t.forEach((t=>{"string"==typeof t&&-1===e[r].indexOf(t)&&e[r].push(t)}))}_processFileType(e){e.type=e.type||d.guessType(e.url)||"js","object"!=typeof this.filetypes[e.type]&&(this.filetypes[e.type]={urls:[]});const t=this.filetypes[e.type];return e.dependencyOverrides&&this._addDependencyOverrides(t,e.dependencyOverrides),void 0!==e.factory&&this._setFactory(e.factory,t),e.dependencies instanceof Array&&(t.dependencies=e.dependencies),"string"==typeof e.url&&-1===t.urls.indexOf(e.url)&&t.urls.unshift(e.url),t}_addDependencyOverrides(e,t){"object"==typeof t&&("object"!=typeof e.dependencyOverrides&&(e.dependencyOverrides={}),Object.assign(e.dependencyOverrides,t))}_setFactory(e,t){this._canBeDefined(t)?(delete t.dfr,delete t.exports,t.factory=e):console.warn(`RequireEs - Computer says no: package ${this.parent.name} - ${this.str} is already defined... Redefining this package is not allowed!`)}_getRequireEsConfigOptions(){var e,t,n;return null===(e=this.parent)||void 0===e||null===(t=e.parent)||void 0===t||null===(n=t.parent)||void 0===n?void 0:n.options}_canBeDefined(e){if(e.hasOwnProperty("exports")){return this._getRequireEsConfigOptions().allowRedefine||!1}return!0}_getVersionStr(){return this.str=t.versionFormat.map((e=>"rc"!==e&&this[e])).filter((e=>"number"==typeof e||"string"==typeof e)).join("."),void 0!==this.rc&&null!==this.rc&&""!==this.rc&&(this.str+=`${"string"==typeof this.rc?"-":"."}${this.rc}`),this.str}test(e){const n=e.tolerance;if("*"===n)return!0;if("^"===n)return this.major===e.major;if("~"===n)return this.major===e.major&&this.minor===e.minor;for(let r=0;r<t.versionFormat.length;r++){const s=t.versionFormat[r];if(!n&&(this[s]||0)!==(e[s]||0))return!1}return Boolean(!n)}toJson(){const e={filetypes:this.filetypes,major:this.major,minor:this.minor,str:this.str};return void 0!==this.patch&&(e.patch=this.patch),void 0!==this.build&&(e.build=this.build),void 0!==this.rc&&(e.rc=this.rc),e}}class u{constructor(e,t){this.parent=t,this.versions=[],this.isDirty=!1,this.name=e.name}find(e){return this.versions.filter((t=>t.test(e)))}findOne(e){for(let t of this.versions)if(t instanceof l&&t.test(e))return t;return null}remove(e){return e instanceof Array||(e=[e]),this.versions=this.versions.filter((t=>-1===e.indexOf(t))),this}length(){return this.versions.length}add(e){e.version&&void 0!==e.version.tolerance&&delete e.version.tolerance;let t=this.findOne(e.version);return t instanceof l||(t=new l(e,this),this.versions.push(t),this.isDirty=!0,("boolean"!=typeof e.sort||e.sort)&&this.sort(e)),t.addFileType(e),e.version.default&&(this.default=t),t}sort(e){return this.isDirty&&(this.versions=this.versions.sort(((e,n)=>{for(let r=0;r<t.versionFormat.length;r++){const s=t.versionFormat[r];if(e[s]!==n[s])return e[s]<n[s]?1:-1}}))),this.isDirty=!1,this}toJson(){return this.versions.map((e=>e.toJson()))}}class h{constructor(e,t){this.parent=t,this.options=e,this.packages={}}add(){const{files:e}=new d(arguments);return e instanceof Array&&e.forEach((e=>{this._allowRegister(e)&&(this._publish(`${t.events.ns}${t.events.pre}${t.events.register}`,{file:e}),this.packages[e.name]||(this.packages[e.name]=new u(e,this)),this.packages[e.name].add(e),this._publish(`${t.events.ns}${t.events.register}`,{package:this.packages[e.name],file:e}))})),this.sort(),this}_allowRegister(e){return!e.preventReregistration||void 0===this.packages[e.name]}_publish(e,t){var n,r;null===(n=this.parent)||void 0===n||null===(r=n.events)||void 0===r||r.publish(e,t)}sort(){Object.keys(this.packages).forEach((e=>this.packages[e].sort()))}remove(){const e=new d(arguments),t=this.find(e);return t&&(t.pckg.length()===t.versions.length?delete this.packages[t.pckg.name]:t.pckg.delete(t.versions)),this}find(){const{files:e}=new d(arguments);return e instanceof Array?this._find(e[0],!1):[]}findOne(){const{files:e}=new d(arguments);return e instanceof Array?this._find(e[0],!0):null}_find(e,n){const r=this.packages[e.name];if(r){let s;const i={pckg:r,attrs:e};if(t.returnDefaultOnVersionStr.indexOf(e.version.str)>-1&&r.default)s=n?r.default:[r.default];else{const t=e.version&&void 0!==e.version.major?e.version:{tolerance:"*"};s=r[n?"findOne":"find"](t)}return i["match"+(n?"":"es")]=s,i}return{attrs:e}}toJson(){const e={};return Object.keys(this.packages).forEach((t=>e[t]=this.packages[t].toJson())),e}}class f{constructor(){this._reservedDependencies={},this.add("require",this.requireHandler.bind(this)).add("requirees",this.requireEsHandler.bind(this)).add("exports",this.exportsHandler.bind(this)).add("mdl",this.moduleHandler.bind(this))}add(e,t){return"function"==typeof t&&"string"==typeof e&&(this._reservedDependencies[e]=t),this}get(e,t){const n=this._reservedDependencies[e];return n?n(t):null}moduleHandler(e){var t;return e.uri=e.urls,e.id=null===(t=e.parent)||void 0===t?void 0:t.name,void 0===e.exports&&(e.exports={}),e}exportsHandler(e){return void 0===e.exportsPreFactoryRun&&(e.exportsPreFactoryRun={}),e.exportsPreFactoryRun}requireHandler(e){if(e.require)return e.require;{const{require:t}=this._makeNewRequireEsContext(e);return t}}requireEsHandler(e){if(e.requirees)return e.requirees;{const{requirees:t}=this._makeNewRequireEsContext(e);return t}}_makeNewRequireEsContext(e){const t=new R;return e.require=t.asFunction(!1),e.requirees=t.asFunction(!0),{requirees:e.requirees,require:e.require}}get reservedDependencyNames(){return Object.keys(this._reservedDependencies)}}var p={load:function(e,t,n,r){return new Promise((n=>{const s=document.createElement("link");s.type="text/css",s.rel="stylesheet",s.href=e,s.onload=n.bind(t,s),r&&r.events.publish("requirees.styletag.preadd",s),document.head.appendChild(s),r&&r.events.publish("requirees.styletag.added",s)}))},factoryRunner:function(e){if("string"==typeof e){const t=document.createElement("style");return t.innerText=e,document.head.appendChild(t)}}};function y(e){return fetch(e).then((e=>e.text()))}let g=null;function v(e){g||(g=new DOMParser);const t=g.parseFromString(e,"text/html");if(t.documentElement){if(-1===e.indexOf("<body>")){const e=t.body&&t.body.children||[];return 1===e.length?e[0]:e}return t.documentElement}return e}var m={load:function(t,n,r){return new Promise((n=>{e.require(`txt!${t}`,(e=>{n(v(e))}))}))},factoryRunner:function(e){return"string"==typeof e?v(e):e}};let b=null;function _(e){return b||(b=new DOMParser),b.parseFromString(e,"application/xml")}var O={factoryRunner:function(e){return"string"==typeof e?_(e):e},load:function(t,n,r){return new Promise((n=>{e.require(`txt!${t}`,(e=>n(_(e))))}))}};function F(e,t){t&&document.head.removeChild(e),s.cancelDefine(e,t)}function j(e,t,n,r){const i=document.createElement("script");if(i.charset="utf-8",i.async=!0,i.addEventListener("error",(()=>F(i,`requirees: could not load ${e}`))),i.addEventListener("load",(()=>F(i))),i.src=e,i.version=t,i.versiontype=n,i.src!==e){var o;const n=null===(o=t.filetypes.js)||void 0===o?void 0:o.urls,r=null==n?void 0:n.indexOf(e);null==n||n.splice(r,1,i.src)}return r&&r.events.publish("requirees.scripttag.preadd",i),document.head.appendChild(i),r&&r.events.publish("requirees.scripttag.added",i),s.waitForDefine(i)}var w={load:function(e){return fetch(e).then((e=>e.json()))},factoryRunner:function(e){return"string"==typeof e?JSON.parse(e):e}};class x{constructor(e){this.version=e,this.name=e.parent.name}getAll(){return document.querySelectorAll(this.name)}}function E(e,t){return"function"==typeof e?(e.prototype.getAssociatedVersion=function(){return t},customElements.define(t.parent.name,e),new x(t)):(console.warn("RequireEs: Custom elements should be functions (or classes) extended from any HTMLElement"),{error:"Not a valid custom element factory"})}var k={load:function(t,n,r){return new Promise((r=>{e.require(t,(e=>r(E(e,n))))}))},factoryRunner:function(e,t){return e instanceof x?e:E(e,t)}};function q(t,n){if(void 0!==e.WebAssembly)return fetch(t).then((e=>e.arrayBuffer())).then((e=>WebAssembly.instantiate(e))).then((e=>e.instance.exports));console.warn(`Requirees: this browser does not support WebAssembly... Package ${n.parent.name} cannot be loaded`)}class D{constructor(e){this.requireContext=e,this.reservedDependencies=new f(e),this.loaders={},this.unloaders={},this.factoryRunners={},this.add("js",j),this.add("wasm",q),this.add("tag",k),this.add("html",m),this.add("htm",m),this.add("xml",O),this.add("txt",y),this.add("json",w),this.add("css",p)}add(e,t){if("object"==typeof t){const n=t.load||t.loader||t.get,r=t.unload||t.unloader||t.remove||t.delete,s=t.handleFactory||t.factory||t.factoryRunner||t.factoryLoader;"function"==typeof n&&(this.loaders[e]=n),"function"==typeof r&&(this.unloaders[e]=r),"function"==typeof s&&(this.factoryRunners[e]=s)}else"function"==typeof t&&(this.loaders[e]=t)}get(e){return this.loaders[e]||this.loaders.js}load(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};const n=e.attrs;if(e.match){let r=e.match.filetypes;const s=n&&n.type;if(s&&r[s])return this.loadTypeFromVersion(e.match,s);{let n=!1;const s=Object.keys(r).map((t=>{const r=this.loadTypeFromVersion(e.match,t);return r instanceof Promise&&(n=!0),r}));return n?Promise.all(s).then(this._returnMultiFiletypeLoad.bind(this,r,t)):this._returnMultiFiletypeLoad(r,t,s)}}return console.warn(`RequireEs - Oh fudge, we did not find any package '${n&&n.name||"<unknown>"}' that matches version '${n&&n.version&&n.version.str||"<unknown>"}'`),null}_returnMultiFiletypeLoad(e,t,n){const r=Object.keys(e);if(t.returnAll){const e={};return r.forEach(((t,r)=>e[t]=n[r])),e}{const e=Object.keys(this.loaders);for(let t=0;t<e.length;t++){const s=r.indexOf(e[t]);if(s>-1)return n[s]}}}loadTypeFromVersion(e,n){const r=e.filetypes[n];if(this._publishEvt(`${t.events.ns}${t.events.pre}${t.events.loadFile}`,{package:e.parent,versiontype:r,version:e}),"object"==typeof r&&null!==r)return void 0!==r.exports?r.exports:r.dfr instanceof Promise?r.dfr:r.dfr=new Promise(((t,s)=>{r.factory?this._resolveFactoryDependencies(t,e,n):this._loadFromUrl(e,n).then((s=>{r.factory=s,this._resolveFactoryDependencies(t,e,n)})).catch(s)})).then((n=>(this._publishEvt(`${t.events.ns}${t.events.loadFile}`,{package:e.parent,instance:n,versiontype:r,version:e}),n)))}_publishEvt(e,t){this.requireContext.events.publish(e,t)}_getDependencies(e){return e.dependencies instanceof Array?"object"==typeof e.dependencyOverrides?e.dependencies.map((t=>e.dependencyOverrides[t]||t)):e.dependencies:[]}_resolveFactoryDependencies(e,t,n){const r=t.filetypes[n],s=this._getDependencies(r),i=r.dependenciesExtra instanceof Array?r.dependenciesExtra:[],o=r.dependenciesPreLoad instanceof Array?r.dependenciesPreLoad:[],a=s.concat(i).concat(o),c=this.reservedDependencies.reservedDependencyNames;if(a.length){const s=a.map((e=>c.indexOf(e)>-1?this.reservedDependencies.get(e,r):this.requireContext.get(e)));return Promise.all(s).then((r=>this._resolveFactory(e,t,n,r)))}return this._resolveFactory(e,t,n,[])}_resolveFactory(e,t,n,r){const s=t.filetypes[n];let i;i="function"==typeof this.factoryRunners[n]?i=this.factoryRunners[n].call(t,s.factory,t,s,r):"function"==typeof s.factory?s.factory.apply(t,r):s.factory,void 0!==s.exportsPreFactoryRun&&(s.exports=s.exportsPreFactoryRun),void 0===s.exports&&("function"==typeof s.postFactory&&(i=s.postFactory(i)),s.exports=i),e(s.exports)}_getDownloadUrl(e){const n=this._getBaseUrl();return n&&!t.reIsAbsoluteUrl.test(e)?new URL(e,n).href:e}_getBaseUrl(){var e,t;return null===(e=this.requireContext)||void 0===e||null===(t=e.options)||void 0===t?void 0:t.baseUrl}_loadFromUrl(e,t){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;const r=this.get(t);if("function"==typeof r){const s=e.filetypes[t],i=s.urls;if(n<i.length){const o=this._getDownloadUrl(i[n]);try{return this._waitForPreLoadDependencies(s).then((()=>r(o,e,s,this.requireContext)))}catch(r){return this._loadFromUrl(e,t,n+1)}}}}_waitForPreLoadDependencies(e){return e.dependenciesPreLoad instanceof Array&&e.dependenciesPreLoad.length>0?this.requireContext.getPromise(e.dependenciesPreLoad):Promise.resolve()}}class P{constructor(){this.register={}}subscribe(e,t){return this.register[e]instanceof Array||(this.register[e]=[]),this.register[e].push(t),`${e}[${this.register[e].length-1}]`}unsubscribe(e){try{const n=e.match(t.events.resolve.regexp),r=n[t.events.resolve.fnName],s=n[t.events.resolve.fnIndex];void 0===s?delete this.register[r]:delete this.register[r][s]}catch(t){console.warn(`RequireEs: we could not unsubscribe from ${e}`,t)}}publish(e,n){(this.register[e]instanceof Array?this.register[e]:[]).concat(this.register[t.events.wireTapEventName]).forEach((t=>{try{"function"==typeof t&&t(n,e)}catch(t){console.error(`RequireEs: Error while executing a function in ${e}`,t)}}))}addWireTap(e){return"function"==typeof e?this.subscribe(t.events.wireTapEventName,e):null}}function $(e){return-1===e.indexOf("!")&&!/\.js(\?.*)?$/.test(e)}class R{constructor(e){this.events=new P,this.registry=new h(e,this),this.loaders=new D(this),this.options=e||{},this.amd={}}define(){const e=n(arguments),{name:r,dependencies:s,factory:i}=e;this.events.publish(`${t.events.ns}${t.events.pre}${t.events.define}`,{args:e});const o="string"==typeof r&&!("jquery"===r&&void 0===i),a=this._defineAnonymousModule(s,i,o),c=o?this._defineNamedModule(r,s,i):null;return this.events.publish(`${t.events.ns}${t.events.define}`,{args:e}),c||a}_defineNamedModule(e,t,n,r){const s={};return s[e]={dependencies:t,factory:n,url:!1,preventReregistration:r},this.register(s)}_defineAnonymousModule(e,t,n){const r=s.confirmDefine({dependencies:e,factory:t});if(!r.success&&r.currentTag instanceof HTMLElement){const s=this._defineNamedModule(r.currentTag.src,e,t,!0);if(!n&&this.options.invokeNonMatchedDefines){var i,o;const e=null===(i=new d([r.currentTag.src]).files)||void 0===i||null===(o=i[0])||void 0===o?void 0:o.name;e&&this.get(e)}return s}}get(){const{dependencies:t,callback:n,callbackFail:r,loadSinglePackage:s,options:i}=function(e){const t={};for(let n=0;n<e.length;n++){const r=e[n];r instanceof Array?t.dependencies=r:"string"!=typeof r||t.dependencies?"function"==typeof r?void 0===t.callback?t.callback=r:void 0===t.callbackFail&&(t.callbackFail=r):"object"==typeof r&&(t.options=r):(t.dependencies=[r],t.loadSinglePackage=!0)}return t}(arguments),o="function"==typeof r?r:e=>console.error(e),a=t.map((e=>{let t=this.findOne(e);return void 0===t.match&&(this.register(e,i),t=this.findOne(e)),this.loaders.load(t,i)})),c=Promise.all(a);return"function"==typeof n&&c.then((t=>n.apply(e,t))).catch((t=>o.apply(e,t))),s?a[0]:c}getPromise(){return new Promise((e=>e(this.get.apply(this,arguments))))}register(){return this.registry.add.apply(this.registry,arguments)}find(){return this.registry.find.apply(this.registry,arguments)}findOne(){return this.registry.findOne.apply(this.registry,arguments)}_setBaseUrl(e){const n=`${e}${e.endsWith("/")?"":"/"}`;this.options.baseUrl=t.reIsAbsoluteUrl.test(n)?n:new URL(n,window.location.origin).href}config(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};void 0!==e.paths&&function(e){const t=[];return"object"==typeof e&&Object.keys(e).forEach((n=>{let r=e[n];"string"==typeof r&&(r=[r]),r instanceof Array&&r.forEach((e=>t.push({[n]:$(e)?`${e}.js`:e})))})),t}(e.paths).forEach((e=>this.register(e))),void 0!==e.allowRedefine&&(this.options.allowRedefine=e.allowRedefine),void 0!==e.invokeNonMatchedDefines&&(this.options.invokeNonMatchedDefines=e.invokeNonMatchedDefines),"object"==typeof e.shim&&this.shim(e.shim),"string"==typeof e.baseUrl&&this._setBaseUrl(e.baseUrl)}specified(e){if("string"==typeof e){const t=this.findOne(e);return t.match&&t.match.isSpecified(t.attrs)||!1}return!1}undef(e){if("string"==typeof e){const t=this.findOne(e);return t.match&&t.match.undef(t.attrs)}}shim(e){Object.keys(e).forEach((t=>{if("string"==typeof t){var n;let r=this.findOne(t);void 0===r.match&&(this.register({[t]:{url:!1}}),r=this.findOne(t)),null===(n=r.match)||void 0===n||n.shim(r.attrs,e[t])}}))}asFunction(e){const t=e?this.getPromise.bind(this):this.get.bind(this);return t.register=this.register.bind(this),t.find=this.find.bind(this),t.findOne=this.findOne.bind(this),t.loaders=this.loaders,t.define=this.define.bind(this),t.config=this.config.bind(this),t.specified=this.specified.bind(this),t.shim=this.shim.bind(this),t.undef=this.undef.bind(this),t.on=this.events.subscribe.bind(this.events),t.subscribe=this.events.subscribe.bind(this.events),t.unsubscribe=this.events.unsubscribe.bind(this.events),t.publish=this.events.publish.bind(this.events),t.addWireTap=this.events.addWireTap.bind(this.events),t.events=this.events,t}}e.RequireEs=R;const A=new R;e.require=e.requirejs=A.asFunction(!1),e.requirees=A.asFunction(!0),e.define=e.require.define,e.define.amd={}}();
