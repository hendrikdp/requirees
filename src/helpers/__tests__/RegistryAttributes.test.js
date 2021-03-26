import Attributes from '../RegistryAttributes.js';
import VersionNumber from '../VersionNumber.js';

describe('Registry Attributes', ()=>{

    const jqMock = {
        "url": "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/core.js",
        "version": new VersionNumber('3.4.1'),
        "type": 'js',
        "dependencies": undefined,
        "factory": undefined
    };
    const jqMock342rc3 = {
        "name": "myjquery",
        "url": "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/core.js",
        "version": new VersionNumber('3.4.2-rc3'),
        "type": "js",
        "dependencies": undefined,
        "factory": undefined
    };
    const jqMock3425 = {
        "name": "myjquery",
        "url": "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/core.js",
        "version": new VersionNumber('3.4.2.5'),
        "type": "js",
        "dependencies": undefined,
        "factory": undefined
    };

    test('Check if 1 url gets parsed the the correct object', ()=>{
        const {files} = new Attributes(['https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/core.js']);
        jqMock.name = 'cdnjscloudflarecomajaxlibsjquerycore';
        expect(files[0]).toEqual({...jqMock, type:'js'});
    });

    test('Check if name is picked up correctly', ()=>{
        const {files} = new Attributes([{'myjquery': 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/core.js'}]);
        jqMock.name = 'myjquery';
        expect(files[0]).toEqual(jqMock);
    });

    test('Check if multiple arguments get picked up', ()=>{
        const {files} = new Attributes([{'myjquery':'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/core.js'}]);
        jqMock.name = 'myjquery';
        expect(files[0]).toEqual(jqMock);
    });

    test('Check if multiple arguments get picked up and version can be overridden', ()=>{
        const {files} = new Attributes([{'myjquery': {url: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/core.js', version: '3.4.2-rc3'}}]);
        expect(files[0]).toEqual(jqMock342rc3);
    });

    test('Check if multiple arguments get picked up and version can be overridden (order should not matter)', ()=>{
        const {files} = new Attributes([{'myjquery': {version:'3.4.2-rc3', url:'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/core.js'}}]);
        expect(files[0]).toEqual(jqMock342rc3);
    });

    test('Check if parsed versions do not get touched', ()=>{
        const {files} = new Attributes([{'myjquery':{version: {major:3, minor:4, patch:2, build:5}, url: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/core.js'}}]);
        files[0].version._str = files[0].version.str;
        expect(files[0]).toMatchObject(jqMock3425);
    });

    test('Check if complex structures are properly interpreted', ()=>{
        const {files} = new Attributes([{
            'myjquery': {
                version: '3.4.2.5',
                url: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/core.js'
            }
        }]);
        expect(files[0]).toEqual(jqMock3425);
    });

    test('Check if version is picked up from the package name', ()=>{
        const {files} = new Attributes([{'myjquery@3.4.2.5':'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/core.js'}]);
        expect(files[0]).toEqual(jqMock3425);
    });

    test('Check if the first clear version number gets priority', ()=>{
        const {files} = new Attributes([{'myjquery@3.4.2.5':'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/core.js'}]);
        expect(files[0]).toEqual(jqMock3425);
    });

    test('Check if name is provided, take the url', ()=>{
        const {files} = new Attributes(['./myjquery.js@3.4.2.85']);
        expect(files[0]).toMatchObject({
            name: 'myjquery',
            type: 'js',
            url: './myjquery.js',
            version: new VersionNumber('3.4.2.85')
        });
    });

    test('Check if no url is provided, take the name', ()=>{
        const {files} = new Attributes(['myjquery.js@3.4.2.85']);
        expect(files[0]).toMatchObject({
            name: 'myjquery',
            type: 'js',
            url: 'myjquery.js',
            version: new VersionNumber('3.4.2.85')
        });
    });

    test('Check if null gets ignored', ()=>{
        const {files} = new Attributes([{'myjquery@3.4.2.5':'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/core.js'}]);
        expect(files[0]).toEqual(jqMock3425);
    });

    test('Check if nothing fails if there is no version defined', ()=>{
        const {files} = new Attributes(['https://cdnjs.cloudflare.com/ajax/libs/jquery/core.js']);
        expect(files[0]).toMatchObject({
            "url": "https://cdnjs.cloudflare.com/ajax/libs/jquery/core.js",
            "name": "cdnjscloudflarecomajaxlibsjquerycore",
            "type": "js"
        });
    });

    test('Check if tolerance is calculated', ()=>{
        const {files} = new Attributes(['myjquery.js@^3.4.2.85']);
        expect(files[0]).toMatchObject({
            name: 'myjquery',
            type: 'js',
            url: 'myjquery.js',
            version: new VersionNumber('^3.4.2.85')
        })
    });

    test('Check if incorrect versions are not interpreted', ()=>{
        const {files} = new Attributes(['myjquery.js@^yeeeezzz']);
        expect(files[0]).toMatchObject({
            name: 'myjquery',
            type: 'js',
            url: 'myjquery.js',
            version: new VersionNumber('^yeeeezzz')
        });
    });


    test('Check if only major.minor gets interpreted', ()=>{
        const {files} = new Attributes(['myjquery.js@~3.4']);
        expect(files[0]).toMatchObject({
            name: 'myjquery',
            type: 'js',
            url: 'myjquery.js',
            version: {
                tolerance: '~',
                major: 3,
                minor: 4,
                str: '~3.4'
            }
        });
    });

});