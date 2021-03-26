import {getRequireArguments, getDefinitionArguments} from "../arguments.js";
import amd from "../__mocks__/amd.mock";

describe('When define arguments are loaded:', ()=>{

    test('Where all parameters are provided: ', ()=>{
        let {name, dependencies, factory} = getDefinitionArguments([
            amd.moduleName,
            amd.dependencies,
            amd.vanillaFactory
        ]);
        expect(name).toBe(amd.moduleName);
        expect(dependencies).toEqual(amd.dependencies);
        expect(factory).toBe(amd.vanillaFactory);
    });

    test('No dependencies are provided: ', ()=>{
        let {name, dependencies, factory} = getDefinitionArguments([
            amd.moduleName,
            amd.cjsFactory
        ]);
        expect(name).toBe(amd.moduleName);
        expect(dependencies).toEqual(amd.cjsDependencies);
        expect(factory).toBe(amd.cjsFactory);
    });

    test('The order is switched: ', ()=>{
        let {name, dependencies, factory} = getDefinitionArguments([
            amd.cjsFactory,
            amd.moduleName
        ]);
        expect(name).toBe(amd.moduleName);
        expect(dependencies).toEqual(amd.cjsDependencies);
        expect(factory).toBe(amd.cjsFactory);
    });

    test('Only a cjs-factory is given: ', ()=>{
        let {name, dependencies, factory} = getDefinitionArguments([
            amd.cjsFactory,
        ]);
        expect(name).toBe(undefined);
        expect(dependencies).toEqual(amd.cjsDependencies);
        expect(factory).toBe(amd.cjsFactory);
    });

    test('Only dependencies need to be loaded: ', ()=>{
        let {name, dependencies, factory} = getDefinitionArguments([
            amd.dependencies
        ]);
        expect(name).toBe(undefined);
        expect(dependencies).toEqual(amd.dependencies);
        expect(factory).toBe(undefined);
    });
});

describe('When require arguments are loaded:', ()=>{

    test('If package and callback are recognized', ()=>{
        let {dependencies, callback} = getRequireArguments([amd.moduleName, amd.callback]);
        expect(dependencies).toMatchObject(["myTestModule"]);
        expect(callback).toEqual(amd.callback);
    });

    test('If version numbers are interpreted', ()=>{
        let {dependencies, callback} = getRequireArguments([`${amd.moduleName}@3.4.5`, amd.callback]);
        expect(dependencies).toMatchObject(["myTestModule@3.4.5"]);
    });

    test('If subPackage is recognized', ()=>{
        let {dependencies, callback} = getRequireArguments([`${amd.moduleName}@3.4.5:react`, amd.callback]);
        expect(dependencies).toMatchObject(["myTestModule@3.4.5:react"]);
    });

    test('If multiple requires are handled', ()=>{
        let {dependencies, callback} = getRequireArguments([['myModule:subPackage', 'myModule@6.5.4:AnotherSubPackage', 'react@14.3.0', 'lodash'], amd.callback]);
        expect(dependencies).toMatchObject(['myModule:subPackage', 'myModule@6.5.4:AnotherSubPackage', 'react@14.3.0', 'lodash']);
    });

    test('If version tolerance is calculated', ()=>{
        let {dependencies} = getRequireArguments([['react@~14.0.5', 'react@*', 'react@^14.0.5']]);
        expect(dependencies).toMatchObject(['react@~14.0.5', 'react@*', 'react@^14.0.5'])
    })
});