import RequireEs from '../RequireEs.js';

describe('Registry handling - redefine existing packages', ()=>{

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