import RequireEs from '../RequireEs.js';

describe('Registry handling - Redefine existing packages', ()=>{

    let requirees;
    let factory1;
    let factory2;

    beforeEach(()=>{
        requirees = new RequireEs();
        factory1 = ()=>{return {instance: 'factory1'}};
        factory2 = ()=>{return {instance: 'factory2'}};
    });


    test('Do not allow re-defines on packages which are already specified', async () => {
        requirees.define('pckg1', [], factory1);
        await requirees.get('pckg1');
        requirees.define('pckg1', [], factory2);
        const result = await requirees.get('pckg1');
        expect(result.instance).toBe('factory1');
    });

    test('Allow redefines if the factory has not ran yet', async () => {
        requirees.define('pckg1', [], factory1);
        requirees.define('pckg1', [], factory2);
        const result = await requirees.get('pckg1');
        expect(result.instance).toBe('factory2');
    });

    test('Allow re-defines on packages which are already specified, when specifically specified', async () => {
        requirees.define('pckg1', [], factory1);
        await requirees.get('pckg1');
        requirees.config({allowRedefine: true});
        requirees.define('pckg1', [], factory2);
        const result = await requirees.get('pckg1');
        expect(result.instance).toBe('factory2');
    });

});

describe('Test factory runs + get + specified functions', ()=>{

    let requirees;
    let factoryJs = () => ({'foo': 'bar'});
    let factoryCss = 'body{background-color:red;}';
    let factoryTxt = 'Hello world';
    let factoryHtml = '<h1>hello world!</h1>';
    let factoryJson = '{"foo": "bar"}';
    let facotryXml = '<bla>hello</bla>';
    beforeEach(()=>{
        requirees = new RequireEs();
    });

    test('Test JS factory run', async () => {
        requirees.define('mylib', [], factoryJs);
        expect(requirees.specified('mylib')).toBe(false);
        const result = await requirees.get('mylib');
        expect(result).toMatchObject({'foo': 'bar'});
        expect(requirees.specified('mylib')).toBe(true);
    });

    test('Test JS factory with getPromise fn', async () => {
        requirees.define('mylib', [], factoryJs);
        let result = await requirees.getPromise('mylib');
        result = requirees.getPromise('mylib');
        expect(result instanceof Promise).toBe(true);
    });

    test('Test JS factory with callback', async () => {
        requirees.define('mylib', [], factoryJs);
        requirees.getPromise('mylib', result => {
            expect(result instanceof Promise).toBe(true);
        });
    });

    test('Test JS factory does return instance directly (on the second load)', async () => {
        requirees.define('mylib', [], factoryJs);
        let result = await requirees.get('mylib');
        result = requirees.get('mylib');
        expect(result instanceof Promise).toBe(false);
    });

    test('Test wrong input parameters to specified to return false', async () =>{
        expect(requirees.specified(['hello'])).toBe(false);
    });

    /*
    test('Test Anonymous factory, no execution', async ()=>{
        requirees.define([], ()=>{global.foo='bar'});
        expect(global.bar).toBeUndefined();
    });
    */

    /*
    test('Test Anonymous factory, auto execute', async ()=>{
        requirees.config({invokeNonMatchedDefines: true});
        await requirees.get('https://cdnjs.cloudflare.com/ajax/libs/react/17.0.2/umd/react.production.min.js');
        const reg = requirees.register();
        expect(global.bar).toBe('bar');
    });
    */

    test('Test HTML factory run + check if the package is specified', async () => {
        requirees.define('mylib.html', [], factoryHtml);
        expect(requirees.specified('mylib.html')).toBe(false);
        const result = await requirees.get('mylib.html');
        expect(result instanceof HTMLElement).toBe(true);
        expect(requirees.specified('mylib.html')).toBe(true);
    });

    test('Test CSS factory run', async () => {
        requirees.define('mylib.css', [], factoryCss);
        const result = await requirees.get('mylib.css');
        expect(result instanceof HTMLStyleElement).toBe(true);
        expect(result.innerText).toBe(factoryCss);
    });

    test('Test XML factory run', async () => {
        requirees.define('mylib.xml', [], facotryXml);
        const result = await requirees.get('mylib.xml');
        expect(result.contentType).toBe('application/xml');
    });

    test('Test TXT factory run', async () => {
        requirees.define('mylib.txt', [], factoryTxt);
        const result = await requirees.get('mylib.txt');
        expect(result).toBe('Hello world');
    });

    test('Test JSON factory run', async () => {
        requirees.define('mylib.json', [], factoryJson);
        const result = await requirees.get('mylib.json');
        expect(result).toMatchObject({'foo': 'bar'});
    });


});

