import {defineConfig} from 'rollup';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import babel from '@rollup/plugin-babel';

export default defineConfig({
  input: './src/index.js',
  output: {
    // file: './dist/lee.js',
    dir: 'dist',
    format: 'es',
  },
  external: ['lodash'],
  plugins: [json(), resolve(), commonjs(), babel()],
});
