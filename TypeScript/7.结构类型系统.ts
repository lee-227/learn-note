export {};
/**
 * 接口兼容性
 * 如果传入的变量和声明的类型不匹配，TS就会进行兼容性检查
 * 原理是Duck-Check,就是说只要目标类型中声明的属性变量在源类型中都存在就是兼容的
 */

interface Animal {
  name: string;
  age: number;
}
interface Person {
  name: string;
  age: number;
  gender: number;
}

function getName(animal: Animal) {
  return animal.name;
}
let p: Person = {
  name: "lee",
  age: 18,
  gender: 1,
};
getName(p);

/**
 * 基本类型的兼容性
 */
//基本数据类型也有兼容性判断
let num: string | number;
let str: string = "kee";
num = str;

//只要有toString()方法就可以赋给字符串变量
let nums: {
  toString(): string;
};
let str2: string = "lee";
nums = str2;

/**
 * 类的兼容性检查
 * 在TS中是结构类型系统，只会对比结构而不在意类型
 */
namespace a {
  class Anims {
    name: string = "lee";
  }
  class Bird extends Anims {
    swing: number = 2;
  }

  let a: Anims;
  a = new Bird();

  let b: Bird;
  // b = new Anims(); //并不是父类兼容子类，子类不兼容父类
}
namespace b {
  class Animal {
    name: string = "zhu";
  }
  class Bird extends Animal {}
  let a: Animal;
  a = new Bird();

  let b: Bird;
  b = new Animal();
}
namespace c {
  class Animal {
    name: string = "zhu";
  }
  class Person {
    name: string = "lee";
  }
  let a: Animal;
  a = new Person();
  let b: Person;
  b = new Animal();
}

/**
 * 函数的兼容性
 * 先比较函数的参数，再比较函数的返回值
 */

type sunFun = (a: number, b: number) => number;
let sum: sunFun;
sum = (a: number, b: number): number => {
  return a + b;
};
//可以少一个参数
sum = (a: number): number => {
  return a;
};
//多参数不可以
// sum = (a: number, b: number, c: number): number => {
//   return a + b + c;
// };

type GetPerson = () => { name: string; age: number };
let fun: GetPerson;
//少返回一个参数 不可以
// fun = () => ({
//   name: "lee";
// });
fun = () => ({
  name: "lee",
  age: 14,
});
//多返回参数 可以
fun = () => ({
  name: "lee",
  age: 18,
  gender: "male",
});

/**
 * 函数的逆变与协变
 * 返回值类型可以传子类,参数可以传父类
 * 参数逆变父类 返回值协变子类 搀你父,返鞋子
 */

namespace a {
  class Animal {}
  class Dog extends Animal {
    public name: string = "dog";
  }
  class BlackDog extends Dog {
    public age: number = 18;
  }
  let animal: Animal;
  let dog: Dog;
  let blackDog: BlackDog;
  type Cb = (dog: Dog) => Dog;
  function exec(cb: Cb): void {
    cb(dog);
  }
  type ChildToChild = (blackDog: BlackDog) => BlackDog;
  let childToChild: ChildToChild = (blackDog: BlackDog): BlackDog => blackDog;
  // exec(childToChild); 参数传多了

  type ChildToParent = (blackDog: BlackDog) => Animal;
  let childToParent: ChildToParent = (blackDog: BlackDog): Animal => animal;
  // exec(childToParent);参数传多了

  type ParentToParent = (animal: Animal) => Animal;
  const parentToParent: ParentToParent = (animal: Animal): Animal => animal;
  // exec(parentToParent);返回值缺少

  type ParentToChild = (animal: Animal) => BlackDog;
  const parentToChild: ParentToChild = (animal: Animal): BlackDog => blackDog;
  exec(parentToChild);
}

namespace e {
  type Callback2 = (a: string | number) => string | number;
  function exec2(callback: Callback2): void {
    callback("");
  }
  type ParentToChild2 = (a: string | number | boolean) => string;
  const parentToChild2: ParentToChild2 = (
    a: string | number | boolean
  ): string => "";
  exec2(parentToChild2);

  type ParentToParent3 = (a: string) => string;
  const parentToParent3: ParentToParent3 = (a: string): string => "";
  // exec2(parentToParent3);
}

/**
 * 泛型的兼容性
 * 泛型在判断兼容性的时候会先判断具体的类型,然后再进行兼容性判断
 */
//1.接口内容为空没用到泛型的时候是可以的
interface Empty<T> {}
let x!: Empty<string>;
let y!: Empty<number>;
x = y;

//2.接口内容不为空的时候不可以
interface NotEmpty<T> {
  data: T;
}
let x1!: NotEmpty<string>;
let y1!: NotEmpty<number>;
// x1 = y1;

//实现原理如下,称判断具体的类型再判断兼容性
interface NotEmptyString {
  data: string;
}

interface NotEmptyNumber {
  data: number;
}
let xx2!: NotEmptyString;
let yy2!: NotEmptyNumber;
// xx2 = yy2;

/**
 * 枚举的兼容性
 * 枚举类型与数字类型兼容，并且数字类型与枚举类型兼容
 * 不同枚举类型之间是不兼容的
 */
//数字可以赋给枚举
namespace f {
  enum Colors {
    Red,
    Yellow,
  }
  let c: Colors;
  c = Colors.Red;
  c = 1;
  // c = "1";

  //枚举值可以赋给数字
  let n: number;
  n = 1;
  n = Colors.Red;
}
