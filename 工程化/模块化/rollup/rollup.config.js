import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve'; // 按照 node 规则查找 node_modules 中的模块 没有她无法加载第三方模块
import commonjs from '@rollup/plugin-commonjs'; // rollup.js编译源码中的模块引用默认只支持 ES6+的模块方式 import/export 需要通过此插件加载 commonjs 的模块 
import babel from '@rollup/plugin-babel';
import typescript from '@rollup/plugin-typescript'; // 支持 ts
import terser from '@rollup/plugin-terser'; // 压缩 js
import postcss from 'rollup-plugin-postcss'; // 支持 css
import serve from 'rollup-plugin-serve'; // 启动服务
export default {
  input: './src/index.js',
  output: {
    // file: './dist/lee.js',
    dir: 'dist',
    format: 'es', // amd es iife umd cjs
    globals: {
      jquery: '$' // 告诉 rollup 全局变量 $ 即是 jquery
    }
  },
  externals: ['jquery'], // 不会打包 引入的此模块
  plugins: [
    json(),
    resolve(),
    commonjs(),
    babel({
      exclude: /node_modules/
    }),
    // typescript(),
    terser(),
    postcss(),
    serve({
      open: true,
      port: 8888,
      contentBase: './dist'
    })
  ],
};
