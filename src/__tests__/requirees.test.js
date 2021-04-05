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

describe('Test factory runs', ()=>{

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
        const result = await requirees.get('mylib');
        expect(result).toMatchObject({'foo': 'bar'});
    });

    test('Test HTML factory run', async () => {
        requirees.define('mylib.html', [], factoryHtml);
        const result = await requirees.get('mylib.html');
        expect(result instanceof HTMLElement).toBe(true);
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
});