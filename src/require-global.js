const root = typeof self !== 'undefined' ? self : global;
const constants = {
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
    returnDefaultOnVersionStr: ['default','anonymous'],
    toleranceFormat: ['*','^','~'],
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

export {root, constants};