describe('Test CJS loading (if no dependencies are provided, search them as cjs dependencies)', ()=>{

    let requirees;
    let factoryWithDependency = () => {const test = require('cjsDependency');};
    beforeEach(()=>{
        requirees = new RequireEs();
    });

    test('If dependencies are provided, modules required in the factory should be ignored', ()=>{
        requirees.define('mylib', ['mdl'], factoryWithDependency);
        const result = requirees.find('mylib');
        expect(result.matches[0].filetypes.js.dependencies).toEqual(['mdl']);
    });

    test('If dependencies are not provided, modules required in the factory should get scanned', ()=>{
        requirees.define('mylib2', factoryWithDependency);
        const result = requirees.find('mylib2');
        expect(result.matches[0].filetypes.js.dependencies).toEqual(['cjsDependency']);
    });

});

describe('Test scoped packages registration, and @-signs in urls', ()=>{

    let requirees;
    beforeEach(()=>{
        requirees = new RequireEs();
    });

    test('Only respect @version-number to identify the version, ignore package scope', ()=>{
        requirees.register({'@myscope/mypackage@4.5.2-rc1': 'https://www.tired.com/@4.5.2-rc1/foo.js'});
        expect(requirees.register().toJson()).toMatchSnapshot();
    });

    test('Ignore package scope... Its not a version number', ()=>{
        requirees.register({'@myscope/mypackage': 'https://www.tired.com/@4.5.2-rc1/foo.js'});
        expect(requirees.register().toJson()).toMatchSnapshot();
    });

    test('No version number provided, dont touch the scope', ()=>{
        requirees.register({'@myscope/mypackage': 'https://www.tired.com/foo.js'});
        expect(requirees.register().toJson()).toMatchSnapshot();
    });


    test('No scope, nor version number, leave the @signs where they are', ()=>{
        requirees.register({'mypackage': 'https://www.tired.com/@duffman/foo.js'});
        expect(requirees.register().toJson()).toMatchSnapshot();
    });

    test('No versionnumber is allowed when converting the url to a package-name', ()=>{
        requirees.register('https://www.tired.com/@duffman/@4.20/foo.js');
        expect(requirees.register().toJson()).toMatchSnapshot();
    });

    test('Do interpret default as version indication', ()=>{
        requirees.register({'foo@default': 'https://foo.bar@4.5.2/foo.js'});
        expect(requirees.register().toJson()).toMatchSnapshot();
    })

});

describe('Test reserved dependency handlers', ()=>{

    let requirees;
    beforeEach(()=>{
        requirees = new RequireEs();
    });

    test('Module - dependency', async ()=>{
        requirees.define('mylib', ['mdl'], module => {
            module.exports = {foo: 'bar'};
        });
        const result = await requirees.get('mylib');
        expect(result).toMatchObject({foo: 'bar'});
    });

    test('Exports - dependency', async ()=>{
        requirees.define('mylib', ['exports'], exports => {
            exports.foo = 'bar';
        });
        const result = await requirees.get('mylib');
        expect(result).toMatchObject({foo: 'bar'});
    });

    test('Exports - dependency', async ()=>{
        requirees.define('mylib', ['exports'], exports => {
            exports.foo = 'bar';
        });
        const result = await requirees.get('mylib');
        expect(result).toMatchObject({foo: 'bar'});
    });

    //todo: test require / requirees

});

describe('Test RequireJs syntax', ()=>{

    let requirees;
    beforeEach(()=>{
        requirees = new RequireEs();
    });

    test('Check if RequireJs paths syntax is properly working', async ()=>{
        requirees.config({
            paths: {
                react: 'https://cdnjs.cloudflare.com/ajax/libs/react/17.0.2/umd/react.production.min'
            }
        });
        const result = requirees.find('react@17.0.2');
        expect(result.matches[0].filetypes.js.urls[0])
            .toBe('https://cdnjs.cloudflare.com/ajax/libs/react/17.0.2/umd/react.production.min.js');
    });

    test('Check if RequireJs paths works with multiple urls', async ()=>{
        requirees.config({
            paths: {
                'react': [
                    'https://cdnjs.cloudflare.com/ajax/libs/react/17.0.2/umd/react.production.min',
                    'https://anyotherhost.com/ajax/libs/react/17.0.2/react.production.min'
                ]
            }
        });
        const result = requirees.find('react@17.0.2');
        expect(result.matches[0].filetypes.js.urls.length).toBe(2);
    });

    test('Check if RequireJs paths gets ignored with wrong input', async ()=>{
        requirees.config({
            paths: "just ignore me"
        });
        const result = requirees.register().toJson();
        expect(result).toMatchObject({});
    });

    test('Check if RequireJs paths get ignored if the url is in the wrong format', async ()=>{
        requirees.config({
            paths: {myLib: {foo: 'bar'}}
        });
        const result = requirees.register().toJson();
        expect(result).toMatchObject({});
    });

    test('Check if RequireJs paths do not get corrected if there is a .js extension present', async ()=>{
        requirees.config({
            paths: {mylib: 'https://blabla.com/myLib.js?bla'}
        });
        const result = requirees.find('mylib');
        expect(result.matches[0].filetypes.js.urls[0])
            .toBe('https://blabla.com/myLib.js?bla');
    });

});

