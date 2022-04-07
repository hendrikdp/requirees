import Registry from '../Registry';


const expectedResultReact1553 = {
    "react": [
        {"filetypes": {"js": {urls :["https://cdnjs.cloudflare.com/ajax/libs/react/15.5.3/react.min.js"]}}, "major": 15, "minor": 5, "patch": 3,"str": "15.5.3"}
    ]
};
const expectedResultReact1553Rc = {
    "react": [
        {"filetypes": {"js": {urls: ["https://cdnjs.cloudflare.com/ajax/libs/react/15.5.3/react.min.js"]}}, "major": 15, "minor": 5, "patch": 3, "rc": "rc0", "str": "15.5.3-rc0"}
    ]
};
const expectedResultReact1553MultipleSources = {
    "react": [
        {"filetypes": {"js":{urls: ["https://cdnjs.cloudflare.com/ajax/libs/react/react.min.js"]}}, "str": "anonymous"},
        {"filetypes": {"js":{urls: ["https://a.com/ajax/libs/react/15.5.3/react.min.js"]}}, "major": 15, "minor": 5, "patch": 3, "str": "15.5.3"}
    ]
};

describe('Registry handling - when version number is specifically added', ()=>{

    const argumentsToAddReact0 = {'react': {url:'https://cdnjs.cloudflare.com/ajax/libs/react/15.5.3/react.min.js', version: {major:15, minor:5, patch:3}}};
    const argumentsToAddReact1 = {'react': {url:'https://cdnjs.cloudflare.com/ajax/libs/react/15.5.3/react.min.js', version: '15.5.3-rc0'}};


    test('Add registry record', ()=>{
        const reg = new Registry();
        reg.add(argumentsToAddReact0);
        expect(reg.toJson()).toEqual(expectedResultReact1553);
    });

    test('Add registry record and convert versionnumber', ()=>{
        const reg = new Registry();
        reg.add(argumentsToAddReact1);
        expect(reg.toJson()).toEqual(expectedResultReact1553Rc);
    })

});

describe('Registry handling - when no version number is provided', ()=>{
    const argumentsToAddReact2 = {'react': 'https://cdnjs.cloudflare.com/ajax/libs/react/15.5.3/react.min.js'};
    const argumentsToAddReact3 = {'react@15.5.3-rc0': 'https://cdnjs.cloudflare.com/ajax/libs/react/15.5.3/react.min.js'};
    const argumentsToAddReact4 = {'react': ['https://cdnjs.cloudflare.com/ajax/libs/react/react.min.js','https://a.com/ajax/libs/react/15.5.3/react.min.js']};
    const argumentsToAddReact5 = {'react': {urls: ['https://cdnjs.cloudflare.com/ajax/libs/react/react.min.js','https://a.com/ajax/libs/react/15.5.3/react.min.js']}};

    test('Auto detect version number in url', ()=>{
        const reg = new Registry();
        reg.add(argumentsToAddReact2);
        expect(reg.toJson()).toEqual(expectedResultReact1553);
    });

    test('Auto detect version number in title', ()=>{
        const reg = new Registry();
        reg.add(argumentsToAddReact3);
        expect(reg.toJson()).toEqual(expectedResultReact1553Rc);
    });

    test('Process if the package attributes sit in an array', ()=>{
        const reg = new Registry();
        reg.add([{'react': 'https://cdnjs.cloudflare.com/ajax/libs/react/15.5.3/react.min.js'}]);
        expect(reg.toJson()).toEqual(expectedResultReact1553);
    });
    /*
    test('Process multiple sources for 1 package', ()=>{
        const reg = new Registry();
        reg.add(argumentsToAddReact4);
        expect(reg.toJson()).toEqual(expectedResultReact1553MultipleSources);
    });

    test('Process multiple urls as url-attribute', ()=>{
        const reg = new Registry();
        reg.add(argumentsToAddReact5);
        expect(reg.toJson()).toEqual(expectedResultReact1553MultipleSources);
    });
    */
});

