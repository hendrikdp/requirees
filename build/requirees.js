(function () {
  'use strict';

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

  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it;

    if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
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

    var normalCompletion = true,
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

  /**
   * @this {Promise}
   */
  function finallyConstructor(callback) {
    var constructor = this.constructor;
    return this.then(function (value) {
      // @ts-ignore
      return constructor.resolve(callback()).then(function () {
        return value;
      });
    }, function (reason) {
      // @ts-ignore
      return constructor.resolve(callback()).then(function () {
        // @ts-ignore
        return constructor.reject(reason);
      });
    });
  }

  function allSettled(arr) {
    var P = this;
    return new P(function (resolve, reject) {
      if (!(arr && typeof arr.length !== 'undefined')) {
        return reject(new TypeError(_typeof(arr) + ' ' + arr + ' is not iterable(cannot read property Symbol(Symbol.iterator))'));
      }

      var args = Array.prototype.slice.call(arr);
      if (args.length === 0) return resolve([]);
      var remaining = args.length;

      function res(i, val) {
        if (val && (_typeof(val) === 'object' || typeof val === 'function')) {
          var then = val.then;

          if (typeof then === 'function') {
            then.call(val, function (val) {
              res(i, val);
            }, function (e) {
              args[i] = {
                status: 'rejected',
                reason: e
              };

              if (--remaining === 0) {
                resolve(args);
              }
            });
            return;
          }
        }

        args[i] = {
          status: 'fulfilled',
          value: val
        };

        if (--remaining === 0) {
          resolve(args);
        }
      }

      for (var i = 0; i < args.length; i++) {
        res(i, args[i]);
      }
    });
  }

  // other code modifying setTimeout (like sinon.useFakeTimers())

  var setTimeoutFunc = setTimeout;

  function isArray(x) {
    return Boolean(x && typeof x.length !== 'undefined');
  }

  function noop() {} // Polyfill for Function.prototype.bind


  function bind(fn, thisArg) {
    return function () {
      fn.apply(thisArg, arguments);
    };
  }
  /**
   * @constructor
   * @param {Function} fn
   */


  function Promise$1(fn) {
    if (!(this instanceof Promise$1)) throw new TypeError('Promises must be constructed via new');
    if (typeof fn !== 'function') throw new TypeError('not a function');
    /** @type {!number} */

    this._state = 0;
    /** @type {!boolean} */

    this._handled = false;
    /** @type {Promise|undefined} */

    this._value = undefined;
    /** @type {!Array<!Function>} */

    this._deferreds = [];
    doResolve(fn, this);
  }

  function handle(self, deferred) {
    while (self._state === 3) {
      self = self._value;
    }

    if (self._state === 0) {
      self._deferreds.push(deferred);

      return;
    }

    self._handled = true;

    Promise$1._immediateFn(function () {
      var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;

      if (cb === null) {
        (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
        return;
      }

      var ret;

      try {
        ret = cb(self._value);
      } catch (e) {
        reject(deferred.promise, e);
        return;
      }

      resolve(deferred.promise, ret);
    });
  }

  function resolve(self, newValue) {
    try {
      // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
      if (newValue === self) throw new TypeError('A promise cannot be resolved with itself.');

      if (newValue && (_typeof(newValue) === 'object' || typeof newValue === 'function')) {
        var then = newValue.then;

        if (newValue instanceof Promise$1) {
          self._state = 3;
          self._value = newValue;
          finale(self);
          return;
        } else if (typeof then === 'function') {
          doResolve(bind(then, newValue), self);
          return;
        }
      }

      self._state = 1;
      self._value = newValue;
      finale(self);
    } catch (e) {
      reject(self, e);
    }
  }

  function reject(self, newValue) {
    self._state = 2;
    self._value = newValue;
    finale(self);
  }

  function finale(self) {
    if (self._state === 2 && self._deferreds.length === 0) {
      Promise$1._immediateFn(function () {
        if (!self._handled) {
          Promise$1._unhandledRejectionFn(self._value);
        }
      });
    }

    for (var i = 0, len = self._deferreds.length; i < len; i++) {
      handle(self, self._deferreds[i]);
    }

    self._deferreds = null;
  }
  /**
   * @constructor
   */


  function Handler(onFulfilled, onRejected, promise) {
    this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
    this.onRejected = typeof onRejected === 'function' ? onRejected : null;
    this.promise = promise;
  }
  /**
   * Take a potentially misbehaving resolver function and make sure
   * onFulfilled and onRejected are only called once.
   *
   * Makes no guarantees about asynchrony.
   */


  function doResolve(fn, self) {
    var done = false;

    try {
      fn(function (value) {
        if (done) return;
        done = true;
        resolve(self, value);
      }, function (reason) {
        if (done) return;
        done = true;
        reject(self, reason);
      });
    } catch (ex) {
      if (done) return;
      done = true;
      reject(self, ex);
    }
  }

  Promise$1.prototype['catch'] = function (onRejected) {
    return this.then(null, onRejected);
  };

  Promise$1.prototype.then = function (onFulfilled, onRejected) {
    // @ts-ignore
    var prom = new this.constructor(noop);
    handle(this, new Handler(onFulfilled, onRejected, prom));
    return prom;
  };

  Promise$1.prototype['finally'] = finallyConstructor;

  Promise$1.all = function (arr) {
    return new Promise$1(function (resolve, reject) {
      if (!isArray(arr)) {
        return reject(new TypeError('Promise.all accepts an array'));
      }

      var args = Array.prototype.slice.call(arr);
      if (args.length === 0) return resolve([]);
      var remaining = args.length;

      function res(i, val) {
        try {
          if (val && (_typeof(val) === 'object' || typeof val === 'function')) {
            var then = val.then;

            if (typeof then === 'function') {
              then.call(val, function (val) {
                res(i, val);
              }, reject);
              return;
            }
          }

          args[i] = val;

          if (--remaining === 0) {
            resolve(args);
          }
        } catch (ex) {
          reject(ex);
        }
      }

      for (var i = 0; i < args.length; i++) {
        res(i, args[i]);
      }
    });
  };

  Promise$1.allSettled = allSettled;

  Promise$1.resolve = function (value) {
    if (value && _typeof(value) === 'object' && value.constructor === Promise$1) {
      return value;
    }

    return new Promise$1(function (resolve) {
      resolve(value);
    });
  };

  Promise$1.reject = function (value) {
    return new Promise$1(function (resolve, reject) {
      reject(value);
    });
  };

  Promise$1.race = function (arr) {
    return new Promise$1(function (resolve, reject) {
      if (!isArray(arr)) {
        return reject(new TypeError('Promise.race accepts an array'));
      }

      for (var i = 0, len = arr.length; i < len; i++) {
        Promise$1.resolve(arr[i]).then(resolve, reject);
      }
    });
  }; // Use polyfill for setImmediate for performance gains


  Promise$1._immediateFn = // @ts-ignore
  typeof setImmediate === 'function' && function (fn) {
    // @ts-ignore
    setImmediate(fn);
  } || function (fn) {
    setTimeoutFunc(fn, 0);
  };

  Promise$1._unhandledRejectionFn = function _unhandledRejectionFn(err) {
    if (typeof console !== 'undefined' && console) {
      console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
    }
  };

  /** @suppress {undefinedVars} */

  var globalNS = function () {
    // the only reliable means to get the global object is
    // `Function('return this')()`
    // However, this causes CSP violations in Chrome apps.
    if (typeof self !== 'undefined') {
      return self;
    }

    if (typeof window !== 'undefined') {
      return window;
    }

    if (typeof global !== 'undefined') {
      return global;
    }

    throw new Error('unable to locate global object');
  }(); // Expose the polyfill if Promise is undefined or set to a
  // non-function value. The latter can be due to a named HTMLElement
  // being exposed by browsers for legacy reasons.
  // https://github.com/taylorhakes/promise-polyfill/issues/114


  if (typeof globalNS['Promise'] !== 'function') {
    globalNS['Promise'] = Promise$1;
  } else if (!globalNS.Promise.prototype['finally']) {
    globalNS.Promise.prototype['finally'] = finallyConstructor;
  } else if (!globalNS.Promise.allSettled) {
    globalNS.Promise.allSettled = allSettled;
  }

  var root = typeof self !== 'undefined' ? self : global;
  var constants = {
    reProtocolAndHost: /^(https?:)?\/\/.+?\//i,
    reComments: /\/\*[\s\S]*?\*\/|([^:"'=]|^)\/\/.*$/mg,
    reCjsRequireCalls: /[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g,
    reExtension: /\.(\w{2,4})$/i,
    reVersionNumber: /^\s*([*<>^~])?(\d+)\.(\d+)(\.\d+)?(\.\d+)?(\-[\w\d]*)?(\-default)?\s*$/,
    reVersionNumberInUrl: /\/(\d*\.\d+(.\d*)?(.\d*)?(\-[\w\d]*)?)\//,
    reToleranceCharacters: /^[\^~*]/,
    reVersionSplitters: /[.-]/,
    reUrlWithoutProtocolNorSpecialCharacters: /(https?:)|[\._\/:\?&=]/g,
    registryElementAttributeKeys: ['version', 'url', 'urls', 'name', 'sort', 'versions', 'type', 'factory', 'dependencies'],
    versionFormat: ['major', 'minor', 'patch', 'build', 'rc'],
    returnDefaultOnVersionStr: ['default', 'anonymous'],
    toleranceFormat: ['*', '^', '~']
  };

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


    if (!(defineArguments.dependencies instanceof Array)) defineArguments.dependencies = [];
    if (typeof defineArguments.factory === 'function') getDependenciesFromFactory(defineArguments); //expose defined module

    return defineArguments;
  } //convert relative urls (./ ../)


  function convertRelativeUrls(urls) {
    return urls.map(function (url) {
      if (url.charAt(0) === '.') {
        //relative url
        var currentScriptUrl = getCurrentScriptLocation();
        var absUrl = new URL(url, currentScriptUrl);
        return absUrl.href;
      } else {
        //none relative url
        return url;
      }
    });
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
    return new Promise(function (res) {
      return tag.confirmDefine = res;
    });
  };

  var confirmDefine = function confirmDefine(_ref) {
    var factory = _ref.factory,
        dependencies = _ref.dependencies;

    var currentTag = _getCurrentTag();

    if (typeof currentTag.confirmDefine === 'function' && _typeof(currentTag.versiontype) === 'object') {
      currentTag.versiontype.dependencies = dependencies;
      currentTag.confirmDefine(factory);
    }

    currentTag.confirmDefine = null;
  };

  var getCurrentVersion = function getCurrentVersion() {
    var currentTag = _getCurrentTag();

    return currentTag.version;
  };

  var _getCurrentTag = function _getCurrentTag() {
    if (document.currentScript) {
      return document.currentScript;
    } else {
      var scripts = document.head.getElementsByTagName('script');
      return scripts[scripts.length - 1];
    }
  };

  var cancelDefine = function cancelDefine(tag) {
    if (typeof tag.confirmDefine === 'function') tag.confirmDefine(tag);
  };

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
      value: //if the the argument is an array, iterate through all array-elements
      //if the array element is a string (= url or packagename) add
      function _splitArrayIntoSingleFiles(arr) {
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
          if (!url) url = packageName; //get the package filetype

          type = type || RegistryAttributes.guessType(packageName) || RegistryAttributes.guessType(url);
          var reCleanTypePrefixOnly = type ? new RegExp("^".concat(type, "!")) : '';
          var reCleanType = type ? new RegExp("^".concat(type, "!|\\.").concat(type, "$"), 'g') : ''; //try to get a versionnumber

          version = version || this._getVersionInfo(packageName, url);
          if (!(version instanceof VersionNumber)) version = new VersionNumber(version);
          var reCleanVersionNumber = new RegExp(this._getRegexpVersionString(version)); //clean package-name and url

          this.files.push({
            name: packageName.replace(reCleanVersionNumber, '').replace(reCleanType, '').replace(constants.reVersionNumberInUrl, '').replace(constants.reUrlWithoutProtocolNorSpecialCharacters, ''),
            url: url.replace(reCleanVersionNumber, '').replace(reCleanTypePrefixOnly, ''),
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
        var versionFromPackageName = RegistryAttributes.getVersionFromName(packageName);

        if (versionFromPackageName === null || versionFromPackageName === 'default') {
          var versionFromUrl = RegistryAttributes.getVersionFromUrl(url);

          if (versionFromPackageName === 'default') {
            return versionFromUrl ? "".concat(versionFromUrl, "-default") : 'default';
          } else {
            return versionFromUrl;
          }
        } else {
          return versionFromPackageName;
        }
      }
    }, {
      key: "_getRegexpVersionString",
      value: function _getRegexpVersionString(version) {
        return '@(' + version.str.replace(/\./g, '\\\.').replace('^', '\\\^').replace('*', '\\\*') + ')?(-?default)?$';
      } //guess the filetype from the name or url

    }], [{
      key: "guessType",
      value: function guessType(value) {
        if (value) {
          //remove version if present
          var indexOfAtSign = value.indexOf('@');
          if (indexOfAtSign > -1) value = value.substring(0, indexOfAtSign); //first check if the filetype is provided in the name (html!myHtmlFragment)

          var indexOfExclamation = value.indexOf('!');

          if (indexOfExclamation > -1) {
            return value.substr(0, indexOfExclamation);
          } else {
            //try to fetch a valid extension from the first urls
            var extension = constants.reExtension.exec(value);
            if (extension && extension.length === 2) return extension[1];
          }
        }
      }
    }, {
      key: "getVersionFromName",
      value: function getVersionFromName(packageName) {
        //check if the name contains an @-sign
        if (packageName) {
          var iOfAtSign = packageName.indexOf('@');
          return iOfAtSign > -1 ? packageName.substr(iOfAtSign + 1) : null;
        }
      }
    }, {
      key: "getVersionFromUrl",
      value: function getVersionFromUrl(url) {
        //check the version-number is present in the url
        if (url) {
          var version = url.match(constants.reVersionNumberInUrl);
          return version && version.length === 5 ? version[1] : null;
        }
      }
    }]);

    return RegistryAttributes;
  }();

  var _default$5 = /*#__PURE__*/function () {
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
        if (!options.url) options.url = '';

        if (options.url.indexOf('${') > -1) {
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
      }
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
      }
    }, {
      key: "_processFileType",
      value: function _processFileType(options) {
        options.type = options.type || RegistryAttributes.guessType(options.url) || 'js';
        if (!(_typeof(this.filetypes[options.type]) === 'object')) this.filetypes[options.type] = {
          urls: []
        };
        if (typeof options.factory !== 'undefined') this.filetypes[options.type].factory = options.factory;
        if (options.dependencies instanceof Array) this.filetypes[options.type].dependencies = options.dependencies;
        if (this.filetypes[options.type].urls.indexOf(options.url) === -1) this.filetypes[options.type].urls.push(options.url);
        return this.filetypes[options.type];
      }
    }, {
      key: "_getVersionStr",
      value: function _getVersionStr() {
        var _this = this;

        this.str = constants.versionFormat.map(function (fragmnt) {
          return fragmnt !== 'rc' && _this[fragmnt];
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

  var _default$4 = /*#__PURE__*/function () {
    function _default(options) {
      _classCallCheck(this, _default);

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
            if (version instanceof _default$5 && version.test(versionObj)) return version;
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

        if (!(target instanceof _default$5)) {
          target = new _default$5(options, this);
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

  var _default$3 = /*#__PURE__*/function () {
    function _default(options) {
      _classCallCheck(this, _default);

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
            if (!_this.packages[file.name]) {
              _this.packages[file.name] = new _default$4(file);
            }

            _this.packages[file.name].add(file);
          });
        }

        this.sort(); //sort the packages to be easily searchable

        return this; //make chainable
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

  var _default$2 = /*#__PURE__*/function () {
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
        return mdl.module || (mdl.module = {
          id: mdl.parent.name,
          version: mdl,
          uri: mdl.urls,
          exports: mdl.exports || (mdl.exports = {})
        });
      }
    }, {
      key: "exportsHandler",
      value: function exportsHandler(mdl) {
        return mdl.exports || (mdl.exports = {});
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
    return domparser.parseFromString(txtXml, 'application/xml');
  }

  function factoryRunner$2(factory) {
    return typeof factory === 'string' ? parseXml() : factory;
  }

  function load$2(url, version, versiontype) {
    return new Promise(function (resolve) {
      root.require("txt!".concat(url), function (txtXml) {
        return resolve(parseXml());
      });
    });
  }

  var xml = {
    factoryRunner: factoryRunner$2,
    load: load$2
  };

  function onScriptLoad(script, err, onWindowError) {
    window.removeEventListener('error', onWindowError);

    if (err) {
      throw err;
    }

    currentTagLoad.cancelDefine(script);
  }

  function js (url, version, versiontype) {
    var err;

    var onWindowError = function onWindowError(evt) {
      return evt.filename === url ? err = evt.error : null;
    };

    window.addEventListener('error', onWindowError);
    var script = document.createElement('script');
    script.charset = 'utf-8';
    script.async = true;
    script.addEventListener('error', function () {
      return onScriptLoad(script, "Error loading script: ".concat(url), onWindowError);
    });
    script.addEventListener('load', function () {
      return onScriptLoad(script, err, onWindowError);
    });
    script.src = url;
    script.version = version;
    script.versiontype = versiontype;
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

  var _default$1 = /*#__PURE__*/function () {
    function _default(requireContext) {
      _classCallCheck(this, _default);

      this.requireContext = requireContext;
      this.reservedDependencies = new _default$2();
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
          console.warn("Oh fudge, we did not find any package '".concat(attrs && attrs.name || '<unknown>', "' that matches version '").concat(attrs && attrs.version && attrs.version.str || '<unknown>', "'"));
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

        if (_typeof(versiontype) === 'object' && versiontype !== null) {
          if (typeof versiontype.exports !== 'undefined') {
            return versiontype.exports;
          } else if (versiontype.dfr instanceof Promise) {
            return versiontype.dfr;
          } else {
            return versiontype.dfr = new Promise(function (resolve) {
              if (versiontype.factory) {
                _this2._resolveFactoryDependencies(resolve, version, type);
              } else {
                _this2._loadFromUrl(version, type).then(function (factory) {
                  versiontype.factory = factory;

                  _this2._resolveFactoryDependencies(resolve, version, type);
                });
              }
            });
          }
        }
      }
    }, {
      key: "_resolveFactoryDependencies",
      value: function _resolveFactoryDependencies(resolve, version, type) {
        var _this3 = this;

        var versiontype = version.filetypes[type];
        var hasDependencies = versiontype.dependencies instanceof Array && versiontype.dependencies.length;
        var reservedDependencyNames = this.reservedDependencies.reservedDependencyNames;

        if (hasDependencies) {
          var loadingDependencies = versiontype.dependencies.map(function (dependency) {
            if (reservedDependencyNames.indexOf(dependency) > -1) {
              return _this3.reservedDependencies.get(dependency, versiontype);
            } else {
              return _this3.requireContext.getPromise(dependency);
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

        if (typeof versiontype.exports === 'undefined') versiontype.exports = factoryResult;
        resolve(versiontype.exports);
      }
    }, {
      key: "_loadFromUrl",
      value: function _loadFromUrl(version, type) {
        var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var loader = this.get(type);

        if (typeof loader === 'function') {
          var urls = version.filetypes[type].urls;

          if (index < urls.length) {
            try {
              return loader(urls[index], version, version.filetypes[type]);
            } catch (e) {
              return this._loadFromUrl(version, type, index + 1);
            }
          }
        }
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
    function _default() {
      _classCallCheck(this, _default);

      this.registry = new _default$3();
      this.amd = {};
      this.loaders = new _default$1(this);
    }

    _createClass(_default, [{
      key: "define",
      value: function define() {
        var _getDefinitionArgumen = getDefinitionArguments(arguments),
            name = _getDefinitionArgumen.name,
            dependencies = _getDefinitionArgumen.dependencies,
            factory = _getDefinitionArgumen.factory; //Carefull with jQuery: In general, explicitly naming modules in the define() call are discouraged, but jQuery has some special constraints.


        var isNamed = typeof name === 'string' && !(name === 'jquery' && typeof factory === 'undefined');

        if (isNamed) {
          var registryElement = {};
          registryElement[name] = {
            dependencies: dependencies,
            factory: factory
          };
          this.register(registryElement);
        } else {
          //if this is an anonymous define, confirm the currently loading script that loading is done...
          currentTagLoad.confirmDefine({
            dependencies: dependencies,
            factory: factory
          });
        }
      }
    }, {
      key: "get",
      value: function get() {
        var _this = this;

        //todo: build in fail callback logic
        var _getRequireArguments = getRequireArguments(arguments),
            dependencies = _getRequireArguments.dependencies,
            callback = _getRequireArguments.callback,
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
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        if (typeof options.paths !== 'undefined') transformRJSPaths(options.paths).forEach(this.register.bind(this));
      }
    }, {
      key: "specified",
      value: function specified(packageName) {
        if (typeof packageName === 'string') {
          var result = this.findOne(packageName);
          return result.match && result.match.isSpecified(result.attrs) || false;
        }

        return false;
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
