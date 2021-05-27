"use strict";
/**
 * 声明文件可以让我们不需要将JS重构为TS，只需要加上声明文件就可以使用系统
 * 类型声明在编译的时候都会被删除，不会影响真正的代码
 * 关键字 declare 表示声明的意思,我们可以用它来做出各种声明:
 */
// declare var 声明全局变量
// declare function 声明全局方法
// declare class 声明全局类
// declare enum 声明全局枚举类型
// declare namespace 声明(含有子属性的)全局对象
// interface 和 type 声明全局类型
Object.defineProperty(exports, "__esModule", { value: true });
console.log(name, age);
getName();
new Animal();
let seaon = [0 /* Spring */];
exports.default = jQuery;
//tsconfig.json
/**
 * 如果配置了paths,那么在引入包的的时候会自动去paths目录里找类型声明文件
 * 在 tsconfig.json 中，我们通过 compilerOptions 里的 paths 属性来配置路径映射
 * paths是模块名到基于baseUrl的路径映射的列表
 */
// {
//   "compilerOptions": {
//     "baseUrl": "./",// 使用 paths 属性的话必须要指定 baseUrl 的值
//     "paths": {
//       "*":["types/*"]
//     }
// }
// npm声明文件可能的位置
/**
  node_modules/jquery/package.json
    "types":"types/xxx.d.ts"
  node_modules/jquery/index.d.ts
  node_modules/@types/jquery/index.d.ts
  typings\jquery\index.d.ts
 */
//查找声明文件
/**
 * 如果是手动写的声明文件，那么需要满足以下条件之一，才能被正确的识别
 * 给 package.json 中的 types 或 typings 字段指定一个类型声明文件地址
 * 在项目根目录下，编写一个 index.d.ts 文件
 * 针对入口文件（package.json 中的 main 字段指定的入口文件），编写一个同名不同后缀的 .d.ts 文件
 */
// {
//   "name": "myLib",
//   "version": "1.0.0",
//   "main": "lib/index.js",
//   "types": "myLib.d.ts",
// }
// 先找myLib.d.ts
// 没有就再找index.d.ts
// 还没有再找lib/index.d.js
// 还找不到就认为没有类型声明了
