import pkg from './package.json';
import babel from '@rollup/plugin-babel';
import {uglify} from 'rollup-plugin-uglify';

export default args => {
    const input = 'src/index.js';
    const output = [{ file: pkg.main, format: 'iife' }];
    const plugins = [babel()];
    if(args.configUglify) plugins.push(uglify());
    return [{input, output, plugins}];
}