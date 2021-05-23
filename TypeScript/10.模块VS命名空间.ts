/**
 * 在默认情况下，当你开始在一个新的 TypeScript 文件中写下代码时，它处于全局命名空间中
 * 使用全局变量空间是危险的，因为它会与文件内的代码命名冲突。我们推荐使用下文中将要提到的文件模块
 */
/**
 * 文件模块
 * 文件模块也被称为外部模块。如果在你的 TypeScript 文件的根级别位置含有 import 或者 export，那么它会在这个文件中创建一个本地的作用域
 * 模块是TS中外部模块的简称，侧重于代码和复用
 * 模块在期自身的作用域里执行，而不是在全局作用域里
 * 一个模块里的变量、函数、类等在外部是不可见的，除非你把它导出
 * 如果想要使用一个模块里导出的变量，则需要导入
 */
export const a = 1;
export const b = 2;
export default "zhufeng";
// import name, { a, b } from './1';

/**
 * 模块规范
 * AMD：不要使用它，它仅能在浏览器工作；
 * SystemJS：这是一个好的实验，已经被 ES 模块替代；
 * ES 模块：它并没有准备好。
 * 使用 module: commonjs 选项来替代这些模式，将会是一个好的主意
 */

/**
 * 命名空间
 * 在代码量较大的情况下，为了避免命名空间冲突，可以将相似的函数、类、接口放置到命名空间内
 * 命名空间可以将代码包裹起来，只对外暴露需要在外部访问的对象，命名空间内通过export向外导出
 * 命名空间是内部模块，主要用于组织代码，避免命名冲突
 */
export namespace zoo {
  export class Dog {
    eat() {
      console.log("zoo dog");
    }
  }
}
export namespace home {
  export class Dog {
    eat() {
      console.log("home dog");
    }
  }
}
let dog_of_zoo = new zoo.Dog();
dog_of_zoo.eat();
let dog_of_home = new home.Dog();
dog_of_home.eat();

/**
 * 文件和模块
 */
//每个moudle都不一样
export module Box{
  export class Book1{}
}
//namespace 和 module 不一样，namespace 在全局空间中具有唯一性
namespace  Box1{
  export class Book1{}
}
namespace  Box1{
  // export class Book1{}
}
//每个文件是独立的