describe('Registry handling - Add multiple packages', ()=>{

    const multipleReactVersions = {"react": [
        {
            "filetypes": {"js": {urls: [
                "https://cdnjs.cloudflare.com/ajax/libs/react/15.5.6/react.min.js"
            ]}},
            "major": 15,
            "minor": 5,
            "str": "15.5.6",
            "patch": 6
        },
        {
            "filetypes": {"js": {urls: [
                "https://cdnjs.cloudflare.com/ajax/libs/react/15.5.3/react.min.js"
            ]}},
            "major": 15,
            "minor": 5,
            "str": "15.5.3",
            "patch": 3
        },
        {
            "filetypes": {"js": {urls: [
                "https://cdnjs.cloudflare.com/ajax/libs/react/14.8.3/react.min.js"
            ]}},
            "major": 14,
            "minor": 8,
            "str": "14.8.3",
            "patch": 3
        },
        {
            "filetypes": {"js": {urls: [
                "https://cdnjs.cloudflare.com/ajax/libs/react/12.5.6/react.min.js"
            ]}},
            "major": 12,
            "minor": 5,
            "str": "12.5.6",
            "patch": 6
        }
    ]};
    const multipleReactVersionsMultiUrl = {
        "react": [
            {
                "filetypes": {"js": {urls: [
                    "https://alt.com/15/5/6/react.min.js",
                    "https://cdnjs.cloudflare.com/ajax/libs/react/15.5.6/react.min.js"
                ]}},
                "major": 15,
                "minor": 5,
                "str": "15.5.6",
                "patch": 6
            },
            {
                "filetypes": {"js": {urls:[
                    "https://alt.com/15/5/3/react.min.js",
                    "https://cdnjs.cloudflare.com/ajax/libs/react/15.5.3/react.min.js"
                ]}},
                "major": 15,
                "minor": 5,
                "str": "15.5.3",
                "patch": 3
            },
            {
                "filetypes": {"js": {urls: [
                    "https://alt.com/14/8/3/react.min.js",
                    "https://cdnjs.cloudflare.com/ajax/libs/react/14.8.3/react.min.js",
                ]}},
                "major": 14,
                "minor": 8,
                "str": "14.8.3",
                "patch": 3
            },
            {
                "filetypes": {"js": {urls: [
                    "https://alt.com/12/5/6/react.min.js",
                    "https://cdnjs.cloudflare.com/ajax/libs/react/12.5.6/react.min.js",
                ]}},
                "major": 12,
                "minor": 5,
                "str": "12.5.6",
                "patch": 6
            }
        ]
    };
    const resultReactAndLodashMixed = {
        "react": [
            {
                "filetypes": {"js": {urls: [
                    "https://cdnjs.cloudflare.com/ajax/libs/react/15.5.6/react.min.js"
                ]}},
                "major": 15,
                "minor": 5,
                "str": "15.5.6",
                "patch": 6
            },
            {
                "filetypes": {"js": {urls: [
                    "https://cdnjs.cloudflare.com/ajax/libs/react/14.8.3/react.min.js"
                ]}},
                "major": 14,
                "minor": 8,
                "str": "14.8.3",
                "patch": 3
            }
        ],
        "lodash": [
            {
                "filetypes": {"js": {urls: [
                    "https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.15/lodash.min.js"
                ]}},
                "major": 4,
                "minor": 17,
                "str": "4.17.15",
                "patch": 15
            },
            {
                "filetypes": {"js": {urls: [
                    "https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.2/lodash.min.js"
                ]}},
                "major": 4,
                "minor": 17,
                "str": "4.17.2",
                "patch": 2
            },
            {
                "filetypes": {"js": {urls: [
                    "https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.16.0/lodash.min.js"
                ]}},
                "major": 4,
                "minor": 16,
                "str": "4.16.0",
                "patch": 0
            }
        ]
    };
    const resultMultipleFileTypes = {
        "myproject": [
            {
                "filetypes": {
                    "js": {urls: [
                        "https://myserver.com/2.1.0/myproject.min.js"
                    ]},
                    "css": {urls: [
                        "https://myserver.com/2.1.0/myproject.min.css"
                    ]},
                    "html": {urls: [
                        "https://myserver.com/2.1.0/myproject.html"
                    ]}
                },
                "major": 2,
                "minor": 1,
                "str": "2.1.0",
                "patch": 0
            },
            {
                "filetypes": {
                    "js": {urls: [
                        "https://myserver.com/1.10.6/myproject.min.js"
                    ]},
                    "css": {urls: [
                        "https://myserver.com/1.10.6/myproject.min.css"
                    ]},
                    "html": {urls: [
                        "https://myserver.com/1.10.6/myproject.html"
                    ]}
                },
                "major": 1,
                "minor": 10,
                "str": "1.10.6",
                "patch": 6
            },
            {
                "filetypes": {
                    "js": {urls: [
                        "https://myserver.com/1.10.5/myproject.min.js"
                    ]},
                    "css": {urls: [
                        "https://myserver.com/1.10.5/myproject.min.css"
                    ]},
                    "html": {urls: [
                        "https://myserver.com/1.10.5/myproject.html"
                    ]},
                    "wasm": {urls: [
                        "https://myserver.com/1.10.5/mywasm.min.js"
                    ]}
                },
                "major": 1,
                "minor": 10,
                "str": "1.10.5",
                "patch": 5
            }
        ]
    };

   test('Process splitup to multiple versions', ()=>{
       const splitVersions =  {react: {versions: ['15.5.6', '12.5.6', '15.5.3', '14.8.3'], url:'https://cdnjs.cloudflare.com/ajax/libs/react/${version}/react.min.js'}};
       const reg = new Registry();
       const results = reg.add(splitVersions).toJson();
       expect(results).toEqual(multipleReactVersions);
   });

    test('Process splitup to multiple versions, with multiple sources', ()=>{
        const splitVersions =  {react: {versions: ['15.5.6', '12.5.6', '15.5.3', '14.8.3'], urls:['https://cdnjs.cloudflare.com/ajax/libs/react/${version}/react.min.js','https://alt.com/${obj.major}/${obj.minor}/${obj.patch}/react.min.js']}};
        const reg = new Registry();
        const results = reg.add(splitVersions).toJson();
        expect(results).toEqual(multipleReactVersionsMultiUrl);
    });

    test('Interperet versionnumbers from the URL', ()=>{
        const urls =  {react: [
                'https://cdnjs.cloudflare.com/ajax/libs/react/15.5.6/react.min.js',
                'https://cdnjs.cloudflare.com/ajax/libs/react/12.5.6/react.min.js',
                'https://cdnjs.cloudflare.com/ajax/libs/react/15.5.3/react.min.js',
                'https://cdnjs.cloudflare.com/ajax/libs/react/14.8.3/react.min.js'
            ]};
        const reg = new Registry();
        const results = reg.add(urls).toJson();
        expect(results).toEqual(multipleReactVersions);
    });

    test('Add url if the same version is added to the package', ()=>{
        const reg = new Registry();
        reg.add({react: {versions: ['15.5.6', '12.5.6', '15.5.3', '14.8.3'], url: 'https://cdnjs.cloudflare.com/ajax/libs/react/${version}/react.min.js'}});
        reg.add({react: {versions: ['15.5.6', '12.5.6', '15.5.3', '14.8.3'], url: 'https://alt.com/${obj.major}/${obj.minor}/${obj.patch}/react.min.js'}});
        expect(reg.toJson()).toEqual(multipleReactVersionsMultiUrl);
    });

    test('Add url if the same version is added to the package (combine formats)', ()=>{
        const reg = new Registry();
        reg.add({react: [
                'https://cdnjs.cloudflare.com/ajax/libs/react/15.5.6/react.min.js',
                'https://cdnjs.cloudflare.com/ajax/libs/react/12.5.6/react.min.js',
                'https://cdnjs.cloudflare.com/ajax/libs/react/15.5.3/react.min.js',
                'https://cdnjs.cloudflare.com/ajax/libs/react/14.8.3/react.min.js'
            ]});
        reg.add({react: {versions: ['15.5.6', '12.5.6', '15.5.3', '14.8.3'], url: 'https://alt.com/${obj.major}/${obj.minor}/${obj.patch}/react.min.js'}});
        expect(reg.toJson()).toEqual(multipleReactVersionsMultiUrl);
    });

    test('Add multiple packages in different formats', ()=>{
        const reg = new Registry();
        reg.add({
            react: [
                'https://cdnjs.cloudflare.com/ajax/libs/react/15.5.6/react.min.js',
                'https://cdnjs.cloudflare.com/ajax/libs/react/14.8.3/react.min.js'
            ],
            "lodash@4.17.15" :"https://cdnjs.cloudflare.com/ajax/libs/lodash.js/${version}/lodash.min.js",
            "lodash@4.16.0" :"https://cdnjs.cloudflare.com/ajax/libs/lodash.js/${version}/lodash.min.js",
            "lodash@4.17.2" :"https://cdnjs.cloudflare.com/ajax/libs/lodash.js/${version}/lodash.min.js"
        });
        const result = reg.toJson();
        expect(result).toEqual(resultReactAndLodashMixed);
    });

    test('Add dependency overrides', ()=>{
        const reg = new Registry();
        reg.add({
            reactdom: {
                url: "https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.0.0/umd/react-dom.production.min.js",
                dependencyOverrides: { react: "react@18.0.0" }
            },
            react: "https://cdnjs.cloudflare.com/ajax/libs/react/18.0.0/umd/react.production.min.js"
        });
        const result = reg.toJson();
        expect(result).toMatchSnapshot();
    });

    test('Add an array of different input formats', ()=>{
        const reg = new Registry();
        reg.add([
            {react: 'https://cdnjs.cloudflare.com/ajax/libs/react/15.5.6/react.min.js'},
            {react: {url: 'https://cdnjs.cloudflare.com/ajax/libs/react/${obj.major}.${obj.minor}.${obj.patch}/react.min.js', version: '14.8.3'}},
            {lodash: {versions:['4.17.15','4.17.2'], url: 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/${version}/lodash.min.js'}},
            {lodash: 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.16.0/lodash.min.js'}
        ]);
        const result = reg.toJson();
        expect(result).toEqual(resultReactAndLodashMixed);
    });


    test('Add multiple filetypes', ()=>{
        const reg = new Registry();
        reg.add([
            {myproject: {versions:['1.10.5','1.10.6','2.1.0'], urls: ['https://myserver.com/${version}/myproject.min.js', 'https://myserver.com/${version}/myproject.min.css', 'https://myserver.com/${version}/myproject.html']}},
            {myproject: {type:'wasm', url:'https://myserver.com/1.10.5/mywasm.min.js'}}
        ]);
        const result = reg.toJson();
        expect(result).toEqual(resultMultipleFileTypes);
    });


    test('Code should fail with invalid url template', ()=>{
        const reg = new Registry();
        reg.add({myproject: 'https://myserver.com/1.10.1/${noneexisting}/myproject.min.js'});
        const result = reg.toJson();
        expect(typeof result.myproject[0].filetypes.js).toBe('undefined');
    });

    test('Check if anonymous versions gets set', ()=>{
        const reg = new Registry();
        reg.add({react: 'https://myserver.com/anyreactversion.min.js'});
        const result = reg.toJson();
        expect(result.react[0].str).toBe('anonymous');
    });

    test('Check if a default package can be set (when a version is present)', ()=>{
        const reg = new Registry();
        reg.add({'react@6.6.6-default': 'https://cdnjs.cloudflare.com/ajax/libs/react/6.6.6/react.min.js'});
        const result = reg.find('react');
        expect(result.matches[0].str).toBe('6.6.6');
    });


});

describe('Registry handling - Find packages', ()=>{

    let reg;
    beforeAll(() => {
        reg = new Registry();
        reg.add({'react@default': 'https://cdnjs.cloudflare.com/ajax/libs/react/6.6.6/react.min.js'});
        reg.add({
            react: {versions: ['12.5.6', '15.5.3', '15.5.6', '14.6.5', '14.8.3'], url:'https://cdnjs.cloudflare.com/ajax/libs/react/${version}/react.min.js'},
            lodash: {versions: ['4.17.15', '4.16.0', '4.17.2', '4.16.2', '4.16.8', '4.5.2'], url:'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/${version}/lodash.min.js'}
        });
        reg.add({react: 'https://myserver.com/anyreactversion.min.js'});
    });

    test('Find only the first match', ()=>{
        const result = reg.findOne('react');
        expect(result.match.str).toBe('6.6.6');
        expect(typeof result.matches).toBe('undefined');
    });

    test('Find only the first match of major release', ()=>{
        const result = reg.findOne('react@^14.2.0');
        expect(result.match.str).toBe('14.8.3');
    });

    test('Find only the first match of minor release', ()=>{
        const result = reg.findOne('lodash@~4.16.0');
        expect(result.match.str).toBe('4.16.8');
    });

    test('Find only the exact match', ()=>{
        const result = reg.findOne('lodash@4.16.2');
        expect(result.match.str).toBe('4.16.2');
    });

    test('Find mulitple packages from patch number', ()=>{
        const result = reg.find('lodash@~4.16.2');
        expect(result.matches.map(version => version.str).join(',')).toBe('4.16.8,4.16.2,4.16.0');
    });

    test('Find multiple packages from minor', ()=>{
        const result = reg.find('react@^14.6.1');
        expect(result.matches.map(version => version.str).join(',')).toBe('14.8.3,14.6.5');
    });

});