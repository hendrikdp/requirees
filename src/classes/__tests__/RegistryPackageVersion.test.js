import RegistryPackageVersion from '../RegistryPackageVersion.js';

const makeVersion = (str = '1.2.3') => new RegistryPackageVersion(
    {version: {major: 1, minor: 2, patch: 3, str}},
    {name: 'mypackage'}
);

describe('RegistryPackageVersion._resolveUrlPlaceholders', () => {

    test('substitutes $version with the version string', () => {
        const v = makeVersion('1.2.3');
        expect(v._resolveUrlPlaceholders('https://cdn/pkg/$version/pkg.js'))
            .toBe('https://cdn/pkg/1.2.3/pkg.js');
    });

    test('substitutes individual $obj.<part> tokens', () => {
        const v = makeVersion();
        expect(v._resolveUrlPlaceholders('https://cdn/$obj.major/$obj.minor/$obj.patch/pkg.js'))
            .toBe('https://cdn/1/2/3/pkg.js');
    });

    test('keeps a literal ${...} verbatim (never evaluated)', () => {
        const v = makeVersion();
        const url = 'https://cdn/${window.alert(1)}/pkg.js';
        expect(v._resolveUrlPlaceholders(url)).toBe(url);
    });

    test('leaves an unrelated $ untouched', () => {
        const v = makeVersion();
        expect(v._resolveUrlPlaceholders('https://cdn/a$5/pkg.js')).toBe('https://cdn/a$5/pkg.js');
    });

    test('throws on an unknown $obj property', () => {
        const v = makeVersion();
        expect(() => v._resolveUrlPlaceholders('https://cdn/$obj.nope/pkg.js')).toThrow();
    });

    test('throws when a placeholder resolves to a non-primitive', () => {
        const v = makeVersion();
        // $obj.parent exists but is an object, not a url-safe primitive
        expect(() => v._resolveUrlPlaceholders('https://cdn/$obj.parent/pkg.js')).toThrow();
    });

    test('does not resolve prototype members', () => {
        const v = makeVersion();
        // toJson is on the prototype, not an own property -> treated as unknown
        expect(() => v._resolveUrlPlaceholders('https://cdn/$obj.toJson/pkg.js')).toThrow();
    });
});

describe('RegistryPackageVersion.addFileType', () => {

    test('creates a filetype with the resolved url', () => {
        const v = makeVersion('1.2.3');
        const file = v.addFileType({url: 'https://cdn/pkg/$version/pkg.js'});
        expect(file.urls[0]).toBe('https://cdn/pkg/1.2.3/pkg.js');
    });

    test('falls back to the first entry of urls when url is absent', () => {
        const v = makeVersion('1.2.3');
        const file = v.addFileType({urls: ['https://cdn/pkg/$version/pkg.js']});
        expect(file.urls[0]).toBe('https://cdn/pkg/1.2.3/pkg.js');
    });

    test('a bad placeholder is swallowed and creates no filetype', () => {
        const v = makeVersion();
        const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
        const file = v.addFileType({url: 'https://cdn/$obj.nope/pkg.js'});
        expect(file).toBeUndefined();
        expect(v.filetypes.js).toBeUndefined();
        expect(warn).toHaveBeenCalled();
        warn.mockRestore();
    });

    test('a url without any $ is processed unchanged', () => {
        const v = makeVersion();
        const file = v.addFileType({url: 'https://cdn/pkg/1.2.3/pkg.js'});
        expect(file.urls[0]).toBe('https://cdn/pkg/1.2.3/pkg.js');
    });
});