describe('Test RequireJs registrations + registration while getting', ()=>{

    let requirees;
    beforeEach(()=>{
        requirees = new RequireEs().asFunction(false);
    });

    test('Registrations, single registration', ()=>{
        requirees.register({
            react: 'https://cdnjs.cloudflare.com/ajax/libs/react/17.0.2/umd/react.production.min'
        });
        const react = requirees.register().toJson().react;
        expect(react.length).toBe(1);
    });

    test('Registrations, multiple packages', ()=>{
        requirees.register({
            react: [
                'https://cdnjs.cloudflare.com/ajax/libs/react/17.0.2/umd/react.production.min',
                'https://cdnjs.cloudflare.com/ajax/libs/react/16.14.0/umd/react.production.min.js'
            ]
        });
        const react = requirees.register().toJson().react;
        expect(react.length).toBe(2);
    });

    test('Automatic registration while getting package', async ()=>{
        requirees('https://cdnjs.cloudflare.com/ajax/libs/react/16.14.0/umd/react.production.min.js');
        expect(requirees.register().toJson()).toMatchSnapshot();
    });

});

describe('Test shim functionality', ()=>{

    let requirees;
    beforeEach(()=>{
        requirees = new RequireEs().asFunction(false);
    });

   test('check if shims are registered on unknown packages', ()=>{
       requirees.shim({
           myPackage: {
               deps: ['dep1', 'dep2'],
               exports: 'MyGlobalName'
           }
       });
       const result = requirees.findOne('myPackage.js');
       expect(result.match.filetypes.js.dependenciesPreLoad.length).toBe(2);
       expect(result.match.filetypes).toMatchSnapshot();
   });

    test('check if dependencies an be added to different filetypes', ()=>{
        requirees.shim({
            'myPackage.css': {
                deps: ['dep1'],
                exports: 'MyGlobalName'
            }
        });
        const result = requirees.findOne('myPackage.js');
        expect(result.match.filetypes.css.dependenciesPreLoad.length).toBe(1);
        expect(result.match.filetypes.css).toMatchSnapshot();
    });

    test('check if wrong shim types are ignored', ()=>{
        requirees.shim({
            'myPackage': {
                deps: [{foo: 'bar'}],
                exports: {}
            }
        });
        const result = requirees.findOne('myPackage.js');
        expect(result.match.filetypes.js.postFactory).toBeUndefined();
        expect(result.match.filetypes.js.dependenciesPreLoad.length).toBe(0);
    });

    test('check if shim exports can be a function', ()=>{
        requirees.shim({
            'myPackage': {exports: ()=>{}}
        });
        const result = requirees.findOne('myPackage.js');
        expect(result.match.filetypes.js).toMatchSnapshot();
    });

    test('check if shim exports execution is triggered (and overrides the exports)', async ()=>{
        requirees.define('myPackage', [], ()=>{});
        const shimExportsFn = ()=>{
            return 'fooo'
        };
        requirees.shim({
            'myPackage': {exports: shimExportsFn}
        });
        const result = await requirees('myPackage');
        expect(result).toBe('fooo');
    });

});

describe('Test baseUrl', ()=>{
    let requirees;
    beforeEach(()=>{
        requirees = new RequireEs().asFunction(false);
    });

    test('Check if absolute baseUrls are respected', ()=>{
        requirees.config({
            baseUrl: 'https://foo.bar/level1/level2/level3/'
        });
        expect(requirees.register().parent.options.baseUrl)
            .toBe('https://foo.bar/level1/level2/level3/');
    });

    test('Check if relative baseUrls are respected', ()=>{
        requirees.config({
            baseUrl: './basePath/'
        });
        expect(requirees.register().parent.options.baseUrl)
            .toBe('http://localhost/basePath/');
    })
});

describe('Test undef of packages', ()=>{

    let requirees;
    beforeEach(()=>{
        requirees = new RequireEs();
        requirees.define('foobarDefine', () => ({
            foo: 'define',
            version: '0.0.0'
        }))
    });

    test('Undefine a package', async ()=>{
        const fooDefine = await requirees.get('foobarDefine');
        expect(fooDefine.foo).toBe('define');
        requirees.undef('foobarDefine')
        const findFooDefine = await requirees.findOne('foobarDefine');
        expect(findFooDefine.match.filetypes).toEqual({});
    });

});