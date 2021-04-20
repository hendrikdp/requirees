import '../index.js';

describe('Does RequireEs attaches itself properly to the root', ()=>{

    test('Test if a package can be defined and required', async () => {
        global.define('myPackage', [], ()=>'foooo');
        let result = await global.require('myPackage');
        expect(result).toBe('foooo');
        result = await global.requirejs('myPackage');
        expect(result).toBe('foooo');
        result = await global.requirees('myPackage');
        expect(result).toBe('foooo');
    });

});