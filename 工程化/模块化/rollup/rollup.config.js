import json from 'rollup-plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
export default {
  input: './src/index.js',
  output: {
    // file: 'dist/bundle.js',
    dir: 'dist',
    format: 'amd',
  },
  plugins: [json(), resolve(), commonjs()],
};
