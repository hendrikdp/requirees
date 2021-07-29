(function () {
    'use strict';

    var root = typeof self !== 'undefined' ? self : global;
    var constants = {
      reProtocolAndHost: /^(https?:)?\/\/.+?\//i,
      reComments: /\/\*[\s\S]*?\*\/|([^:"'=]|^)\/\/.*$/mg,
      reCjsRequireCalls: /[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g,
      reExtension: /\.(\w{2,4})(\?.*)?$/i,
      reVersionNumber: /^\s*([*<>^~])?(\d+)\.(\d+)(\.\d+)?(\.\d+)?(\-[\w\d]*)?(\-default)?\s*$/,
      reFindVersionNumber: /\s*@?(([*<>^~]?\d+\.\d+(\.\d+)?(\.\d+)?(\-[\w\d]*)?(\-default)?)|default)\s*/,
      reVersionNumberAtEnd: /\s*@?(([*<>^~]?\d+\.\d+(\.\d+)?(\.\d+)?(\-[\w\d]*)?(\-default)?)|default)\s*$/,
      reToleranceCharacters: /^[\^~*]/,
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

    function _typeof(obj) {
      "@babel/helpers - typeof";

      if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        _typeof = function (obj) {
          return typeof obj;
        };
      } else {
        _typeof = function (obj) {
          return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };
      }

      return _typeof(obj);
    }

    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }

    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties(Constructor, staticProps);
      return Constructor;
    }

    function _defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }

      return obj;
    }

    function ownKeys(object, enumerableOnly) {
      var keys = Object.keys(object);

      if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) symbols = symbols.filter(function (sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
        keys.push.apply(keys, symbols);
      }

      return keys;
    }

    function _objectSpread2(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i] != null ? arguments[i] : {};

        if (i % 2) {
          ownKeys(Object(source), true).forEach(function (key) {
            _defineProperty(target, key, source[key]);
          });
        } else if (Object.getOwnPropertyDescriptors) {
          Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
        } else {
          ownKeys(Object(source)).forEach(function (key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
          });
        }
      }

      return target;
    }

    function _unsupportedIterableToArray(o, minLen) {
      if (!o) return;
      if (typeof o === "string") return _arrayLikeToArray(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor) n = o.constructor.name;
      if (n === "Map" || n === "Set") return Array.from(o);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
    }

    function _arrayLikeToArray(arr, len) {
      if (len == null || len > arr.length) len = arr.length;

      for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

      return arr2;
    }

    function _createForOfIteratorHelper(o) {
      if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
        if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) {
          var i = 0;

          var F = function () {};

          return {
            s: F,
            n: function () {
              if (i >= o.length) return {
                done: true
              };
              return {
                done: false,
                value: o[i++]
              };
            },
            e: function (e) {
              throw e;
            },
            f: F
          };
        }

        throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }

      var it,
          normalCompletion = true,
          didErr = false,
          err;
      return {
        s: function () {
          it = o[Symbol.iterator]();
        },
        n: function () {
          var step = it.next();
          normalCompletion = step.done;
          return step;
        },
        e: function (e) {
          didErr = true;
          err = e;
        },
        f: function () {
          try {
            if (!normalCompletion && it.return != null) it.return();
          } finally {
            if (didErr) throw err;
          }
        }
      };
    }

    function getDefinitionArguments(args) {
      var defineArguments = {};

      for (var iArg = 0; iArg < args.length; iArg++) {
        var arg = args[iArg];

        if (typeof arg === 'string' && !defineArguments.name) {
          defineArguments.name = arg;
        } else if (arg instanceof Array && !defineArguments.dependencies) {
          defineArguments.dependencies = convertRelativeUrls(arg);
        } else {
          defineArguments.factory = arg;
        }
      } //check for commonjs dependencies if dependencies are missing


      if (!(defineArguments.dependencies instanceof Array)) {
        defineArguments.dependencies = [];
        if (typeof defineArguments.factory === 'function') getDependenciesFromFactory(defineArguments);
      } //expose defined module


      return defineArguments;
    } //convert relative urls (./ ../)


    function convertRelativeUrls(urls) {
      return urls.map(function (url) {
        return url.charAt(0) === '.' ? normalizeRelativeUrl(url) : url;
      });
    } //normalize the relative urls (only if a valid extention is provided), otherwise treat it as a package name (RequireJs)


    function normalizeRelativeUrl(url) {
      //todo: remove below with a dynamic list! (use loader registration)
      var ALLOWED_EXTENTIONS = ['css', 'js', 'html', 'htm', 'json', 'tag', 'txt', 'wasm', 'xml'];
      var urlFragments = url.match(constants.reExtension); //remove the ./ if no allowed extension is provided

      if (ALLOWED_EXTENTIONS.indexOf(urlFragments === null || urlFragments === void 0 ? void 0 : urlFragments[1]) > -1) {
        var currentScriptUrl = getCurrentScriptLocation();
        var absUrl = new URL(url, currentScriptUrl);
        return absUrl.href;
      } else {
        return url.replace(/^\.\//, '');
      }
    } //get the location of the current script


    function getCurrentScriptLocation() {
      var _document$currentScri;

      var baseUrl = (_document$currentScri = document.currentScript) === null || _document$currentScri === void 0 ? void 0 : _document$currentScri.src;

      if (baseUrl) {
        return baseUrl;
      } else {
        var _scripts;

        var scripts = document.getElementsByTagName('script');
        return (_scripts = scripts[scripts.length - 1]) === null || _scripts === void 0 ? void 0 : _scripts.src;
      }
    } //find all require() statements and push these as dependencies (to support cjs modules)


    function getDependenciesFromFactory(defineArguments) {
      defineArguments.factory.toString().replace(constants.reComments, '').replace(constants.reCjsRequireCalls, function (match, dep) {
        return defineArguments.dependencies.push(dep);
      });
    } //parse the arguments comming into require method


    function getRequireArguments(args) {
      var requireArguments = {};

      for (var iArg = 0; iArg < args.length; iArg++) {
        var arg = args[iArg];

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
        } else if (_typeof(arg) === 'object') {
          requireArguments.options = arg;
        }
      } //expose targets and callback


      return requireArguments;
    } //expose require arguments and definition arguments

    var waitForDefine = function waitForDefine(tag) {
      return new Promise(function (resolve, reject) {
        tag.confirmDefine = resolve;
        tag.rejectDefine = reject;
      });
    };

    function confirmDefine(_ref) {
      var factory = _ref.factory,
          dependencies = _ref.dependencies;
      var currentTag = _getCurrentTag() || {};

      if (_isWaitingForDefineConfirmation(currentTag)) {
        currentTag.versiontype.dependencies = dependencies;
        currentTag.confirmDefine(factory);
        currentTag.confirmDefine = null;
        return {
          currentTag: currentTag,
          success: true
        };
      } else {
        return {
          currentTag: currentTag,
          success: false
        };
      }
    }

    function _isWaitingForDefineConfirmation(currentTag) {
      var _currentTag$versionty, _currentTag$versionty2, _currentTag$versionty3;

      return typeof currentTag.confirmDefine === 'function' && ((_currentTag$versionty = currentTag.versiontype) === null || _currentTag$versionty === void 0 ? void 0 : (_currentTag$versionty2 = _currentTag$versionty.urls) === null || _currentTag$versionty2 === void 0 ? void 0 : (_currentTag$versionty3 = _currentTag$versionty2.indexOf) === null || _currentTag$versionty3 === void 0 ? void 0 : _currentTag$versionty3.call(_currentTag$versionty2, currentTag.src)) > -1;
    }

    function getCurrentVersion() {
      var currentTag = _getCurrentTag();

      return currentTag.version;
    }

    function _getCurrentTag() {
      if (document.currentScript) {
        return document.currentScript;
      } else {
        var scripts = document.head.getElementsByTagName('script');
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
      waitForDefine: waitForDefine,
      confirmDefine: confirmDefine,
      cancelDefine: cancelDefine,
      getCurrentVersion: getCurrentVersion
    };

    var VersionNumber = /*#__PURE__*/function () {
      function VersionNumber(version) {
        _classCallCheck(this, VersionNumber);

        var versionType = _typeof(version);

        if (versionType === 'string') {
          this.parse(version);
        } else if (versionType === 'object' && version !== null) {
          var tolerance = version.tolerance,
              minor = version.minor,
              major = version.major,
              patch = version.patch,
              build = version.build,
              rc = version.rc,
              isdefault = version.isdefault,
              str = version.str;
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

      _createClass(VersionNumber, [{
        key: "parse",
        value: function parse(str) {
          this._str = str.replace('-default', '');
          if (this._str === '*') this.tolerance = '*';
          var versionFragments = str.match(constants.reVersionNumber);
          if (str.indexOf('default') > -1) this._isdefault = true;

          if (versionFragments && versionFragments.length === 8) {
            //check if this is a default package
            var indexOfDefault = versionFragments.indexOf('-default');
            if (indexOfDefault > -1) versionFragments.splice(indexOfDefault, 1); //fill out the rest of the version object

            if (typeof versionFragments[1] === 'string') this.tolerance = versionFragments[1];
            this.major = VersionNumber.toNumber(versionFragments[2]);
            this.minor = VersionNumber.toNumber(versionFragments[3]);
            if (typeof versionFragments[4] === 'string') this.patch = VersionNumber.toNumber(versionFragments[4].substr(1));
            if (typeof versionFragments[5] === 'string') this.build = VersionNumber.toNumber(versionFragments[5].substr(1));
            if (typeof versionFragments[6] === 'string') this.rc = VersionNumber.toNumber(versionFragments[6].substr(1));
          }
        }
      }, {
        key: "default",
        get: function get() {
          return this._isdefault || false;
        }
      }, {
        key: "str",
        get: function get() {
          if (this._str) {
            return this._str;
          } else if (typeof this.major === 'undefined') {
            return 'anonymous';
          } else {
            var strTolerance = this.tolerance || '';
            var strPatch = typeof this.patch !== 'undefined' ? ".".concat(this.patch) : '';
            var strBuild = typeof this.build !== 'undefined' ? ".".concat(this.build) : '';
            var strRc = typeof this.rc !== 'undefined' ? "-".concat(this.rc) : '';
            return "".concat(strTolerance).concat(this.major, ".").concat(this.minor).concat(strPatch).concat(strBuild).concat(strRc);
          }
        }
      }], [{
        key: "toNumber",
        value: function toNumber(str) {
          var castedNum = Number(str);
          return isNaN(castedNum) ? str : castedNum;
        }
      }]);

      return VersionNumber;
    }();

    var RegistryAttributes = /*#__PURE__*/function () {
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
      function RegistryAttributes(args) {
        _classCallCheck(this, RegistryAttributes);

        this.files = [];

        this._splitEachArgumentIntoSingleFiles(args);
      } //run through each of the arguments passed to the constructor, and create a flat list of files (1 per url)


      _createClass(RegistryAttributes, [{
        key: "_splitEachArgumentIntoSingleFiles",
        value: function _splitEachArgumentIntoSingleFiles(args) {
          for (var i = 0; i < args.length; i++) {
            var arg = args[i];

            var argType = _typeof(arg);

            if (argType === 'string') {
              this._addFile(arg);
            } else if (arg instanceof Array) {
              this._splitArrayIntoSingleFiles(arg);
            } else if (argType === 'object') {
              this._splitObjectIntoSingleFiles(arg);
            }
          }
        }
      }, {
        key: "_splitArrayIntoSingleFiles",
        //if the the argument is an array, iterate through all array-elements
        //if the array element is a string (= url or packagename) add
        value: function _splitArrayIntoSingleFiles(arr) {
          var _this = this;

          arr.forEach(function (arrElement) {
            if (typeof arrElement === 'string') {
              _this._addFile(arrElement);
            } else if (_typeof(arrElement) === 'object' && arrElement !== null) {
              _this._splitObjectIntoSingleFiles(arrElement);
            }
          });
        } //run through each object key-value pair...
        //The key needs to be the packgename, the value needs to be the url(s), or config object

      }, {
        key: "_splitObjectIntoSingleFiles",
        value: function _splitObjectIntoSingleFiles(obj) {
          var _this2 = this;

          Object.keys(obj).forEach(function (packageName) {
            var objElement = obj[packageName];

            var objElementType = _typeof(obj[packageName]);

            if (objElementType === 'string') {
              _this2._addFile(packageName, objElement); //format === {package: 'packageurl'}

            } else if (objElement instanceof Array) {
              objElement.forEach(function (packageConfig) {
                var packageConfigType = _typeof(packageConfig);

                if (packageConfigType === 'string') {
                  _this2._addFile(packageName, packageConfig); //it's an array of urls; format === {package: [file1, file2, file3, ...]}

                } else if (packageConfigType === 'object') {
                  _this2._splitPackageConfigObjectIntoFiles(packageName, packageConfig); //array of objects; format === {package: [{version: '', url: ''}, {...}]}

                }
              });
            } else if (objElementType === 'object') {
              _this2._splitPackageConfigObjectIntoFiles(packageName, objElement);
            }
          });
        } //each config object can have 1 or more versions and 1 or more urls

      }, {
        key: "_splitPackageConfigObjectIntoFiles",
        value: function _splitPackageConfigObjectIntoFiles(packageName, obj) {
          var _this3 = this;

          var version = obj.version,
              versions = obj.versions,
              url = obj.url,
              urls = obj.urls,
              type = obj.type,
              dependencies = obj.dependencies,
              factory = obj.factory;

          if (versions instanceof Array && versions.length > 0) {
            versions.forEach(function (singleVersion) {
              return _this3._splitPackageConfigObjectIntoFiles(packageName, _objectSpread2(_objectSpread2({}, obj), {}, {
                version: singleVersion,
                versions: null
              }));
            });
          } else {
            if (urls instanceof Array) {
              urls.forEach(function (singleUrl) {
                return _this3._splitPackageConfigObjectIntoFiles(packageName, _objectSpread2(_objectSpread2({}, obj), {}, {
                  url: singleUrl,
                  urls: null
                }));
              });
            } else {
              this._addFile(packageName, url, version, type, dependencies, factory);
            }
          }
        }
      }, {
        key: "_addFile",
        value: function _addFile(packageName, url, version, type, dependencies, factory) {
          if (packageName) {
            //if there is no package-name, use the url without versionnumber
            if (typeof url === 'undefined') url = packageName.replace(constants.reVersionNumberAtEnd, ''); //get the package filetype

            type = type || RegistryAttributes.guessType(packageName) || RegistryAttributes.guessType(url);
            var reCleanTypePrefixOnly = type ? new RegExp("^".concat(type, "!")) : '';
            var reCleanType = type ? new RegExp("^".concat(type, "!|\\.").concat(type, "$"), 'g') : ''; //try to get a versionnumber

            version = version || this._getVersionInfo(packageName, url);
            if (!(version instanceof VersionNumber)) version = new VersionNumber(version); //clean package-name and url

            this.files.push({
              name: packageName.replace(constants.reFindVersionNumber, '').replace(reCleanType, '').replace(constants.reUrlWithoutProtocolNorSpecialCharacters, ''),
              url: typeof url === 'string' ? url.replace(reCleanTypePrefixOnly, '') : false,
              version: version,
              type: type,
              dependencies: dependencies,
              factory: factory
            });
          }
        }
      }, {
        key: "_getVersionInfo",
        value: function _getVersionInfo(packageName, url) {
          var versionFromPackageName = RegistryAttributes.getVersionString(packageName);

          if (versionFromPackageName === null || versionFromPackageName === 'default') {
            var versionFromUrl = RegistryAttributes.getVersionString(url);

            if (versionFromPackageName === 'default') {
              return versionFromUrl ? "".concat(versionFromUrl, "-default") : 'default';
            } else {
              return versionFromUrl;
            }
          } else {
            return versionFromPackageName;
          }
        }
      }], [{
        key: "getVersionString",
        value: function getVersionString(value) {
          //check the version-number is present in the url or packagename
          if (value) {
            var version = value.match(constants.reFindVersionNumber);
            return version && version.length === 7 ? version[1] : null;
          }
        } //guess the filetype from the name or url

      }, {
        key: "guessType",
        value: function guessType(value) {
          if (value) {
            //remove version if present
            value = value.replace(constants.reFindVersionNumber, ''); //first check if the filetype is provided in the name (html!myHtmlFragment)

            var indexOfExclamation = value.indexOf('!');

            if (indexOfExclamation > -1) {
              return value.substr(0, indexOfExclamation);
            } else {
              //try to fetch a valid extension from the first urls
              var extension = constants.reExtension.exec(value);
              if (extension && extension.length === 3) return extension[1];
            }
          }
        }
      }]);

      return RegistryAttributes;
    }();

    var _default$6 = /*#__PURE__*/function () {
      function _default(options, parent) {
        _classCallCheck(this, _default);

        this.parent = parent;
        this.major = options.version.major;
        this.minor = options.version.minor;
        this.patch = options.version.patch;
        this.build = options.version.build;
        this.rc = options.version.rc;
        this.str = options.version.str || this._getVersionStr();
        this.filetypes = {};
      }

      _createClass(_default, [{
        key: "addFileType",
        value: function addFileType(options) {
          var that = this;
          var version = that.str; //at this point only one url should be registered at a time...

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
      }, {
        key: "loadFileType",
        value: function loadFileType(filetype) {
          if (this.filetypes[filetype]) {
            return root.requirees.loaders.loadTypeFromVersion(this, filetype);
          } else {
            console.warn("RequireEs: There is no ".concat(filetype, "-file present in package ").concat(this.parent.name, " (version ").concat(this.str, ")"));
          }
        } //check if the files for this packages are all loaded and ready to go

      }, {
        key: "isSpecified",
        value: function isSpecified(filetype) {
          var sFiletype = (filetype === null || filetype === void 0 ? void 0 : filetype.type) || filetype;

          if (typeof sFiletype === 'string') {
            var loadedFileType = this.filetypes[sFiletype];
            return (loadedFileType === null || loadedFileType === void 0 ? void 0 : loadedFileType.hasOwnProperty('exports')) || false;
          } else {
            var filetypes = Object.keys(this.filetypes);

            for (var i = 0; filetypes.length > i; i++) {
              if (this.filetypes[filetypes[i]].hasOwnProperty('exports') === false) return false;
            }

            return true;
          }
        } //undefine a package (destroy the filetypes)

      }, {
        key: "undef",
        value: function undef(filetype) {
          var _this = this;

          var sFiletype = (filetype === null || filetype === void 0 ? void 0 : filetype.type) || filetype;

          if (typeof sFiletype === 'string') {
            delete this.filetypes[sFiletype];
          } else {
            Object.keys(this.filetypes).forEach(function (ft) {
              return delete _this.filetypes[ft];
            });
          }
        } //load dependencies or define exports

      }, {
        key: "shim",
        value: function shim(filetype, shimConfig) {
          if (_typeof(shimConfig) !== 'object') return;

          var file = this._getFile(filetype);

          if (file) {
            if (shimConfig.deps instanceof Array) this._addDependencies(file, shimConfig.deps, 'PreLoad');
            if (typeof shimConfig.exports === 'string') file.postFactory = function () {
              return root[shimConfig.exports];
            };
            if (typeof shimConfig.exports === 'function') file.postFactory = shimConfig.exports;
          }
        } //add dependencies

      }, {
        key: "addDependencies",
        value: function addDependencies(filetype, config, preload) {
          if (_typeof(config) !== 'object') return;

          var file = this._getFile(filetype);

          this._addDependencies(file, config, preload ? 'PreLoad' : 'Extra');
        } //returns the filetype definition within this version

      }, {
        key: "_getFile",
        value: function _getFile(filetype) {
          var sFiletype = (filetype === null || filetype === void 0 ? void 0 : filetype.type) || filetype;
          if (typeof sFiletype !== 'string') sFiletype = 'js';
          return this.filetypes[sFiletype];
        } //multiple shim calls can add multiple dependencies

      }, {
        key: "_addDependencies",
        value: function _addDependencies(file, dependencies, type) {
          var key = "dependencies".concat(type);
          if (!(file[key] instanceof Array)) file[key] = [];

          if (dependencies instanceof Array) {
            dependencies.forEach(function (dep) {
              if (typeof dep === 'string' && file[key].indexOf(dep) === -1) file[key].push(dep);
            });
          }
        } //add urls, add factory, create filetype, ...

      }, {
        key: "_processFileType",
        value: function _processFileType(options) {
          options.type = options.type || RegistryAttributes.guessType(options.url) || 'js';
          if (_typeof(this.filetypes[options.type]) !== 'object') this.filetypes[options.type] = {
            urls: []
          };
          var fileToProcess = this.filetypes[options.type];
          if (typeof options.factory !== 'undefined') this._setFactory(options.factory, fileToProcess);
          if (options.dependencies instanceof Array) fileToProcess.dependencies = options.dependencies;
          if (typeof options.url === 'string' && fileToProcess.urls.indexOf(options.url) === -1) fileToProcess.urls.unshift(options.url);
          return fileToProcess;
        } //sets the factory for a certain filetype (if allowed)

      }, {
        key: "_setFactory",
        value: function _setFactory(factory, file) {
          if (this._canBeDefined(file)) {
            delete file.dfr;
            delete file.exports;
            file.factory = factory;
          } else {
            console.warn("RequireEs - Computer says no: package ".concat(this.parent.name, " - ").concat(this.str, " is already defined... Redefining this package is not allowed!"));
          }
        } //get the general settings from requirees.config()

      }, {
        key: "_getRequireEsConfigOptions",
        value: function _getRequireEsConfigOptions() {
          var _this$parent, _this$parent$parent, _this$parent$parent$p;

          return (_this$parent = this.parent) === null || _this$parent === void 0 ? void 0 : (_this$parent$parent = _this$parent.parent) === null || _this$parent$parent === void 0 ? void 0 : (_this$parent$parent$p = _this$parent$parent.parent) === null || _this$parent$parent$p === void 0 ? void 0 : _this$parent$parent$p.options;
        } //check if the package can be defined or redefined

      }, {
        key: "_canBeDefined",
        value: function _canBeDefined(file) {
          if (file.hasOwnProperty('exports')) {
            var requireEsConfig = this._getRequireEsConfigOptions();

            return requireEsConfig.allowRedefine || false;
          } else {
            return true;
          }
        }
      }, {
        key: "_getVersionStr",
        value: function _getVersionStr() {
          var _this2 = this;

          this.str = constants.versionFormat.map(function (fragmnt) {
            return fragmnt !== 'rc' && _this2[fragmnt];
          }).filter(function (fragmnt) {
            return typeof fragmnt === 'number' || typeof fragmnt === 'string';
          }).join('.');
          if (typeof this.rc !== 'undefined' && this.rc !== null && this.rc !== "") this.str += "".concat(typeof this.rc === 'string' ? '-' : '.').concat(this.rc);
          return this.str;
        }
      }, {
        key: "test",
        value: function test(version) {
          var tolerance = version.tolerance;

          if (tolerance === '*') {
            return true;
          } else if (tolerance === '^') {
            return this.major === version.major;
          } else if (tolerance === '~') {
            return this.major === version.major && this.minor === version.minor;
          } else {
            //exact match
            for (var iFrag = 0; iFrag < constants.versionFormat.length; iFrag++) {
              var fragmnt = constants.versionFormat[iFrag];

              if (!tolerance && (this[fragmnt] || 0) !== (version[fragmnt] || 0)) {
                return false;
              }
            } //if any tolerance was given >> return false ... else true


            return Boolean(!tolerance);
          }
        }
      }, {
        key: "toJson",
        value: function toJson() {
          var version = {
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
      }]);

      return _default;
    }();

    var _default$5 = /*#__PURE__*/function () {
      function _default(options, parent) {
        _classCallCheck(this, _default);

        this.parent = parent;
        this.versions = [];
        this.isDirty = false;
        this.name = options.name;
      }

      _createClass(_default, [{
        key: "find",
        value: function find(versionObj) {
          return this.versions.filter(function (version) {
            return version.test(versionObj);
          });
        }
      }, {
        key: "findOne",
        value: function findOne(versionObj) {
          var _iterator = _createForOfIteratorHelper(this.versions),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var version = _step.value;
              if (version instanceof _default$6 && version.test(versionObj)) return version;
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }

          return null;
        }
      }, {
        key: "remove",
        value: function remove(versionsToDelete) {
          if (!(versionsToDelete instanceof Array)) versionsToDelete = [versionsToDelete];
          this.versions = this.versions.filter(function (version) {
            return versionsToDelete.indexOf(version) === -1;
          });
          return this;
        }
      }, {
        key: "length",
        value: function length() {
          return this.versions.length;
        } //add possible multiple versions to this package

      }, {
        key: "add",
        value: function add(options) {
          if (options.version && typeof options.version.tolerance !== 'undefined') delete options.version.tolerance;
          var target = this.findOne(options.version);

          if (!(target instanceof _default$6)) {
            target = new _default$6(options, this);
            this.versions.push(target);
            this.isDirty = true;
            if (typeof options.sort === 'boolean' ? options.sort : true) this.sort(options);
          }

          target.addFileType(options);
          if (options.version.default) this.default = target;
          return target;
        }
      }, {
        key: "sort",
        value: function sort(options) {
          if (this.isDirty) {
            this.versions = this.versions.sort(function (a, b) {
              for (var iFragment = 0; iFragment < constants.versionFormat.length; iFragment++) {
                var fragmnt = constants.versionFormat[iFragment];
                if (a[fragmnt] !== b[fragmnt]) return a[fragmnt] < b[fragmnt] ? 1 : -1;
              }
            });
          }

          this.isDirty = false;
          return this;
        }
      }, {
        key: "toJson",
        value: function toJson() {
          return this.versions.map(function (version) {
            return version.toJson();
          });
        }
      }]);

      return _default;
    }();

    var _default$4 = /*#__PURE__*/function () {
      function _default(options, parent) {
        _classCallCheck(this, _default);

        this.parent = parent;
        this.options = options;
        this.packages = {};
      } //add packages


      _createClass(_default, [{
        key: "add",
        value: function add() {
          var _this = this;

          //one package can have multiple js, css, wasm, ... sources... if multiple urls are provided, split them further up, per type
          var _Attributes = new RegistryAttributes(arguments),
              files = _Attributes.files; //loop through files and add to the packages one by one


          if (files instanceof Array) {
            files.forEach(function (file) {
              _this._publish("".concat(constants.events.ns).concat(constants.events.pre).concat(constants.events.register), {
                file: file
              });

              if (!_this.packages[file.name]) {
                _this.packages[file.name] = new _default$5(file, _this);
              }

              _this.packages[file.name].add(file);

              _this._publish("".concat(constants.events.ns).concat(constants.events.register), {
                package: _this.packages[file.name],
                file: file
              });
            });
          }

          this.sort(); //sort the packages to be easily searchable

          return this; //make chainable
        }
      }, {
        key: "_publish",
        value: function _publish(evtName, data) {
          var _this$parent, _this$parent$events;

          (_this$parent = this.parent) === null || _this$parent === void 0 ? void 0 : (_this$parent$events = _this$parent.events) === null || _this$parent$events === void 0 ? void 0 : _this$parent$events.publish(evtName, data);
        } //sort all packages on version number

      }, {
        key: "sort",
        value: function sort() {
          var _this2 = this;

          Object.keys(this.packages).forEach(function (pckg) {
            return _this2.packages[pckg].sort();
          });
        } //remove a package

      }, {
        key: "remove",
        value: function remove() {
          var attrs = new RegistryAttributes(arguments);
          var match = this.find(attrs);

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
        } //find all matching packages

      }, {
        key: "find",
        value: function find() {
          var _Attributes2 = new RegistryAttributes(arguments),
              files = _Attributes2.files;

          return files instanceof Array ? this._find(files[0], false) : [];
        } //find the first match

      }, {
        key: "findOne",
        value: function findOne() {
          var _Attributes3 = new RegistryAttributes(arguments),
              files = _Attributes3.files;

          return files instanceof Array ? this._find(files[0], true) : null;
        } //internal find in registry logic

      }, {
        key: "_find",
        value: function _find(attrs, findOne) {
          var pckg = this.packages[attrs.name];

          if (pckg) {
            var foundPackages;
            var results = {
              pckg: pckg,
              attrs: attrs
            };

            if (constants.returnDefaultOnVersionStr.indexOf(attrs.version.str) > -1 && pckg.default) {
              foundPackages = findOne ? pckg.default : [pckg.default];
            } else {
              var targetVersion = attrs.version && typeof attrs.version.major !== 'undefined' ? attrs.version : {
                tolerance: '*'
              };
              foundPackages = pckg[findOne ? 'findOne' : 'find'](targetVersion);
            }

            results["match".concat(findOne ? '' : 'es')] = foundPackages;
            return results;
          } else {
            return {
              attrs: attrs
            };
          }
        } //return registry to json

      }, {
        key: "toJson",
        value: function toJson() {
          var _this3 = this;

          var registry = {};
          Object.keys(this.packages).forEach(function (pckg) {
            return registry[pckg] = _this3.packages[pckg].toJson();
          });
          return registry;
        }
      }]);

      return _default;
    }();

    var _default$3 = /*#__PURE__*/function () {
      function _default$1() {
        _classCallCheck(this, _default$1);

        this._reservedDependencies = {};
        this.add('require', this.requireHandler.bind(this)).add('requirees', this.requireEsHandler.bind(this)).add('exports', this.exportsHandler.bind(this)).add('mdl', this.moduleHandler.bind(this));
      }

      _createClass(_default$1, [{
        key: "add",
        value: function add(handlerName, handler) {
          if (typeof handler === 'function' && typeof handlerName === 'string') {
            this._reservedDependencies[handlerName] = handler;
          }

          return this;
        }
      }, {
        key: "get",
        value: function get(handlerName, mdl) {
          var handler = this._reservedDependencies[handlerName];
          return handler ? handler(mdl) : null;
        }
      }, {
        key: "moduleHandler",
        value: function moduleHandler(mdl) {
          var _mdl$parent;

          mdl.uri = mdl.urls;
          mdl.id = (_mdl$parent = mdl.parent) === null || _mdl$parent === void 0 ? void 0 : _mdl$parent.name;
          if (typeof mdl.exports === 'undefined') mdl.exports = {};
          return mdl;
        }
      }, {
        key: "exportsHandler",
        value: function exportsHandler(mdl) {
          if (typeof mdl.exports === 'undefined') mdl.exports = {};
          return mdl.exports;
        }
      }, {
        key: "requireHandler",
        value: function requireHandler(mdl) {
          if (mdl.require) {
            return mdl.require;
          } else {
            var _this$_makeNewRequire = this._makeNewRequireEsContext(mdl),
                require = _this$_makeNewRequire.require;

            return require;
          }
        }
      }, {
        key: "requireEsHandler",
        value: function requireEsHandler(mdl) {
          if (mdl.requirees) {
            return mdl.requirees;
          } else {
            var _this$_makeNewRequire2 = this._makeNewRequireEsContext(mdl),
                requirees = _this$_makeNewRequire2.requirees;

            return requirees;
          }
        }
      }, {
        key: "_makeNewRequireEsContext",
        value: function _makeNewRequireEsContext(mdl) {
          var requireEs = new _default();
          mdl.require = requireEs.asFunction(false);
          mdl.requirees = requireEs.asFunction(true);
          return {
            'requirees': mdl.requirees,
            'require': mdl.require
          };
        }
      }, {
        key: "reservedDependencyNames",
        get: function get() {
          return Object.keys(this._reservedDependencies);
        }
      }]);

      return _default$1;
    }();

    function factoryRunner$4(factory) {
      if (typeof factory === 'string') {
        var style = document.createElement('style');
        style.innerText = factory;
        return document.head.appendChild(style);
      }
    }

    function load$4(url, version, versiontype) {
      return new Promise(function (resolve) {
        var link = document.createElement('link');
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = url;
        link.onload = resolve.bind(version, link);
        document.head.appendChild(link);
      });
    }

    var css = {
      load: load$4,
      factoryRunner: factoryRunner$4
    };

    function txt (url) {
      return fetch(url).then(function (r) {
        return r.text();
      });
    }

    var domparser$1 = null;

    function parseHtml(txtHtml) {
      if (!domparser$1) domparser$1 = new DOMParser();
      var doc = domparser$1.parseFromString(txtHtml, 'text/html');

      if (doc.documentElement) {
        if (txtHtml.indexOf('<body>') === -1) {
          var nodes = doc.body && doc.body.children || [];
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
      return new Promise(function (resolve) {
        root.require("txt!".concat(url), function (txtHtml) {
          resolve(parseHtml(txtHtml));
        });
      });
    }

    var html = {
      load: load$3,
      factoryRunner: factoryRunner$3
    };

    var domparser = null;

    function parseXml(txt) {
      if (!domparser) domparser = new DOMParser();
      return domparser.parseFromString(txt, 'application/xml');
    }

    function factoryRunner$2(factory) {
      return typeof factory === 'string' ? parseXml(factory) : factory;
    }

    function load$2(url, version, versiontype) {
      return new Promise(function (resolve) {
        root.require("txt!".concat(url), function (txtXml) {
          return resolve(parseXml(txtXml));
        });
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

    function js (url, version, versiontype) {
      var script = document.createElement('script');
      script.charset = 'utf-8';
      script.async = true;
      script.addEventListener('error', function () {
        return onScriptLoad(script, "requirees: could not load ".concat(url));
      });
      script.addEventListener('load', function () {
        return onScriptLoad(script);
      });
      script.src = url;
      script.version = version;
      script.versiontype = versiontype;

      if (script.src !== url) {
        var _version$filetypes$js;

        var jsVersionUrls = (_version$filetypes$js = version.filetypes['js']) === null || _version$filetypes$js === void 0 ? void 0 : _version$filetypes$js.urls;
        var urlIndex = jsVersionUrls === null || jsVersionUrls === void 0 ? void 0 : jsVersionUrls.indexOf(url);
        jsVersionUrls === null || jsVersionUrls === void 0 ? void 0 : jsVersionUrls.splice(urlIndex, 1, script.src);
      }

      document.head.appendChild(script);
      return currentTagLoad.waitForDefine(script);
    }

    function factoryRunner$1(factory) {
      return typeof factory === 'string' ? JSON.parse(factory) : factory;
    }

    function load$1(url) {
      return fetch(url).then(function (r) {
        return r.json();
      });
    }

    var json = {
      load: load$1,
      factoryRunner: factoryRunner$1
    };

    var CustomElementController = /*#__PURE__*/function () {
      function CustomElementController(version) {
        _classCallCheck(this, CustomElementController);

        this.version = version;
        this.name = version.parent.name;
      }

      _createClass(CustomElementController, [{
        key: "getAll",
        value: function getAll() {
          return document.querySelectorAll(this.name);
        }
      }]);

      return CustomElementController;
    }();

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
      return new Promise(function (resolve) {
        root.require(url, function (CustomNode) {
          return resolve(registerCustomElement(CustomNode, version));
        });
      });
    }

    var tag = {
      load: load,
      factoryRunner: factoryRunner
    };

    function wasm (url, version) {
      if (typeof root.WebAssembly === 'undefined') {
        console.warn("Requirees: this browser does not support WebAssembly... Package ".concat(version.parent.name, " cannot be loaded"));
      } else {
        return fetch(url).then(function (resp) {
          return resp.arrayBuffer();
        }).then(function (bytes) {
          return WebAssembly.instantiate(bytes);
        }).then(function (result) {
          return result.instance.exports;
        });
      }
    }

    var _default$2 = /*#__PURE__*/function () {
      function _default(requireContext) {
        _classCallCheck(this, _default);

        this.requireContext = requireContext;
        this.reservedDependencies = new _default$3(requireContext);
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

      _createClass(_default, [{
        key: "add",
        value: function add(type, loader) {
          if (_typeof(loader) === 'object') {
            var fn = loader.load || loader.loader || loader.get;
            var fnUnload = loader.unload || loader.unloader || loader.remove || loader.delete;
            var fnFactory = loader.handleFactory || loader.factory || loader.factoryRunner || loader.factoryLoader;
            if (typeof fn === 'function') this.loaders[type] = fn;
            if (typeof fnUnload === 'function') this.unloaders[type] = fnUnload;
            if (typeof fnFactory === 'function') this.factoryRunners[type] = fnFactory;
          } else if (typeof loader === 'function') {
            this.loaders[type] = loader;
          }
        }
      }, {
        key: "get",
        value: function get(type) {
          return this.loaders[type] || this.loaders['js'];
        }
      }, {
        key: "load",
        value: function load() {
          var _this = this;

          var searchResult = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
          var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
          var attrs = searchResult.attrs;

          if (!searchResult.match) {
            console.warn("RequireEs - Oh fudge, we did not find any package '".concat(attrs && attrs.name || '<unknown>', "' that matches version '").concat(attrs && attrs.version && attrs.version.str || '<unknown>', "'"));
            return null;
          } else {
            var packageFiletypes = searchResult.match.filetypes;
            var type = attrs && attrs.type;

            if (type && packageFiletypes[type]) {
              return this.loadTypeFromVersion(searchResult.match, type);
            } else {
              //download all the filetypes for this package... If waiting is needed, use promises, otherwise sync response (for cjs usage)
              var hasPromise = false;
              var instanceResolves = Object.keys(packageFiletypes).map(function (type) {
                var instanceResolver = _this.loadTypeFromVersion(searchResult.match, type);

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
      }, {
        key: "_returnMultiFiletypeLoad",
        value: function _returnMultiFiletypeLoad(packageFiletypes, options, allInstances) {
          var arrPackageFiletypes = Object.keys(packageFiletypes);

          if (options.returnAll) {
            //return all the instances back... create an object with all loaded filetypes
            var returnObj = {};
            arrPackageFiletypes.forEach(function (key, i) {
              return returnObj[key] = allInstances[i];
            });
            return returnObj;
          } else {
            // try to return the most obvious instance back as default
            // use the same order as in which the loaders are defined (js / wasm / tag / html /...)
            var loaderTypes = Object.keys(this.loaders);

            for (var iType = 0; iType < loaderTypes.length; iType++) {
              var loader = arrPackageFiletypes.indexOf(loaderTypes[iType]);
              if (loader > -1) return allInstances[loader];
            }
          }
        }
      }, {
        key: "loadTypeFromVersion",
        value: function loadTypeFromVersion(version, type) {
          var _this2 = this;

          var versiontype = version.filetypes[type];

          this._publishEvt("".concat(constants.events.ns).concat(constants.events.pre).concat(constants.events.loadFile), {
            package: version.parent,
            versiontype: versiontype,
            version: version
          });

          if (_typeof(versiontype) === 'object' && versiontype !== null) {
            if (typeof versiontype.exports !== 'undefined') {
              return versiontype.exports;
            } else if (versiontype.dfr instanceof Promise) {
              return versiontype.dfr;
            } else {
              return versiontype.dfr = new Promise(function (resolve, reject) {
                if (versiontype.factory) {
                  _this2._resolveFactoryDependencies(resolve, version, type);
                } else {
                  _this2._loadFromUrl(version, type).then(function (factory) {
                    versiontype.factory = factory;

                    _this2._resolveFactoryDependencies(resolve, version, type);
                  }).catch(reject);
                }
              }).then(function (instance) {
                _this2._publishEvt("".concat(constants.events.ns).concat(constants.events.loadFile), {
                  package: version.parent,
                  instance: instance,
                  versiontype: versiontype,
                  version: version
                });

                return instance;
              });
            }
          }
        }
      }, {
        key: "_publishEvt",
        value: function _publishEvt(evt, data) {
          this.requireContext.events.publish(evt, data);
        }
      }, {
        key: "_resolveFactoryDependencies",
        value: function _resolveFactoryDependencies(resolve, version, type) {
          var _this3 = this;

          var versiontype = version.filetypes[type];
          var dependencies = versiontype.dependencies instanceof Array ? versiontype.dependencies : [];
          var dependenciesExtra = versiontype.dependenciesExtra instanceof Array ? versiontype.dependenciesExtra : [];
          var dependenciesPreLoad = versiontype.dependenciesPreLoad instanceof Array ? versiontype.dependenciesPreLoad : [];
          var allDependencies = dependencies.concat(dependenciesExtra).concat(dependenciesPreLoad);
          var reservedDependencyNames = this.reservedDependencies.reservedDependencyNames;

          if (allDependencies.length) {
            var loadingDependencies = allDependencies.map(function (dependency) {
              if (reservedDependencyNames.indexOf(dependency) > -1) {
                return _this3.reservedDependencies.get(dependency, versiontype);
              } else {
                return _this3.requireContext.get(dependency);
              }
            });
            return Promise.all(loadingDependencies).then(function (deps) {
              return _this3._resolveFactory(resolve, version, type, deps);
            });
          } else {
            return this._resolveFactory(resolve, version, type, []);
          }
        }
      }, {
        key: "_resolveFactory",
        value: function _resolveFactory(resolve, version, type, deps) {
          var versiontype = version.filetypes[type];
          var factoryResult;

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

          if (typeof versiontype.exports === 'undefined') {
            if (typeof versiontype.postFactory === 'function') factoryResult = versiontype.postFactory(factoryResult);
            versiontype.exports = factoryResult;
          }

          resolve(versiontype.exports);
        }
      }, {
        key: "_loadFromUrl",
        value: function _loadFromUrl(version, type) {
          var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
          var loader = this.get(type);

          if (typeof loader === 'function') {
            var file = version.filetypes[type];
            var urls = file.urls;

            if (index < urls.length) {
              try {
                return this._waitForPreLoadDependencies(file).then(function () {
                  return loader(urls[index], version, file);
                });
              } catch (e) {
                return this._loadFromUrl(version, type, index + 1);
              }
            }
          }
        }
      }, {
        key: "_waitForPreLoadDependencies",
        value: function _waitForPreLoadDependencies(file) {
          if (file.dependenciesPreLoad instanceof Array && file.dependenciesPreLoad.length > 0) {
            return this.requireContext.getPromise(file.dependenciesPreLoad);
          } else {
            return Promise.resolve();
          }
        }
      }]);

      return _default;
    }();

    var _default$1 = /*#__PURE__*/function () {
      function _default() {
        _classCallCheck(this, _default);

        this.register = {};
      }

      _createClass(_default, [{
        key: "subscribe",
        value: function subscribe(evt, callback) {
          if (!(this.register[evt] instanceof Array)) this.register[evt] = [];
          this.register[evt].push(callback);
          return "".concat(evt, "[").concat(this.register[evt].length - 1, "]");
        }
      }, {
        key: "unsubscribe",
        value: function unsubscribe(key) {
          try {
            var keyFragments = key.match(constants.events.resolve.regexp);
            var fnName = keyFragments[constants.events.resolve.fnName];
            var fnIndex = keyFragments[constants.events.resolve.fnIndex];

            if (typeof fnIndex === 'undefined') {
              delete this.register[fnName];
            } else {
              delete this.register[fnName][fnIndex];
            }
          } catch (e) {
            console.warn("RequireEs: we could not unsubscribe from ".concat(key), e);
          }
        }
      }, {
        key: "publish",
        value: function publish(evt, payload) {
          var evts = this.register[evt] instanceof Array ? this.register[evt] : [];
          var evtsAndWireTaps = evts.concat(this.register[constants.events.wireTapEventName]);
          evtsAndWireTaps.forEach(function (fn) {
            try {
              if (typeof fn === 'function') fn(payload, evt);
            } catch (e) {
              console.error("RequireEs: Error while executing a function in ".concat(evt), e);
            }
          });
        }
      }, {
        key: "addWireTap",
        value: function addWireTap(fn) {
          return typeof fn === 'function' ? this.subscribe(constants.events.wireTapEventName, fn) : null;
        }
      }]);

      return _default;
    }();

    //transforms the RequireJs paths format to RequireEs register format
    // -> add js extensions if needed
    // from: {paths: {react: 'https://foo.bar/react'}} to: [{name: 'react', url: 'https://foo.bar/react.js'}]
    function transformRJSPaths(packages) {
      var requireEsFormat = [];

      if (_typeof(packages) === 'object') {
        Object.keys(packages).forEach(function (packageName) {
          var urls = packages[packageName];
          if (typeof urls === 'string') urls = [urls];

          if (urls instanceof Array) {
            urls.forEach(function (url) {
              return requireEsFormat.push(_defineProperty({}, packageName, doesUrlNeedJsExtention(url) ? "".concat(url, ".js") : url));
            });
          }
        });
      }

      return requireEsFormat;
    }

    function doesUrlNeedJsExtention(url) {
      var reHasJsExtention = /\.js(\?.*)?$/;
      return url.indexOf('!') === -1 && !reHasJsExtention.test(url);
    }

    var _default = /*#__PURE__*/function () {
      function _default(options) {
        _classCallCheck(this, _default);

        this.events = new _default$1();
        this.registry = new _default$4(options, this);
        this.loaders = new _default$2(this);
        this.options = options || {};
        this.amd = {};
      }

      _createClass(_default, [{
        key: "define",
        value: function define() {
          var args = getDefinitionArguments(arguments);
          var name = args.name,
              dependencies = args.dependencies,
              factory = args.factory;
          this.events.publish("".concat(constants.events.ns).concat(constants.events.pre).concat(constants.events.define), {
            args: args
          }); //Carefull with jQuery: In general, explicitly naming modules in the define() call are discouraged, but jQuery has some special constraints.

          var isNamed = typeof name === 'string' && !(name === 'jquery' && typeof factory === 'undefined'); //the module can be both be named AND registered.... In that case, register both!
          //try to defined the anonymous way (do not auto-invoke named modules, only the anonymous ones)

          var resultAnonymousDefine = this._defineAnonymousModule(dependencies, factory, isNamed);

          var resultNamedDefine = isNamed ? this._defineNamedModule(name, dependencies, factory) : null;
          this.events.publish("".concat(constants.events.ns).concat(constants.events.define), {
            args: args
          });
          return resultNamedDefine || resultAnonymousDefine;
        }
      }, {
        key: "_defineNamedModule",
        value: function _defineNamedModule(name, dependencies, factory) {
          var registryElement = {};
          registryElement[name] = {
            dependencies: dependencies,
            factory: factory,
            url: false
          };
          return this.register(registryElement);
        }
      }, {
        key: "_defineAnonymousModule",
        value: function _defineAnonymousModule(dependencies, factory, preventAutoInvoke) {
          //if this is an anonymous define, confirm the currently loading script that loading is done...
          var result = currentTagLoad.confirmDefine({
            dependencies: dependencies,
            factory: factory
          });

          if (!result.success && result.currentTag instanceof HTMLElement) {
            //if no package was confirmed, but a defined function was present... let's register it:
            var registry = this._defineNamedModule(result.currentTag.src, dependencies, factory);

            if (!preventAutoInvoke && this.options.invokeNonMatchedDefines) {
              var _attrs$files, _attrs$files$;

              var attrs = new RegistryAttributes([result.currentTag.src]);
              var pckgName = (_attrs$files = attrs.files) === null || _attrs$files === void 0 ? void 0 : (_attrs$files$ = _attrs$files[0]) === null || _attrs$files$ === void 0 ? void 0 : _attrs$files$.name;
              if (pckgName) this.get(pckgName);
            }

            return registry;
          }
        }
      }, {
        key: "get",
        value: function get() {
          var _this = this;

          var _getRequireArguments = getRequireArguments(arguments),
              dependencies = _getRequireArguments.dependencies,
              callback = _getRequireArguments.callback,
              callbackFail = _getRequireArguments.callbackFail,
              loadSinglePackage = _getRequireArguments.loadSinglePackage,
              options = _getRequireArguments.options;

          var targetInstances = dependencies.map(function (target) {
            var results = _this.findOne(target);

            if (typeof results.match === 'undefined') {
              _this.register(target, options);

              results = _this.findOne(target);
            }

            return _this.loaders.load(results, options);
          });
          var allScriptsLoaded = Promise.all(targetInstances);

          if (typeof callback === 'function') {
            allScriptsLoaded.then(function (instances) {
              return callback.apply(root, instances);
            }).catch(function (err) {
              return callbackFail.apply(root, err);
            });
          }

          return loadSinglePackage ? targetInstances[0] : allScriptsLoaded;
        }
      }, {
        key: "getPromise",
        value: function getPromise() {
          var _arguments = arguments,
              _this2 = this;

          return new Promise(function (resolve) {
            return resolve(_this2.get.apply(_this2, _arguments));
          });
        }
      }, {
        key: "register",
        value: function register() {
          return this.registry.add.apply(this.registry, arguments);
        }
      }, {
        key: "find",
        value: function find() {
          return this.registry.find.apply(this.registry, arguments);
        }
      }, {
        key: "findOne",
        value: function findOne() {
          return this.registry.findOne.apply(this.registry, arguments);
        }
      }, {
        key: "config",
        value: function config() {
          var _this3 = this;

          var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
          if (typeof options.paths !== 'undefined') transformRJSPaths(options.paths).forEach(function (m) {
            return _this3.register(m);
          });
          if (typeof options.allowRedefine !== 'undefined') this.options.allowRedefine = options.allowRedefine;
          if (typeof options.invokeNonMatchedDefines !== 'undefined') this.options.invokeNonMatchedDefines = options.invokeNonMatchedDefines;
          if (_typeof(options.shim) === 'object') this.shim(options.shim);
        }
      }, {
        key: "specified",
        value: function specified(packageName) {
          if (typeof packageName === 'string') {
            var result = this.findOne(packageName);
            return result.match && result.match.isSpecified(result.attrs) || false;
          }

          return false;
        }
      }, {
        key: "undef",
        value: function undef(packageName) {
          if (typeof packageName === 'string') {
            var result = this.findOne(packageName);
            return result.match && result.match.undef(result.attrs);
          }
        }
      }, {
        key: "shim",
        value: function shim(config) {
          var _this4 = this;

          Object.keys(config).forEach(function (packageName) {
            if (typeof packageName === 'string') {
              var _result$match;

              var result = _this4.findOne(packageName);

              if (typeof result.match === 'undefined') {
                _this4.register(_defineProperty({}, packageName, {
                  url: false
                }));

                result = _this4.findOne(packageName);
              }

              (_result$match = result.match) === null || _result$match === void 0 ? void 0 : _result$match.shim(result.attrs, config[packageName]);
            }
          });
        } //returns the instance as a function

      }, {
        key: "asFunction",
        value: function asFunction(usePromises) {
          var requirees = usePromises ? this.getPromise.bind(this) : this.get.bind(this);
          requirees.register = this.register.bind(this);
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
          return requirees;
        }
      }]);

      return _default;
    }();

    root.RequireEs = _default; //setup default require

    var requireEs = new _default(); //global amd module require

    root.require = root.requirejs = requireEs.asFunction(false);
    root.requirees = requireEs.asFunction(true); //global amd module define

    root.define = root.require.define;
    root.define.amd = {};

}());
