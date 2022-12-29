import RequireEs from '../RequireEs.js';

jest.mock('../loaders/js', () => url => Promise.resolve(url));
jest.mock('../loaders/css', () => url => Promise.resolve(url));
jest.mock('../loaders/json', () => url => Promise.resolve(url));
jest.mock('../loaders/txt', () => url => Promise.resolve(url));

describe('Test if path substitution', () => {

    let requirees;
    const pathSubstitution = {
        foobarzAbsolute: "https://www.foobarz.com/something/root",
        foobarzRelative: "/something/foobarz/root"
    }
    beforeEach(() => {
        requirees = new RequireEs();
        requirees.config({
            pathSubstitution
        });
    });
    
    test('Absolute path substitute JS files', async () => {
        const pathToSubstitute = 'foobarzAbsolute/js/something.js';
        const path = await requirees.get(pathToSubstitute);
        expect(path).toBe(pathToSubstitute.replace('foobarzAbsolute', pathSubstitution.foobarzAbsolute))
    });

    test('Absolute path substitute CSS files', async () => {
        const pathToSubstitute = 'foobarzAbsolute/js/something.css';
        const path = await requirees.get(pathToSubstitute);
        expect(path).toBe(pathToSubstitute.replace('foobarzAbsolute', pathSubstitution.foobarzAbsolute))
    });

    test('Absolute path substitute JSON files', async () => {
        const pathToSubstitute = 'foobarzAbsolute/js/something.json';
        const path = await requirees.get(pathToSubstitute);
        expect(path).toBe(pathToSubstitute.replace('foobarzAbsolute', pathSubstitution.foobarzAbsolute))
    });

    test('Absolute path substitute TEXT files', async () => {
        const pathToSubstitute = 'foobarzAbsolute/js/something.txt';
        const path = await requirees.get(pathToSubstitute);
        expect(path).toBe(pathToSubstitute.replace('foobarzAbsolute', pathSubstitution.foobarzAbsolute))
    });

    test('Relative path substitute JS files', async () => {
        const pathToSubstitute = 'foobarzRelative/js/something.js';
        const path = await requirees.get(pathToSubstitute);
        expect(path).toBe(pathToSubstitute.replace('foobarzRelative', pathSubstitution.foobarzRelative))
    });

    test('Relative path substitute, to respect the baseUrl', async () => {
        const baseUrl = 'https://www.adobemakeserrorsonamdpatterns.com';
        requirees.config({baseUrl});
        const pathToSubstitute = 'foobarzRelative/js/something.js';
        const path = await requirees.get(pathToSubstitute);
        expect(path).toBe(`${baseUrl}${pathSubstitution.foobarzRelative}/js/something.js`);
    });

})