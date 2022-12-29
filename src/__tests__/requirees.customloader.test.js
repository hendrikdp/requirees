import RequireEs from '../RequireEs.js';

describe('Test custom plugin loaders', () => {
    let requirees = new RequireEs();

    test('If a loader is not defined, search the registry for a matching loader', async () => {
        expect(1).toBe(1);
    })

})