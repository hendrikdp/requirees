import RequireEs from "../RequireEs";

jest.mock('../loaders/js', ()=>{
    return function(url){
        let returnValue;
        switch (url){
            case 'https://myfakeurl.com/0.2.0/foobarRegister.js':
                returnValue = {foo: "register", version: '0.2.0'}
                break;
            case 'https://myfakeurl.com/1.0.0/foobarRegister.js':
                returnValue = {foo: "register", version: '1.0.0'}
                break;
        }
        return Promise.resolve(returnValue);
    }
});

describe('Test RequireEs.when syntax', ()=>{

    let requirees;
    beforeEach(()=>{
        requirees = new RequireEs();
    });
    const registerFoobar020 = () => requirees.register({
        'foobarRegister': 'https://myfakeurl.com/0.2.0/foobarRegister.js',
    });
    const registerFoobar100 = () => requirees.register({
        'foobarRegister': 'https://myfakeurl.com/1.0.0/foobarRegister.js',
    });
    const defineFoobar = () => requirees.define('foobarDefine',
        () => ({foo: 'define'})
    );

    test('when - single package + define', async ()=>{
        setTimeout(defineFoobar, 500);
        const pckg = await requirees.when('foobarDefine');
        expect(pckg.foo).toBe('define');
    });

    test('when - single package + register', async ()=>{
        setTimeout(registerFoobar020, 500);
        const pckg = await requirees.when('foobarRegister');
        expect(pckg.foo).toBe('register');
    });

    test('when - multiple package in future', async ()=>{
        setTimeout(registerFoobar020, 500);
        setTimeout(defineFoobar, 1000);
        const pckgs = await requirees.when(['foobarRegister', 'foobarDefine']);
        expect(pckgs.length).toBe(2);
        expect(pckgs[0].foo).toBe('register');
        expect(pckgs[1].foo).toBe('define');
    });

    test('when - multiple package mixed future define / past register', async ()=>{
        registerFoobar020();
        setTimeout(defineFoobar, 500);
        const pckgs = await requirees.when(['foobarRegister', 'foobarDefine']);
        expect(pckgs.length).toBe(2);
        expect(pckgs[0].foo).toBe('register');
        expect(pckgs[1].foo).toBe('define');
    });

    test('when - multiple package mixed past define / future register', async ()=>{
        setTimeout(registerFoobar020, 500);
        defineFoobar();
        const pckgs = await requirees.when(['foobarRegister', 'foobarDefine']);
        expect(pckgs.length).toBe(2);
        expect(pckgs[0].foo).toBe('register');
        expect(pckgs[1].foo).toBe('define');
    });

    test('when - multiple package mixed past define / past register', async ()=>{
        registerFoobar020();
        defineFoobar();
        const pckgs = await requirees.when(['foobarRegister', 'foobarDefine']);
        expect(pckgs.length).toBe(2);
        expect(pckgs[0].foo).toBe('register');
        expect(pckgs[1].foo).toBe('define');
    });

    test('when - multiple package to respect versions', async ()=>{
        registerFoobar020();
        setTimeout(registerFoobar100, 500);
        defineFoobar();
        const pckgs = await requirees.when(['foobarRegister@^1.0.0', 'foobarDefine']);
        expect(pckgs.length).toBe(2);
        expect(pckgs[0].foo).toBe('register');
        expect(pckgs[0].version).toBe('1.0.0');
        expect(pckgs[1].foo).toBe('define');
    });

});