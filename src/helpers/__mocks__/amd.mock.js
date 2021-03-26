const vanillaFactory = function(){
    console.log('this is such great fun');
};

const cjsFactory = function(){
    const bla = require('module1');
    const yay = require('module2');
    /*
    const ignore = require('module3');
     */
    bla.test();
};

const cjsDependencies = ['module1', 'module2'];

const dependencies = ['module1@^5.12.8', 'module2', 'bundle:module3', 'global:globalize'];

const moduleName = 'myTestModule';

const callback = function(){
    console.log('yaaay, package is downloaded');
};

export default {vanillaFactory, cjsFactory, cjsDependencies, dependencies, moduleName, callback};