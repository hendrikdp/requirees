import VersionNumber from '../VersionNumber.js';

describe('VersionNumber - parsing from a string', () => {

    test('parses major.minor', () => {
        const v = new VersionNumber('1.2');
        expect(v.major).toBe(1);
        expect(v.minor).toBe(2);
        expect(v.patch).toBeUndefined();
        expect(v.str).toBe('1.2');
    });

    test('parses major.minor.patch', () => {
        const v = new VersionNumber('1.2.3');
        expect(v.major).toBe(1);
        expect(v.minor).toBe(2);
        expect(v.patch).toBe(3);
        expect(v.str).toBe('1.2.3');
    });

    test('parses major.minor.patch.build', () => {
        const v = new VersionNumber('1.2.3.4');
        expect(v.patch).toBe(3);
        expect(v.build).toBe(4);
    });

    test('parses a numeric release-candidate as a number', () => {
        const v = new VersionNumber('1.2.3-5');
        expect(v.rc).toBe(5);
    });

    test('parses a non-numeric release-candidate as a string', () => {
        const v = new VersionNumber('1.2.3-beta');
        expect(v.rc).toBe('beta');
    });

    test('captures a tolerance character', () => {
        const v = new VersionNumber('^1.2.3');
        expect(v.tolerance).toBe('^');
        expect(v.major).toBe(1);
        expect(v.str).toBe('^1.2.3');
    });

    test('the "*" wildcard sets tolerance and keeps its string', () => {
        const v = new VersionNumber('*');
        expect(v.tolerance).toBe('*');
        expect(v.major).toBeUndefined();
        expect(v.str).toBe('*');
    });

    test('a -default suffix flags the version and is stripped from the string', () => {
        const v = new VersionNumber('1.2.3-default');
        expect(v.default).toBe(true);
        expect(v.str).toBe('1.2.3');
    });

    test('a plain version is not a default', () => {
        expect(new VersionNumber('1.2.3').default).toBe(false);
    });
});

describe('VersionNumber - constructing from an object', () => {

    test('copies the known fields', () => {
        const v = new VersionNumber({major: 1, minor: 2, patch: 3, tolerance: '~'});
        expect(v.major).toBe(1);
        expect(v.minor).toBe(2);
        expect(v.patch).toBe(3);
        expect(v.tolerance).toBe('~');
    });

    test('null is ignored (no fields set)', () => {
        const v = new VersionNumber(null);
        expect(v.major).toBeUndefined();
        expect(v.str).toBe('anonymous');
    });
});

describe('VersionNumber - the str getter (rebuilt when no _str is present)', () => {

    test('major.minor', () => {
        expect(new VersionNumber({major: 1, minor: 2}).str).toBe('1.2');
    });

    test('includes patch, build and rc', () => {
        expect(new VersionNumber({major: 1, minor: 2, patch: 3, build: 4, rc: 5}).str).toBe('1.2.3.4-5');
    });

    test('prefixes the tolerance', () => {
        expect(new VersionNumber({major: 1, minor: 2, patch: 3, tolerance: '^'}).str).toBe('^1.2.3');
    });

    test('returns "anonymous" when there is no version at all', () => {
        expect(new VersionNumber({}).str).toBe('anonymous');
    });
});

describe('VersionNumber.toNumber', () => {

    test('casts numeric strings to numbers', () => {
        expect(VersionNumber.toNumber('5')).toBe(5);
    });

    test('leaves non-numeric strings untouched', () => {
        expect(VersionNumber.toNumber('beta')).toBe('beta');
    });
});
