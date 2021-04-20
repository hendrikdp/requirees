import {root} from './require-global.js';
import RequireEs from './RequireEs.js';

//expose RequireEs Class
root.RequireEs = RequireEs;

//setup default require
const requireEs = new RequireEs();
//global amd module require
root.require = root.requirejs = requireEs.asFunction(false);
root.requirees = requireEs.asFunction(true);

//global amd module define
root.define = root.require.define;
root.define.amd = {};
