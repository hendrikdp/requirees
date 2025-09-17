(function () {
    'use strict';

    const root = typeof self !== 'undefined' ? self : global;
    const constants = {
      reIsAbsoluteUrl: /^(https?:)?\/\//i,
      reProtocolAndHost: /^(https?:)?\/\/.+?\//i,
      reComments: /\/\*[\s\S]*?\*\/|([^:"'=]|^)\/\/.*$/mg,
      reCjsRequireCalls: /[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g,
      reExtension: /\.(\w{2,4})(\?.*)?$/i,
      reVersionNumber: /^\s*([*<>^~])?(\d+)\.(\d+)(\.\d+)?(\.\d+)?(\-[\w\d]*)?(\-default)?\s*$/,
      reFindVersionNumber: /\s*@?(([*<>^~]?\d+\.\d+(\.\d+)?(\.\d+)?(\-[\w\d]*)?(\-default)?)|default)\s*/,
      reVersionNumberAtEnd: /\s*@?(([*<>^~]?\d+\.\d+(\.\d+)?(\.\d+)?(\-[\w\d]*)?(\-default)?)|default)\s*$/,
      reToleranceCharacters: /^[\^~*]/,
      reRelativePath: /\.\.?\//g,
      reVersionSplitters: /[.-]/,
      reUrlWithoutProtocolNorSpecialCharacters: /(https?:)|[\._:\?&=]/g,
      registryElementAttributeKeys: ['version', 'url', 'urls', 'name', 'sort', 'versions', 'type', 'factory', 'dependencies'],
      versionFormat: ['major', 'minor', 'patch', 'build', 'rc'],
      returnDefaultOnVersionStr: ['default', 'anonymous'],
      toleranceFormat: ['*', '^', '~'],
      events: {
        ns: 'requirees.',
        pre: 'pre-',
        register: 'register',
        define: 'define',
        loadFile: 'file-load',
        wireTapEventName: 'requirees.wiretaps',
        resolve: {
          regexp: /^([\w\.]*)(\[([0-9]*)\])?$/,
          fnName: 1,
          fnIndex: 3
        }
      }
    };

    function _defineProperty(e, r, t) {
      return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
        value: t,
        enumerable: !0,
        configurable: !0,
        writable: !0
      }) : e[r] = t, e;
    }
    function ownKeys(e, r) {
      var t = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var o = Object.getOwnPropertySymbols(e);
        r && (o = o.filter(function (r) {
          return Object.getOwnPropertyDescriptor(e, r).enumerable;
        })), t.push.apply(t, o);
      }
      return t;
    }
    function _objectSpread2(e) {
      for (var r = 1; r < arguments.length; r++) {
        var t = null != arguments[r] ? arguments[r] : {};
        r % 2 ? ownKeys(Object(t), !0).forEach(function (r) {
          _defineProperty(e, r, t[r]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
          Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
        });
      }
      return e;
    }
    function _toPrimitive(t, r) {
      if ("object" != typeof t || !t) return t;
      var e = t[Symbol.toPrimitive];
      if (void 0 !== e) {
        var i = e.call(t, r || "default");
        if ("object" != typeof i) return i;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return ("string" === r ? String : Number)(t);
    }
    function _toPropertyKey(t) {
      var i = _toPrimitive(t, "string");
      return "symbol" == typeof i ? i : i + "";
    }

    //handle the amd define arguments
    function getDefinitionArguments(args) {
      const defineArguments = {};
      for (let iArg = 0; iArg < args.length; iArg++) {
        const arg = args[iArg];
        if (typeof arg === 'string' && !defineArguments.name) {
          defineArguments.name = arg;
        } else if (arg instanceof Array && !defineArguments.dependencies) {
          defineArguments.dependencies = convertRelativeUrls(arg);
        } else {
          defineArguments.factory = arg;
        }
      }
      //check for commonjs dependencies if dependencies are missing
      if (!(defineArguments.dependencies instanceof Array)) {
        defineArguments.dependencies = [];
        if (typeof defineArguments.factory === 'function') getDependenciesFromFactory(defineArguments);
      }
      //expose defined module
      return defineArguments;
    }

    //convert relative urls (./ ../)
    function convertRelativeUrls(urls) {
      return urls.map(url => url.charAt(0) === '.' ? normalizeRelativeUrl(url) : url);
    }

    //normalize the relative urls (only if a valid extention is provided), otherwise treat it as a package name (RequireJs)
    function normalizeRelativeUrl(url) {
      //todo: remove below with a dynamic list! (use loader registration)
      const ALLOWED_EXTENTIONS = ['css', 'js', 'html', 'htm', 'json', 'tag', 'txt', 'wasm', 'xml'];
      const urlFragments = url.match(constants.reExtension);
      //remove the ./ if no allowed extension is provided
      if (ALLOWED_EXTENTIONS.indexOf(urlFragments === null || urlFragments === void 0 ? void 0 : urlFragments[1]) > -1) {
        const currentScriptUrl = getCurrentScriptLocation();
        const absUrl = new URL(url, currentScriptUrl);
        return absUrl.href;
      } else {
        return url.replace(/^\.\//, '');
      }
    }

    //get the location of the current script
    function getCurrentScriptLocation() {
      var _document$currentScri;
      const baseUrl = (_document$currentScri = document.currentScript) === null || _document$currentScri === void 0 ? void 0 : _document$currentScri.src;
      if (baseUrl) {
        return baseUrl;
      } else {
        var _scripts;
        const scripts = document.getElementsByTagName('script');
        return (_scripts = scripts[scripts.length - 1]) === null || _scripts === void 0 ? void 0 : _scripts.src;
      }
    }

    //find all require() statements and push these as dependencies (to support cjs modules)
    function getDependenciesFromFactory(defineArguments) {
      defineArguments.factory.toString().replace(constants.reComments, '').replace(constants.reCjsRequireCalls, (match, dep) => defineArguments.dependencies.push(dep));
    }

    //parse the arguments comming into require method
    function getRequireArguments(args) {
      const requireArguments = {};
      for (let iArg = 0; iArg < args.length; iArg++) {
        const arg = args[iArg];
        if (arg instanceof Array) {
          requireArguments.dependencies = arg;
        } else if (typeof arg === 'string' && !requireArguments.dependencies) {
          requireArguments.dependencies = [arg];
          requireArguments.loadSinglePackage = true;
        } else if (typeof arg === 'function') {
          if (typeof requireArguments.callback === 'undefined') {
            requireArguments.callback = arg;
          } else if (typeof requireArguments.callbackFail === 'undefined') {
            requireArguments.callbackFail = arg;
          }
        } else if (typeof arg === 'object') {
          requireArguments.options = arg;
        }
      }
      //expose targets and callback
      return requireArguments;
    }

    const waitForDefine = function (tag) {
      return new Promise((resolve, reject) => {
        tag.confirmDefine = resolve;
        tag.rejectDefine = reject;
      });
    };
    function confirmDefine({
      factory,
      dependencies
    }) {
      const currentTag = _getCurrentTag() || {};
      if (_isWaitingForDefineConfirmation(currentTag)) {
        currentTag.versiontype.dependencies = dependencies;
        currentTag.confirmDefine(factory);
        currentTag.confirmDefine = null;
        return {
          currentTag,
          success: true
        };
      } else {
        return {
          currentTag,
          success: false
        };
      }
    }
    function _isWaitingForDefineConfirmation(currentTag) {
      return typeof currentTag.confirmDefine === 'function' && _doesCurrentTagMatchesCurrentDefine(currentTag);
    }
    function _doesCurrentTagMatchesCurrentDefine(currentTag) {
      var _currentTag$versionty;
      const currentSource = currentTag.src;
      const urls = (_currentTag$versionty = currentTag.versiontype) === null || _currentTag$versionty === void 0 ? void 0 : _currentTag$versionty.urls;
      if (urls instanceof Array) {
        for (let i = 0; i < urls.length; i++) {
          const url = urls[i].replace(constants.reRelativePath, '');
          if (currentSource.indexOf(url) > -1) return true;
        }
      }
      return false;
    }
    function getCurrentVersion() {
      const currentTag = _getCurrentTag();
      return currentTag.version;
    }
    function _getCurrentTag() {
      if (document.currentScript) {
        return document.currentScript;
      } else {
        const scripts = document.head.getElementsByTagName('script');
        return scripts[scripts.length - 1];
      }
    }
    function cancelDefine(tag, err) {
      if (err) {
        if (typeof tag.rejectDefine === 'function') tag.rejectDefine();
      } else {
        if (typeof tag.confirmDefine === 'function') tag.confirmDefine(tag);
      }
    }
    var currentTagLoad = {
      waitForDefine,
      confirmDefine,
      cancelDefine,
      getCurrentVersion
    };

    class VersionNumber {
      constructor(version) {
        const versionType = typeof version;
        if (versionType === 'string') {
          this.parse(version);
        } else if (versionType === 'object' && version !== null) {
          const {
            tolerance,
            minor,
            major,
            patch,
            build,
            rc,
            isdefault,
            str
          } = version;
          this.tolerance = tolerance;
          this.minor = minor;
          this.major = major;
          this.patch = patch;
          this.build = build;
          this.rc = rc;
          this._isdefault = isdefault;
          this._str = str;
        }
      }
      parse(str) {
        this._str = str.replace('-default', '');
        if (this._str === '*') this.tolerance = '*';
        const versionFragments = str.match(constants.reVersionNumber);
        if (str.indexOf('default') > -1) this._isdefault = true;
        if (versionFragments && versionFragments.length === 8) {
          //check if this is a default package
          const indexOfDefault = versionFragments.indexOf('-default');
          if (indexOfDefault > -1) versionFragments.splice(indexOfDefault, 1);
          //fill out the rest of the version object
          if (typeof versionFragments[1] === 'string') this.tolerance = versionFragments[1];
          this.major = VersionNumber.toNumber(versionFragments[2]);
          this.minor = VersionNumber.toNumber(versionFragments[3]);
          if (typeof versionFragments[4] === 'string') this.patch = VersionNumber.toNumber(versionFragments[4].substr(1));
          if (typeof versionFragments[5] === 'string') this.build = VersionNumber.toNumber(versionFragments[5].substr(1));
          if (typeof versionFragments[6] === 'string') this.rc = VersionNumber.toNumber(versionFragments[6].substr(1));
        }
      }
      static toNumber(str) {
        const castedNum = Number(str);
        return isNaN(castedNum) ? str : castedNum;
      }
      get default() {
        return this._isdefault || false;
      }
      get str() {
        if (this._str) {
          return this._str;
        } else if (typeof this.major === 'undefined') {
          return 'anonymous';
        } else {
          const strTolerance = this.tolerance || '';
          const strPatch = typeof this.patch !== 'undefined' ? `.${this.patch}` : '';
          const strBuild = typeof this.build !== 'undefined' ? `.${this.build}` : '';
          const strRc = typeof this.rc !== 'undefined' ? `-${this.rc}` : '';
          return `${strTolerance}${this.major}.${this.minor}${strPatch}${strBuild}${strRc}`;
        }
      }
    }

    class RegistryAttributes {
      //['http://anyurl.com/mypackage.js', 'http://anyurl.com/mypackage.css']
      //or ({'mypackage': {version:'3.5.1', urls:['http://anyurl.com/mypackage.js', 'http://anyurl.com/mypackage.css'])
      //or ([{'mypackage': {version:'3.5.1', urls:['http://anyurl.com/mypackage.js', 'http://anyurl.com/mypackage.css']])
      //or ({'mypackage': {version:'3.5.1', urls:['http://anyurl.com/mypackage.js','http://anyalternativeurl.com/mypackage.js']}})
      //or ({mypackage@3.5.1:'http://anyurl.com/mypackage.js'})
      //or ({mypackage@3.5.1:['http://anyurl.com/mypackage.js','http://anyurl.com/mypackage.css']})
      //or ({mypackage:[
      //          {version:'3.5.1', url: 'http://anyurl.com/3.5.1/mypackage.js'},
      //          {version:'3.6.0', urls: ['http://anyurl.com/3.6.0/mypackage.js', 'http://anyurl.com/3.6.0/mypackage.css']}
      //    ]})
      //or ({mypackage: {version: '3.5.1', url: 'http://anyurl.com/mypackage.js'}}
      constructor(args) {
        this.files = [];
        this._splitEachArgumentIntoSingleFiles(args);
      }

      //run through each of the arguments passed to the constructor, and create a flat list of files (1 per url)
      _splitEachArgumentIntoSingleFiles(args) {
        for (let i = 0; i < args.length; i++) {
          const arg = args[i];
          const argType = typeof arg;
          if (argType === 'string') {
            this._addFile(arg);
          } else if (arg instanceof Array) {
            this._splitArrayIntoSingleFiles(arg);
          } else if (argType === 'object') {
            this._splitObjectIntoSingleFiles(arg);
          }
        }
      }
      //if the the argument is an array, iterate through all array-elements
      //if the array element is a string (= url or packagename) add
      _splitArrayIntoSingleFiles(arr) {
        arr.forEach(arrElement => {
          if (typeof arrElement === 'string') {
            this._addFile(arrElement);
          } else if (typeof arrElement === 'object' && arrElement !== null) {
            this._splitObjectIntoSingleFiles(arrElement);
          }
        });
      }

      //run through each object key-value pair...
      //The key needs to be the packgename, the value needs to be the url(s), or config object
      _splitObjectIntoSingleFiles(obj) {
        Object.keys(obj).forEach(packageName => {
          const objElement = obj[packageName];
          const objElementType = typeof obj[packageName];
          if (objElementType === 'string') {
            this._addFile(packageName, objElement); //format === {package: 'packageurl'}
          } else if (objElement instanceof Array) {
            objElement.forEach(packageConfig => {
              const packageConfigType = typeof packageConfig;
              if (packageConfigType === 'string') {
                this._addFile(packageName, packageConfig); //it's an array of urls; format === {package: [file1, file2, file3, ...]}
              } else if (packageConfigType === 'object') {
                this._splitPackageConfigObjectIntoFiles(packageName, packageConfig); //array of objects; format === {package: [{version: '', url: ''}, {...}]}
              }
            });
          } else if (objElementType === 'object') {
            this._splitPackageConfigObjectIntoFiles(packageName, objElement);
          }
        });
      }

      //each config object can have 1 or more versions and 1 or more urls
      _splitPackageConfigObjectIntoFiles(packageName, obj) {
        let {
          version,
          versions,
          url,
          urls,
          type,
          dependencies,
          factory,
          preventReregistration,
          dependencyOverrides
        } = obj;
        if (versions instanceof Array && versions.length > 0) {
          versions.forEach(singleVersion => this._splitPackageConfigObjectIntoFiles(packageName, _objectSpread2(_objectSpread2({}, obj), {}, {
            version: singleVersion,
            versions: null
          })));
        } else {
          if (urls instanceof Array) {
            urls.forEach(singleUrl => this._splitPackageConfigObjectIntoFiles(packageName, _objectSpread2(_objectSpread2({}, obj), {}, {
              url: singleUrl,
              urls: null
            })));
          } else {
            this._addFile(packageName, url, version, type, dependencies, factory, preventReregistration, dependencyOverrides);
          }
        }
      }
      _addFile(packageName, url, version, type, dependencies, factory, preventReregistration, dependencyOverrides) {
        if (packageName) {
          //if there is no package-name, use the url without versionnumber
          if (typeof url === 'undefined') url = packageName.replace(constants.reVersionNumberAtEnd, '');
          //get the package filetype
          type = type || RegistryAttributes.guessType(packageName) || RegistryAttributes.guessType(url);
          const reCleanTypePrefixOnly = type ? new RegExp(`^${type}\!`) : '';
          const reCleanType = type ? new RegExp(`^${type}\!|\\\.${type}$`, 'g') : '';
          //try to get a versionnumber
          version = version || this._getVersionInfo(packageName, url);
          if (!(version instanceof VersionNumber)) version = new VersionNumber(version);
          //clean package-name and url
          this.files.push({
            name: packageName.replace(constants.reFindVersionNumber, '').replace(reCleanType, '').replace(constants.reUrlWithoutProtocolNorSpecialCharacters, ''),
            url: typeof url === 'string' ? url.replace(reCleanTypePrefixOnly, '') : false,
            version,
            type,
            dependencies,
            factory,
            preventReregistration,
            dependencyOverrides
          });
        }
      }
      _getVersionInfo(packageName, url) {
        const versionFromPackageName = RegistryAttributes.getVersionString(packageName);
        if (versionFromPackageName === null || versionFromPackageName === 'default') {
          const versionFromUrl = RegistryAttributes.getVersionString(url);
          if (versionFromPackageName === 'default') {
            return versionFromUrl ? `${versionFromUrl}-default` : 'default';
          } else {
            return versionFromUrl;
          }
        } else {
          return versionFromPackageName;
        }
      }
      static getVersionString(value) {
        //check the version-number is present in the url or packagename
        if (value) {
          const version = value.match(constants.reFindVersionNumber);
          return version && version.length === 7 ? version[1] : null;
        }
      }

      //guess the filetype from the name or url
      static guessType(value) {
        if (value) {
          //remove version if present
          value = value.replace(constants.reFindVersionNumber, '');
          //first check if the filetype is provided in the name (html!myHtmlFragment)
          const indexOfExclamation = value.indexOf('!');
          if (indexOfExclamation > -1) {
            return value.substr(0, indexOfExclamation);
          } else {
            //try to fetch a valid extension from the first urls
            const extension = constants.reExtension.exec(value);
            if (extension && extension.length === 3) return extension[1];
          }
        }
      }
    }

    class Version {
      constructor(options, parent) {
        this.parent = parent;
        this.major = options.version.major;
        this.minor = options.version.minor;
        this.patch = options.version.patch;
        this.build = options.version.build;
        this.rc = options.version.rc;
        this.str = options.version.str || this._getVersionStr();
        this.filetypes = {};
      }
      addFileType(options) {
        const that = this;
        const version = that.str;
        //at this point only one url should be registered at a time...
        if (!options.url && options.urls instanceof Array) options.url = options.urls[0];
        if (options.url && options.url.indexOf('${') > -1) {
          try {
            return this._processFileType(_objectSpread2(_objectSpread2({}, options), {}, {
              url: new Function(['version', 'obj'], "return `" + options.url + "`")(version, that)
            }));
          } catch (e) {
            console.warn('Error parsing registry URL', e);
          }
        } else {
          return this._processFileType(options);
        }
      }
      loadFileType(filetype) {
        if (this.filetypes[filetype]) {
          return root.requirees.loaders.loadTypeFromVersion(this, filetype);
        } else {
          console.warn(`RequireEs: There is no ${filetype}-file present in package ${this.parent.name} (version ${this.str})`);
        }
      }

      //check if the files for this packages are all loaded and ready to go
      isSpecified(filetype) {
        const sFiletype = (filetype === null || filetype === void 0 ? void 0 : filetype.type) || filetype;
        if (typeof sFiletype === 'string') {
          const loadedFileType = this.filetypes[sFiletype];
          return (loadedFileType === null || loadedFileType === void 0 ? void 0 : loadedFileType.hasOwnProperty('exports')) || false;
        } else {
          const filetypes = Object.keys(this.filetypes);
          for (let i = 0; filetypes.length > i; i++) {
            if (this.filetypes[filetypes[i]].hasOwnProperty('exports') === false) return false;
          }
          return true;
        }
      }

      //undefine a package (destroy the filetypes)
      undef(filetype) {
        const sFiletype = (filetype === null || filetype === void 0 ? void 0 : filetype.type) || filetype;
        if (typeof sFiletype === 'string') {
          delete this.filetypes[sFiletype];
        } else {
          Object.keys(this.filetypes).forEach(ft => delete this.filetypes[ft]);
        }
      }

      //load dependencies or define exports
      shim(filetype, shimConfig) {
        if (typeof shimConfig !== 'object') return;
        const file = this.getFile(filetype);
        if (file) {
          if (shimConfig.deps instanceof Array) this._addDependencies(file, shimConfig.deps, 'PreLoad');
          if (typeof shimConfig.exports === 'string') file.postFactory = () => root[shimConfig.exports];
          if (typeof shimConfig.exports === 'function') file.postFactory = shimConfig.exports;
        }
      }

      //add dependencies
      addDependencies(filetype, config, preload) {
        if (typeof config !== 'object') return;
        const file = this.getFile(filetype);
        this._addDependencies(file, config, preload ? 'PreLoad' : 'Extra');
      }

      //returns the filetype definition within this version
      getFile(filetype) {
        let sFiletype = (filetype === null || filetype === void 0 ? void 0 : filetype.type) || filetype;
        if (typeof sFiletype !== 'string') sFiletype = 'js';
        return this.filetypes[sFiletype];
      }

      //multiple shim calls can add multiple dependencies
      _addDependencies(file, dependencies, type) {
        const key = `dependencies${type}`;
        if (!(file[key] instanceof Array)) file[key] = [];
        if (dependencies instanceof Array) {
          dependencies.forEach(dep => {
            if (typeof dep === 'string' && file[key].indexOf(dep) === -1) file[key].push(dep);
          });
        }
      }

      //add urls, add factory, create filetype, ...
      _processFileType(options) {
        options.type = options.type || RegistryAttributes.guessType(options.url) || 'js';
        if (typeof this.filetypes[options.type] !== 'object') this.filetypes[options.type] = {
          urls: []
        };
        const fileToProcess = this.filetypes[options.type];
        if (options.dependencyOverrides) this._addDependencyOverrides(fileToProcess, options.dependencyOverrides);
        if (typeof options.factory !== 'undefined') this._setFactory(options.factory, fileToProcess);
        if (options.dependencies instanceof Array) fileToProcess.dependencies = options.dependencies;
        if (typeof options.url === 'string' && fileToProcess.urls.indexOf(options.url) === -1) fileToProcess.urls.unshift(options.url);
        return fileToProcess;
      }

      //adds dependency overrides
      //example reactdom, define(['react'], factoryReactDom(react){})
      _addDependencyOverrides(file, overrides) {
        if (typeof overrides === 'object') {
          if (typeof file.dependencyOverrides !== 'object') file.dependencyOverrides = {};
          Object.assign(file.dependencyOverrides, overrides);
        }
      }

      //sets the factory for a certain filetype (if allowed)
      _setFactory(factory, file) {
        if (this._canBeDefined(file)) {
          delete file.dfr;
          delete file.exports;
          file.factory = factory;
        } else {
          console.warn(`RequireEs - Computer says no: package ${this.parent.name} - ${this.str} is already defined... Redefining this package is not allowed!`);
        }
      }

      //get the general settings from requirees.config()
      _getRequireEsConfigOptions() {
        var _this$parent;
        return (_this$parent = this.parent) === null || _this$parent === void 0 || (_this$parent = _this$parent.parent) === null || _this$parent === void 0 || (_this$parent = _this$parent.parent) === null || _this$parent === void 0 ? void 0 : _this$parent.options;
      }

      //check if the package can be defined or redefined
      _canBeDefined(file) {
        if (file.hasOwnProperty('exports')) {
          const requireEsConfig = this._getRequireEsConfigOptions();
          return requireEsConfig.allowRedefine || false;
        } else {
          return true;
        }
      }
      _getVersionStr() {
        this.str = constants.versionFormat.map(fragmnt => fragmnt !== 'rc' && this[fragmnt]).filter(fragmnt => typeof fragmnt === 'number' || typeof fragmnt === 'string').join('.');
        if (typeof this.rc !== 'undefined' && this.rc !== null && this.rc !== "") this.str += `${typeof this.rc === 'string' ? '-' : '.'}${this.rc}`;
        return this.str;
      }
      test(version) {
        const tolerance = version.tolerance;
        if (tolerance === '*') {
          return true;
        } else if (tolerance === '^') {
          return this.major === version.major;
        } else if (tolerance === '~') {
          return this.major === version.major && this.minor === version.minor;
        } else {
          //exact match
          for (let iFrag = 0; iFrag < constants.versionFormat.length; iFrag++) {
            const fragmnt = constants.versionFormat[iFrag];
            if (!tolerance && (this[fragmnt] || 0) !== (version[fragmnt] || 0)) {
              return false;
            }
          }
          //if any tolerance was given >> return false ... else true
          return Boolean(!tolerance);
        }
      }
      toJson() {
        const version = {
          filetypes: this.filetypes,
          major: this.major,
          minor: this.minor,
          str: this.str
        };
        if (typeof this.patch !== 'undefined') version.patch = this.patch;
        if (typeof this.build !== 'undefined') version.build = this.build;
        if (typeof this.rc !== 'undefined') version.rc = this.rc;
        return version;
      }
    }

    class Package {
      constructor(options, parent) {
        this.parent = parent;
        this.versions = [];
        this.isDirty = false;
        this.name = options.name;
      }
      find(versionObj) {
        return this.versions.filter(version => version.test(versionObj));
      }
      findOne(versionObj) {
        for (let version of this.versions) {
          if (version instanceof Version && version.test(versionObj)) return version;
        }
        return null;
      }
      remove(versionsToDelete) {
        if (!(versionsToDelete instanceof Array)) versionsToDelete = [versionsToDelete];
        this.versions = this.versions.filter(version => versionsToDelete.indexOf(version) === -1);
        return this;
      }
      length() {
        return this.versions.length;
      }

      //add possible multiple versions to this package
      add(options) {
        if (options.version && typeof options.version.tolerance !== 'undefined') delete options.version.tolerance;
        let target = this.findOne(options.version);
        if (!(target instanceof Version)) {
          target = new Version(options, this);
          this.versions.push(target);
          this.isDirty = true;
          if (typeof options.sort === 'boolean' ? options.sort : true) this.sort(options);
        }
        target.addFileType(options);
        if (options.version.default) this.default = target;
        return target;
      }
      sort(options) {
        if (this.isDirty) {
          this.versions = this.versions.sort((a, b) => {
            for (let iFragment = 0; iFragment < constants.versionFormat.length; iFragment++) {
              const fragmnt = constants.versionFormat[iFragment];
              if (a[fragmnt] !== b[fragmnt]) return a[fragmnt] < b[fragmnt] ? 1 : -1;
            }
          });
        }
        this.isDirty = false;
        return this;
      }
      toJson() {
        return this.versions.map(version => version.toJson());
      }
    }

    class Registry {
      constructor(options, parent) {
        this.parent = parent;
        this.options = options;
        this.packages = {};
      }

      //add packages
      add() {
        //one package can have multiple js, css, wasm, ... sources... if multiple urls are provided, split them further up, per type
        const {
          files
        } = new RegistryAttributes(arguments);
        //loop through files and add to the packages one by one
        if (files instanceof Array) {
          files.forEach(file => {
            if (this._allowRegister(file)) {
              this._publish(`${constants.events.ns}${constants.events.pre}${constants.events.register}`, {
                file
              });
              if (!this.packages[file.name]) {
                this.packages[file.name] = new Package(file, this);
              }
              this.packages[file.name].add(file);
              this._publish(`${constants.events.ns}${constants.events.register}`, {
                package: this.packages[file.name],
                file
              });
            }
          });
        }
        this.sort(); //sort the packages to be easily searchable
        return this; //make chainable
      }
      _allowRegister(registrationFile) {
        return registrationFile.preventReregistration ? typeof this.packages[registrationFile.name] === 'undefined' : true;
      }
      _publish(evtName, data) {
        var _this$parent;
        (_this$parent = this.parent) === null || _this$parent === void 0 || (_this$parent = _this$parent.events) === null || _this$parent === void 0 || _this$parent.publish(evtName, data);
      }

      //sort all packages on version number
      sort() {
        Object.keys(this.packages).forEach(pckg => this.packages[pckg].sort());
      }

      //remove a package
      remove() {
        const attrs = new RegistryAttributes(arguments);
        const match = this.find(attrs);
        if (match) {
          if (match.pckg.length() === match.versions.length) {
            //all versions need to be delete => remove the complete package
            delete this.packages[match.pckg.name];
          } else {
            //delete only the pakcages which are found
            match.pckg.delete(match.versions);
          }
        }
        return this;
      }

      //find all matching packages
      find() {
        const {
          files
        } = new RegistryAttributes(arguments);
        return files instanceof Array ? this._find(files[0], false) : [];
      }

      //find the first match
      findOne() {
        const {
          files
        } = new RegistryAttributes(arguments);
        return files instanceof Array ? this._find(files[0], true) : null;
      }

      //internal find in registry logic
      _find(attrs, findOne) {
        const pckg = this.packages[attrs.name];
        if (pckg) {
          let foundPackages;
          const results = {
            pckg,
            attrs
          };
          if (constants.returnDefaultOnVersionStr.indexOf(attrs.version.str) > -1 && pckg.default) {
            foundPackages = findOne ? pckg.default : [pckg.default];
          } else {
            const targetVersion = attrs.version && typeof attrs.version.major !== 'undefined' ? attrs.version : {
              tolerance: '*'
            };
            foundPackages = pckg[findOne ? 'findOne' : 'find'](targetVersion);
          }
          results[`match${findOne ? '' : 'es'}`] = foundPackages;
          return results;
        } else {
          return {
            attrs
          };
        }
      }

      //return registry to json
      toJson() {
        const registry = {};
        Object.keys(this.packages).forEach(pckg => registry[pckg] = this.packages[pckg].toJson());
        return registry;
      }
    }

    class ReservedDependencies {
      constructor() {
        this._reservedDependencies = {};
        this.add('require', this.requireHandler.bind(this)).add('requirees', this.requireEsHandler.bind(this)).add('exports', this.exportsHandler.bind(this)).add('mdl', this.moduleHandler.bind(this));
      }
      add(handlerName, handler) {
        if (typeof handler === 'function' && typeof handlerName === 'string') {
          this._reservedDependencies[handlerName] = handler;
        }
        return this;
      }
      get(handlerName, mdl) {
        const handler = this._reservedDependencies[handlerName];
        return handler ? handler(mdl) : null;
      }
      moduleHandler(mdl) {
        var _mdl$parent;
        mdl.uri = mdl.urls;
        mdl.id = (_mdl$parent = mdl.parent) === null || _mdl$parent === void 0 ? void 0 : _mdl$parent.name;
        if (typeof mdl.exports === 'undefined') mdl.exports = {};
        return mdl;
      }
      exportsHandler(mdl) {
        if (typeof mdl.exportsPreFactoryRun === 'undefined') mdl.exportsPreFactoryRun = {};
        return mdl.exportsPreFactoryRun;
      }
      requireHandler(mdl) {
        if (mdl.require) {
          return mdl.require;
        } else {
          const {
            require
          } = this._makeNewRequireEsContext(mdl);
          return require;
        }
      }
      requireEsHandler(mdl) {
        if (mdl.requirees) {
          return mdl.requirees;
        } else {
          const {
            requirees
          } = this._makeNewRequireEsContext(mdl);
          return requirees;
        }
      }
      _makeNewRequireEsContext(mdl) {
        const requireEs = new RequireEs();
        mdl.require = requireEs.asFunction(false);
        mdl.requirees = requireEs.asFunction(true);
        return {
          'requirees': mdl.requirees,
          'require': mdl.require
        };
      }
      get reservedDependencyNames() {
        return Object.keys(this._reservedDependencies);
      }
    }

    function factoryRunner$4(factory) {
      if (typeof factory === 'string') {
        const style = document.createElement('style');
        style.innerText = factory;
        return document.head.appendChild(style);
      }
    }
    function load$4(url, version, versiontype, requireContext) {
      return new Promise(resolve => {
        const link = document.createElement('link');
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = url;
        link.onload = resolve.bind(version, link);
        if (requireContext) requireContext.events.publish('requirees.styletag.preadd', link);
        document.head.appendChild(link);
        if (requireContext) requireContext.events.publish('requirees.styletag.added', link);
      });
    }
    var css = {
      load: load$4,
      factoryRunner: factoryRunner$4
    };

    function txt (url) {
      return fetch(url).then(r => r.text());
    }

    let domparser$1 = null;
    function parseHtml(txtHtml) {
      if (!domparser$1) domparser$1 = new DOMParser();
      const doc = domparser$1.parseFromString(txtHtml, 'text/html');
      if (doc.documentElement) {
        if (txtHtml.indexOf('<body>') === -1) {
          const nodes = doc.body && doc.body.children || [];
          return nodes.length === 1 ? nodes[0] : nodes;
        } else {
          return doc.documentElement;
        }
      } else {
        return txtHtml;
      }
    }
    function factoryRunner$3(factory) {
      return typeof factory === 'string' ? parseHtml(factory) : factory;
    }
    function load$3(url, version, versiontype) {
      return new Promise(resolve => {
        root.require(`txt!${url}`, txtHtml => {
          resolve(parseHtml(txtHtml));
        });
      });
    }
    var html = {
      load: load$3,
      factoryRunner: factoryRunner$3
    };

    let domparser = null;
    function parseXml(txt) {
      if (!domparser) domparser = new DOMParser();
      return domparser.parseFromString(txt, 'application/xml');
    }
    function factoryRunner$2(factory) {
      return typeof factory === 'string' ? parseXml(factory) : factory;
    }
    function load$2(url, version, versiontype) {
      return new Promise(resolve => {
        root.require(`txt!${url}`, txtXml => resolve(parseXml(txtXml)));
      });
    }
    var xml = {
      factoryRunner: factoryRunner$2,
      load: load$2
    };

    function onScriptLoad(script, err) {
      if (err) document.head.removeChild(script);
      currentTagLoad.cancelDefine(script, err);
    }
    function js (url, version, versiontype, requireContext) {
      const script = document.createElement('script');
      script.charset = 'utf-8';
      script.async = true;
      script.addEventListener('error', () => onScriptLoad(script, `requirees: could not load ${url}`));
      script.addEventListener('load', () => onScriptLoad(script));
      script.src = url;
      script.version = version;
      script.versiontype = versiontype;
      if (script.src !== url) {
        var _version$filetypes$js;
        const jsVersionUrls = (_version$filetypes$js = version.filetypes['js']) === null || _version$filetypes$js === void 0 ? void 0 : _version$filetypes$js.urls;
        const urlIndex = jsVersionUrls === null || jsVersionUrls === void 0 ? void 0 : jsVersionUrls.indexOf(url);
        jsVersionUrls === null || jsVersionUrls === void 0 || jsVersionUrls.splice(urlIndex, 1, script.src);
      }
      if (requireContext) requireContext.events.publish('requirees.scripttag.preadd', script);
      document.head.appendChild(script);
      if (requireContext) requireContext.events.publish('requirees.scripttag.added', script);
      return currentTagLoad.waitForDefine(script);
    }

    function factoryRunner$1(factory) {
      return typeof factory === 'string' ? JSON.parse(factory) : factory;
    }
    function load$1(url) {
      return fetch(url).then(r => r.json());
    }
    var json = {
      load: load$1,
      factoryRunner: factoryRunner$1
    };

    class CustomElementController {
      constructor(version) {
        this.version = version;
        this.name = version.parent.name;
      }
      getAll() {
        return document.querySelectorAll(this.name);
      }
    }
    function registerCustomElement(factory, version) {
      if (typeof factory === 'function') {
        factory.prototype.getAssociatedVersion = function () {
          return version;
        };
        customElements.define(version.parent.name, factory);
        return new CustomElementController(version);
      } else {
        console.warn('RequireEs: Custom elements should be functions (or classes) extended from any HTMLElement');
        return {
          error: 'Not a valid custom element factory'
        };
      }
    }
    function factoryRunner(factory, version) {
      return factory instanceof CustomElementController ? factory : registerCustomElement(factory, version);
    }
    function load(url, version, versiontype) {
      return new Promise(resolve => {
        root.require(url, CustomNode => resolve(registerCustomElement(CustomNode, version)));
      });
    }
    var tag = {
      load,
      factoryRunner
    };

    function wasm (url, version) {
      if (typeof root.WebAssembly === 'undefined') {
        console.warn(`Requirees: this browser does not support WebAssembly... Package ${version.parent.name} cannot be loaded`);
      } else {
        return fetch(url).then(resp => resp.arrayBuffer()).then(bytes => WebAssembly.instantiate(bytes)).then(result => result.instance.exports);
      }
    }

    class Loaders {
      constructor(requireContext) {
        this.requireContext = requireContext;
        this.reservedDependencies = new ReservedDependencies(requireContext);
        this.loaders = {};
        this.unloaders = {};
        this.factoryRunners = {};
        this.add('js', js);
        this.add('wasm', wasm);
        this.add('tag', tag);
        this.add('html', html);
        this.add('htm', html);
        this.add('xml', xml);
        this.add('txt', txt);
        this.add('json', json);
        this.add('css', css);
      }
      add(type, loader) {
        if (typeof loader === 'object') {
          const fn = loader.load || loader.loader || loader.get;
          const fnUnload = loader.unload || loader.unloader || loader.remove || loader.delete;
          const fnFactory = loader.handleFactory || loader.factory || loader.factoryRunner || loader.factoryLoader;
          if (typeof fn === 'function') this.loaders[type] = fn;
          if (typeof fnUnload === 'function') this.unloaders[type] = fnUnload;
          if (typeof fnFactory === 'function') this.factoryRunners[type] = fnFactory;
        } else if (typeof loader === 'function') {
          this.loaders[type] = loader;
        }
      }
      get(type) {
        return this.loaders[type] || this.loaders['js'];
      }
      load(searchResult = {}, options = {}) {
        const attrs = searchResult.attrs;
        if (!searchResult.match) {
          console.warn(`RequireEs - Oh fudge, we did not find any package '${attrs && attrs.name || '<unknown>'}' that matches version '${attrs && attrs.version && attrs.version.str || '<unknown>'}'`);
          return null;
        } else {
          let packageFiletypes = searchResult.match.filetypes;
          const type = attrs && attrs.type;
          if (type && packageFiletypes[type]) {
            return this.loadTypeFromVersion(searchResult.match, type);
          } else {
            //download all the filetypes for this package... If waiting is needed, use promises, otherwise sync response (for cjs usage)
            let hasPromise = false;
            const instanceResolves = Object.keys(packageFiletypes).map(type => {
              const instanceResolver = this.loadTypeFromVersion(searchResult.match, type);
              if (instanceResolver instanceof Promise) hasPromise = true;
              return instanceResolver;
            });
            if (hasPromise) {
              return Promise.all(instanceResolves).then(this._returnMultiFiletypeLoad.bind(this, packageFiletypes, options));
            } else {
              return this._returnMultiFiletypeLoad(packageFiletypes, options, instanceResolves);
            }
          }
        }
      }
      _returnMultiFiletypeLoad(packageFiletypes, options, allInstances) {
        const arrPackageFiletypes = Object.keys(packageFiletypes);
        if (options.returnAll) {
          //return all the instances back... create an object with all loaded filetypes
          const returnObj = {};
          arrPackageFiletypes.forEach((key, i) => returnObj[key] = allInstances[i]);
          return returnObj;
        } else {
          // try to return the most obvious instance back as default
          // use the same order as in which the loaders are defined (js / wasm / tag / html /...)
          const loaderTypes = Object.keys(this.loaders);
          for (let iType = 0; iType < loaderTypes.length; iType++) {
            const loader = arrPackageFiletypes.indexOf(loaderTypes[iType]);
            if (loader > -1) return allInstances[loader];
          }
        }
      }
      loadTypeFromVersion(version, type) {
        const versiontype = version.filetypes[type];
        this._publishEvt(`${constants.events.ns}${constants.events.pre}${constants.events.loadFile}`, {
          package: version.parent,
          versiontype,
          version
        });
        if (typeof versiontype === 'object' && versiontype !== null) {
          if (typeof versiontype.exports !== 'undefined') {
            return versiontype.exports;
          } else if (versiontype.dfr instanceof Promise) {
            return versiontype.dfr;
          } else {
            return versiontype.dfr = new Promise((resolve, reject) => {
              if (versiontype.factory) {
                this._resolveFactoryDependencies(resolve, version, type);
              } else {
                this._loadFromUrl(version, type).then(factory => {
                  versiontype.factory = factory;
                  this._resolveFactoryDependencies(resolve, version, type);
                }).catch(reject);
              }
            }).then(instance => {
              this._publishEvt(`${constants.events.ns}${constants.events.loadFile}`, {
                package: version.parent,
                instance,
                versiontype,
                version
              });
              return instance;
            });
          }
        }
      }
      _publishEvt(evt, data) {
        this.requireContext.events.publish(evt, data);
      }
      _getDependencies(versiontype) {
        if (versiontype.dependencies instanceof Array) {
          if (typeof versiontype.dependencyOverrides === 'object') {
            return versiontype.dependencies.map(dependency => versiontype.dependencyOverrides[dependency] || dependency);
          } else {
            return versiontype.dependencies;
          }
        } else {
          return [];
        }
      }
      _resolveFactoryDependencies(resolve, version, type) {
        const versiontype = version.filetypes[type];
        const dependencies = this._getDependencies(versiontype);
        const dependenciesExtra = versiontype.dependenciesExtra instanceof Array ? versiontype.dependenciesExtra : [];
        const dependenciesPreLoad = versiontype.dependenciesPreLoad instanceof Array ? versiontype.dependenciesPreLoad : [];
        const allDependencies = dependencies.concat(dependenciesExtra).concat(dependenciesPreLoad);
        const reservedDependencyNames = this.reservedDependencies.reservedDependencyNames;
        if (allDependencies.length) {
          const loadingDependencies = allDependencies.map(dependency => {
            if (reservedDependencyNames.indexOf(dependency) > -1) {
              return this.reservedDependencies.get(dependency, versiontype);
            } else {
              return this.requireContext.get(dependency);
            }
          });
          return Promise.all(loadingDependencies).then(deps => this._resolveFactory(resolve, version, type, deps));
        } else {
          return this._resolveFactory(resolve, version, type, []);
        }
      }
      _resolveFactory(resolve, version, type, deps) {
        const versiontype = version.filetypes[type];
        let factoryResult;
        if (typeof this.factoryRunners[type] === 'function') {
          //with this type of file the factory data of the module needs post-processing (css factory data for instance)
          factoryResult = factoryResult = this.factoryRunners[type].call(version, versiontype.factory, version, versiontype, deps);
        } else if (typeof versiontype.factory === 'function') {
          //this factory is a javascript function... execute it to know the factory result
          factoryResult = versiontype.factory.apply(version, deps);
        } else {
          //just serve the factory data as is to the module (for instance text)
          factoryResult = versiontype.factory;
        }
        if (typeof versiontype.exportsPreFactoryRun !== 'undefined') versiontype.exports = versiontype.exportsPreFactoryRun;
        if (typeof versiontype.exports === 'undefined') {
          if (typeof versiontype.postFactory === 'function') factoryResult = versiontype.postFactory(factoryResult);
          versiontype.exports = factoryResult;
        }
        resolve(versiontype.exports);
      }
      _getDownloadUrl(configuredUrl) {
        const baseUrl = this._getBaseUrl();
        const applyBaseUrl = baseUrl && !constants.reIsAbsoluteUrl.test(configuredUrl);
        return applyBaseUrl ? new URL(configuredUrl, baseUrl).href : configuredUrl;
      }
      _getBaseUrl() {
        var _this$requireContext;
        return (_this$requireContext = this.requireContext) === null || _this$requireContext === void 0 || (_this$requireContext = _this$requireContext.options) === null || _this$requireContext === void 0 ? void 0 : _this$requireContext.baseUrl;
      }
      _loadFromUrl(version, type, index = 0) {
        const loader = this.get(type);
        if (typeof loader === 'function') {
          const file = version.filetypes[type];
          const urls = file.urls;
          if (index < urls.length) {
            const url = this._getDownloadUrl(urls[index]);
            try {
              return this._waitForPreLoadDependencies(file).then(() => loader(url, version, file, this.requireContext));
            } catch (e) {
              return this._loadFromUrl(version, type, index + 1);
            }
          }
        }
      }
      _waitForPreLoadDependencies(file) {
        if (file.dependenciesPreLoad instanceof Array && file.dependenciesPreLoad.length > 0) {
          return this.requireContext.getPromise(file.dependenciesPreLoad);
        } else {
          return Promise.resolve();
        }
      }
    }

    class Events {
      constructor() {
        this.register = {};
      }
      subscribe(evt, callback) {
        if (!(this.register[evt] instanceof Array)) this.register[evt] = [];
        this.register[evt].push(callback);
        return `${evt}[${this.register[evt].length - 1}]`;
      }
      unsubscribe(key) {
        try {
          const keyFragments = key.match(constants.events.resolve.regexp);
          const fnName = keyFragments[constants.events.resolve.fnName];
          const fnIndex = keyFragments[constants.events.resolve.fnIndex];
          if (typeof fnIndex === 'undefined') {
            delete this.register[fnName];
          } else {
            delete this.register[fnName][fnIndex];
          }
        } catch (e) {
          console.warn(`RequireEs: we could not unsubscribe from ${key}`, e);
        }
      }
      publish(evt, payload) {
        const evts = this.register[evt] instanceof Array ? this.register[evt] : [];
        const evtsAndWireTaps = evts.concat(this.register[constants.events.wireTapEventName]);
        evtsAndWireTaps.forEach(fn => {
          try {
            if (typeof fn === 'function') fn(payload, evt);
          } catch (e) {
            console.error(`RequireEs: Error while executing a function in ${evt}`, e);
          }
        });
      }
      addWireTap(fn) {
        return typeof fn === 'function' ? this.subscribe(constants.events.wireTapEventName, fn) : null;
      }
    }

    //transforms the RequireJs paths format to RequireEs register format
    // -> add js extensions if needed
    // from: {paths: {react: 'https://foo.bar/react'}} to: [{name: 'react', url: 'https://foo.bar/react.js'}]
    function transformRJSPaths(packages) {
      const requireEsFormat = [];
      if (typeof packages === 'object') {
        Object.keys(packages).forEach(packageName => {
          let urls = packages[packageName];
          if (typeof urls === 'string') urls = [urls];
          if (urls instanceof Array) {
            urls.forEach(url => requireEsFormat.push({
              [packageName]: doesUrlNeedJsExtention(url) ? `${url}.js` : url
            }));
          }
        });
      }
      return requireEsFormat;
    }
    function doesUrlNeedJsExtention(url) {
      const reHasJsExtention = /\.js(\?.*)?$/;
      return url.indexOf('!') === -1 && !reHasJsExtention.test(url);
    }

    class WaitForRegistrationQueue {
      constructor(_requireInstance) {
        _defineProperty(this, "_queue", []);
        _defineProperty(this, "_require", void 0);
        this._require = _requireInstance;
        this._require.events.subscribe(`${constants.events.ns}${constants.events.register}`, this.processNewPackage.bind(this));
      }
      queue(target, searchAttrs, options) {
        return new Promise(resolve => this._queue.push({
          target,
          searchAttrs,
          options,
          resolve
        }));
      }
      processNewPackage(registrationArgs) {
        //loop through queue and reduce the elements that are matched
        if (this._queue.length) {
          this._queue = this._queue.reduce((acc, queueElement) => {
            const {
              target,
              searchAttrs,
              options,
              resolve
            } = queueElement;
            try {
              if (searchAttrs.name === registrationArgs.package.name) {
                const version = this._require.findOne(target);
                if (version.match) {
                  this._require.getPromise(target, options).then(resolve);
                } else {
                  acc.push(queueElement);
                }
              } else {
                acc.push(queueElement);
              }
            } catch (e) {
              console.warn(`RequireEs - Something went wrong while loading package from queue`, e, target);
            }
            return acc;
          }, []);
        }
      }
    }

    class RequireEs {
      constructor(options) {
        this.events = new Events();
        this.registry = new Registry(options, this);
        this.loaders = new Loaders(this);
        this.waitForRegistrationQueue = new WaitForRegistrationQueue(this);
        this.options = options || {};
        this.amd = {};
      }
      define() {
        const args = getDefinitionArguments(arguments);
        this.events.publish(`${constants.events.ns}${constants.events.pre}${constants.events.define}`, {
          args
        });
        //Careful with jQuery: In general, explicitly naming modules in the define() call are discouraged, but jQuery has some special constraints.
        const isNamed = typeof args.name === 'string' && !(args.name === 'jquery' && typeof args.factory === 'undefined');
        //the module can be both be named AND registered.... In that case, register both!
        //try to defined the anonymous way (do not auto-invoke named modules, only the anonymous ones)
        const resultAnonymousDefine = this._defineAnonymousModule(args.dependencies, args.factory, isNamed);
        const resultNamedDefine = isNamed ? this._defineNamedModule(args.name, args.dependencies, args.factory) : null;
        this.events.publish(`${constants.events.ns}${constants.events.define}`, {
          args
        });
        return resultNamedDefine || resultAnonymousDefine;
      }
      _defineNamedModule(name, dependencies, factory, preventReregistration) {
        const registryElement = {};
        registryElement[name] = {
          dependencies,
          factory,
          url: false,
          preventReregistration
        };
        return this.register(registryElement);
      }
      _defineAnonymousModule(dependencies, factory, fromNamedModule) {
        //if this is an anonymous define, confirm the currently loading script that loading is done...
        const result = currentTagLoad.confirmDefine({
          dependencies,
          factory
        });
        if (!result.success && result.currentTag instanceof HTMLElement && !fromNamedModule) {
          //if no package was confirmed, but a define function was present... let's register it:
          const registry = this._defineNamedModule(result.currentTag.src, dependencies, factory, true);
          if (this.options.invokeNonMatchedDefines) {
            var _attrs$files;
            const attrs = new RegistryAttributes([result.currentTag.src]);
            const pckgName = (_attrs$files = attrs.files) === null || _attrs$files === void 0 || (_attrs$files = _attrs$files[0]) === null || _attrs$files === void 0 ? void 0 : _attrs$files.name;
            if (pckgName) this.get(pckgName);
          }
          return registry;
        }
      }
      loadAllModuleInstances(dependencies, options) {
        const queueIfNotRegistered = options && options.queueIfNotRegistered;
        const targetInstances = dependencies.map(target => {
          let results = this.findOne(target);
          if (queueIfNotRegistered && (typeof results.match === 'undefined' || results.match === null)) {
            //wait until the package is not find gets registered (or defined)
            return this.waitForRegistrationQueue.queue(target, results.attrs, _objectSpread2(_objectSpread2({}, options), {}, {
              queueIfNotRegistered: false
            }));
          }
          if (!queueIfNotRegistered && typeof results.match === 'undefined') {
            //package is not registered yet... define it, and afterwards download it
            this.register(target, options);
            results = this.findOne(target);
          }
          return this.loaders.load(results, options);
        });
        return targetInstances;
      }
      rejectOnTimeout(promise, options) {
        const loadTimeout = (options === null || options === void 0 ? void 0 : options.loadTimeout) && Number(options.loadTimeout);
        if (loadTimeout) {
          return Promise.race([promise, new Promise((_, reject) => setTimeout(() => reject(new Error(`RequireEs: ${loadTimeout / 1000}s load-timeout has been reached for require`)), loadTimeout))]);
        } else {
          return promise;
        }
      }
      runCallbackAfterInstancesAreLoaded(instancesPromise, callback, failFn, options) {
        if (typeof callback === 'function') {
          this.rejectOnTimeout(instancesPromise, options).then(instances => callback.apply(root, instances)).catch(err => failFn.apply(root, err));
        }
      }
      get() {
        const {
          dependencies,
          callback,
          callbackFail,
          loadSinglePackage,
          options
        } = getRequireArguments(arguments);
        const failFn = typeof callbackFail === 'function' ? callbackFail : err => console.error(err);
        const targetInstances = this.loadAllModuleInstances(dependencies, options);
        const targetInstancesPromise = Promise.all(targetInstances);
        this.runCallbackAfterInstancesAreLoaded(targetInstancesPromise, callback, failFn, options);
        return this.rejectOnTimeout(loadSinglePackage ? targetInstances[0] : targetInstancesPromise, options);
      }
      getPromise() {
        return new Promise(resolve => resolve(this.get.apply(this, arguments)));
      }
      register() {
        return this.registry.add.apply(this.registry, arguments);
      }
      find() {
        return this.registry.find.apply(this.registry, arguments);
      }
      findOne() {
        return this.registry.findOne.apply(this.registry, arguments);
      }
      when() {
        const args = [...arguments, {
          queueIfNotRegistered: true
        }];
        return this.getPromise.apply(this, args);
      }
      _setBaseUrl(baseUrlParam) {
        const baseUrl = `${baseUrlParam}${baseUrlParam.endsWith('/') ? '' : '/'}`;
        this.options.baseUrl = constants.reIsAbsoluteUrl.test(baseUrl) ? baseUrl : new URL(baseUrl, window.location.origin).href;
      }
      config(options = {}) {
        if (typeof options.paths !== 'undefined') transformRJSPaths(options.paths).forEach(m => this.register(m));
        if (typeof options.allowRedefine !== 'undefined') this.options.allowRedefine = options.allowRedefine;
        if (typeof options.invokeNonMatchedDefines !== 'undefined') this.options.invokeNonMatchedDefines = options.invokeNonMatchedDefines;
        if (typeof options.shim === 'object') this.shim(options.shim);
        if (typeof options.baseUrl === 'string') this._setBaseUrl(options.baseUrl);
      }
      specified(packageName) {
        if (typeof packageName === 'string') {
          const result = this.findOne(packageName);
          return result.match && result.match.isSpecified(result.attrs) || false;
        }
        return false;
      }
      undef(packageName) {
        if (typeof packageName === 'string') {
          const result = this.findOne(packageName);
          return result.match && result.match.undef(result.attrs);
        }
      }
      shim(config) {
        Object.keys(config).forEach(packageName => {
          if (typeof packageName === 'string') {
            var _result$match;
            let result = this.findOne(packageName);
            if (typeof result.match === 'undefined') {
              this.register({
                [packageName]: {
                  url: false
                }
              });
              result = this.findOne(packageName);
            }
            (_result$match = result.match) === null || _result$match === void 0 || _result$match.shim(result.attrs, config[packageName]);
          }
        });
      }

      //returns the instance as a function
      asFunction(usePromises) {
        const requirees = usePromises ? this.getPromise.bind(this) : this.get.bind(this);
        requirees.register = this.register.bind(this);
        requirees.when = this.when.bind(this);
        requirees.find = this.find.bind(this);
        requirees.findOne = this.findOne.bind(this);
        requirees.loaders = this.loaders;
        requirees.define = this.define.bind(this);
        requirees.config = this.config.bind(this);
        requirees.specified = this.specified.bind(this);
        requirees.shim = this.shim.bind(this);
        requirees.undef = this.undef.bind(this);
        requirees.on = this.events.subscribe.bind(this.events);
        requirees.subscribe = this.events.subscribe.bind(this.events);
        requirees.unsubscribe = this.events.unsubscribe.bind(this.events);
        requirees.publish = this.events.publish.bind(this.events);
        requirees.addWireTap = this.events.addWireTap.bind(this.events);
        requirees.events = this.events;
        requirees.version = "1.0.26";
        return requirees;
      }
    }

    //expose RequireEs Class
    root.RequireEs = RequireEs;

    //setup default require
    const requireEs = new RequireEs();
    //global amd module require
    root.require = root.requirejs = requireEs.asFunction(false);
    root.requirees = requireEs.asFunction(true);

    //global amd module define
    root.define = root.require.define;
    root.define.amd = {};

})();
