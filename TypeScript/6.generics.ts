export {};
/**
 * 泛型（Generics）是指在定义函数、接口或类的时候，不预先指定具体的类型，而在使用的时候再指定类型的一种特性
 * 泛型T作用域只限于函数内部使用
 */
function creatArr<T>(length: number, value: T): Array<T> {
  let result: T[] = [];
  for (let i = 0; i < length; i++) {
    result.push(value);
  }
  return result;
}
creatArr<string>(5, "lee");

/**
 * 泛型类
 */
class MyArr<T> {
  private list: T[] = [];
  add(value: T) {
    this.list.push(value);
    return this;
  }
  getMax(): T {
    return this.list[0];
  }
}
let arr = new MyArr<number>();
arr.add(2).add(2);

/**
 * 泛型与new
 */
function factory<T>(type: { new (age: number): T }): T {
  return new type(1);
}

class A {
  constructor(public age: number) {}
}
factory<void>(A)
/**
 * 泛型接口
 * 用来约束函数
 */
interface Calucate {
  <T>(a: T, b: T): T;
}

let add: Calucate = <T>(a: T, b: T): T => {
  return a;
};
add<number>(1, 2);

/**
 * 多个泛型
 */
function swap<A, B>(a: A, b: B): [B, A] {
  return [b, a];
}
swap<number, string>(2, "lee");

/**
 * 默认泛型类型
 */
function add2<T = number>(a: T): T {
  return a;
}
add2(1);

/**
 * 泛型约束
 * 在函数中使用泛型的时候，由于预先并不知道泛型的类型，所以不能随意访问相应类型的属性或方法。
 */
function logger<T>(a: T) {
  // console.log(a.length);
}
interface Length {
  length: number;
}
function logger2<T extends Length>(a: T) {
  console.log(a.length);
}
logger2<string>("str");
// logger2(2)

/**
 * 泛型接口
 */
interface Cart<T> {
  list: T[];
}
let cart: Cart<{ name: string; value: number }> = {
  list: [{ name: "lee", value: 2 }],
};

/**
 * 泛型类型别名
 */
type C<T> = { list: T[] } | T[];
let c2: C<number> = { list: [1, 2, 3] };
let c3: C<string> = ["1", "2"];

/**
 * 泛型接口 VS 泛型类型别名
 * 接口创建了一个新的名字，它可以在其他任意地方被调用。而类型别名并不创建新的名字，例如报错信息就不会使用别名
 * 类型别名不能被 extends和 implements,这时我们应该尽量使用接口代替类型别名
 * 当我们需要使用联合类型或者元组类型的时候，类型别名会更合适
 */
