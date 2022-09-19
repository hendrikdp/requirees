import pkg from './package.json';
import babel from '@rollup/plugin-babel';
import {terser} from 'rollup-plugin-terser';

export default args => {
    const input = 'src/index.js';
    const output = [{ file: pkg.main, format: 'iife' }];
    const plugins = [babel()];
    if(args.configUglify) plugins.push(terser());
    return [{input, output, plugins}];
}
