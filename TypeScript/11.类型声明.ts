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

declare let name: string; //变量
declare let age: number; //变量
declare function getName(): string; //方法
declare class Animal {
  name: string;
} //类
console.log(name, age);
getName();
new Animal();

declare const enum Season {
  Spring,
  Summer,
  Autumn,
  Winter,
}
let seaon = [Season.Spring];

// namsepace
// 如果一个全局变量包括了很多子属性，可能使用namespace
// 在声明文件中的namespace表示一个全局变量包含很多子属性
// 在命名空间内部不需要使用 declare 声明属性或方法
declare namespace $ {
  function ajax(): void;
}

/**
 * 类型声明文件
 * 我们可以把类型声明放在一个单独的类型声明文件中
 * 可以在类型声明文件中使用类型声明
 * 文件命名规范为*.d.ts
 * 观看类型声明文件有助于了解库的使用方式
 */
//typings\jquery.d.ts
declare const $2:(selector:string)=>{
  click():void;
  width(length:number):void;
}
//tsconfig.json
// {
//   "compilerOptions": {
//     "module": "commonjs",
//     "target": "ES2015",  
//     "outDir":"lib"
//   },
//   "include": [
//     "src/**/*",
//     "typings/**/*"
//   ]
// }

/**
 * 第三方声明文件
 * 可以安装使用第三方的声明文件 cnpm i @types/jquery -S
 * @types是一个约定的前缀，所有的第三方声明的类型库都会带有这样的前缀
 * JavaScript 中有很多内置对象，它们可以在 TypeScript 中被当做声明好了的类型
 * 内置对象是指根据标准在全局作用域（Global）上存在的对象。这里的标准是指 ECMAScript 和其他环境（比如 DOM）的标准
 * 这些内置对象的类型声明文件，就包含在TypeScript 核心库的类型声明文件中
 */
/**
 * 自己编写声明文件
 */
//types\jquery\index.d.ts
declare function jQuery(selector:string):HTMLElement;
declare namespace jQuery{
  function ajax(url:string):void
}
export default jQuery;

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