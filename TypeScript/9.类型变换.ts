export {};
/**
 * 类型推断
 */
// 1.从右到左
let foo = 1;
let str = "string";

// 2.底部流出
// 返回类型能被return语句推断
function fn() {
  return {
    name: "lee",
    age: 18,
  };
}
let f = fn();

// 3.从左向右
// 函数参数类型，返回值类型也能通过赋值来推断
type Sum = (a: number, b: number) => number;
let sum: Sum = (a, b) => {
  // a = "lee";
  return a + b;
};

// 4.结构化
const person = {
  name: "lee",
  age: 18,
};
let name2 = person.name;
// name2 = 18

// 5.解构
let { age } = person;
// age = 'lee'

// 6.DefaultProps
interface DefaultProps {
  name?: string;
  age?: number;
}
let defaultProps = {
  name: "lee",
  age: 18,
};
let props = {
  ...defaultProps,
  gender: "male",
};
type T = typeof props;

// 7.小心使用返回值
// 尽管 TypeScript 一般情况下能推断函数的返回值，但是它可能并不是你想要的
function addOne(a: any) {
  return a + 1;
}
function sum2(a: number, b: number) {
  return a + addOne(b);
}
type Ret = ReturnType<typeof sum2>;
/**
 * 交叉类型
 * 交叉类型(Intersection Types)是将多个类型合并为一个类型
 * 这让我们可以把现有的多种类型叠加到一起成为一种类型，它包含了所需的所有类型的特性
 */
interface Bird1 {
  name: string;
  fly(): void;
}
interface Person {
  name: string;
  talk(): void;
}
type BirdPerson = Bird1 & Person;
let p: BirdPerson = {
  name: "lee",
  fly() {},
  talk() {},
};

interface X {
  a: string;
  b: string;
}
interface Y {
  a: number;
  c: number;
}
type XY = X & Y;
// let p: XY = { a: 111, b: "123", c: 123 };

type Ta = string | number;
type Tb = number | boolean;
type Tc = Ta & Tb;
// let c1: Tc = "lee";
let c2: Tc = 1;
// let c3: Tc = true;

/**
 * mixin混入模式可以让你从两个对象中创建一个新对象，新对象会拥有着两个对象所有的功能
 */
interface AnyObj {
  [key: string]: any;
}
function mixin<T extends AnyObj, U extends AnyObj>(one: T, two: U): T & U {
  let result = <T & U>{};
  for (let i in one) {
    (result as T)[i] = one[i];
  }
  for (let i in two) {
    (result as U)[i] = two[i];
  }
  return result;
}
const x = mixin({ name: "zhufeng" }, { age: 11 });
// x.name x.age

/**
 * typeof 获取一个变量的类型
 */
let p1 = {
  name: "lee",
  age: 12,
  gender: "male",
};
type Person1 = typeof p1;
function getName(p: Person1): string {
  return p.name;
}
getName({
  name: "123",
  age: 1,
  gender: "femal",
});

/**
 * 索引访问操作符
 * 可以通过[]获取一个类型的子类型
 */
interface Person2 {
  name: string;
  age: number;
  job: {
    name: string;
  };
  arr: { name: string; age: number }[];
}
let FrontEndJob: Person2["job"] = {
  name: "lee",
};
let name: Person2["arr"][0]["name"] = "lee";

/**
 * keyof索引类型查询操作符
 */
interface Person3 {
  name: string;
  age: number;
  gender: "male" | "female";
}
type PersonKey = keyof Person3;
function getValueByKey(p: Person3, key: PersonKey) {
  return p[key];
}
let val = getValueByKey(
  {
    name: "lee",
    age: 18,
    gender: "male",
  },
  "name"
);

/**
 * 映射类型
 * 在定义的时候用in操作符去批量定义类型中的属性
 */
interface Person4 {
  name: string;
  age: number;
  gender: "male" | "female";
}
//批量把一个接口中的属性都变成可选的
type PartPerson = {
  [Key in keyof Person4]?: Person4[Key];
};
let p2: PartPerson = {};
type Part<T> = {
  [key in keyof T]?: T[key];
};
let p3: Part<Person4> = { name: "lee" };

namespace a {
  function pick<T, U extends keyof T>(o: T, keys: U[]): T[U][] {
    return keys.map((key) => o[key]);
  }
  let user = {
    name: "lee",
    age: 18,
    gender: "male",
  };
  type User = typeof user;
  pick<User, keyof User>(user, ["name", "age"]);
}

/**
 * 条件类型
 * 在定义泛型的时候能够添加进逻辑分支，以后泛型更加灵活
 */

/**
 * 定义条件类型
 */
interface Fish {
  fish: string;
}
interface Water {
  water: string;
}
interface Bird {
  bird: string;
}
interface Sky {
  sky: string;
}
//若 T 能够赋值给 Fish，那么类型是 Water,否则为 Sky
type Condition<T> = T extends Fish ? Water : Sky;
let condition: Condition<Bird> = {
  //condition = Sky
  sky: "lee",
};

/**
 * 条件类型的分发
 */
let condition2: Condition<Bird | Fish>; //condition2 = Water | Sky

/**
 * 条件类型有一个特性,就是「分布式有条件类型」,
 * 但是分布式有条件类型是有前提的,条件类型里待检查的类型必须是naked type parameter 裸类型
 */

/**
 * 找出T类型中U不包含的部分
 */
type Diff<T, U> = T extends U ? never : T;
type R = Diff<"a" | "b" | "c" | "d", "a" | "c" | "f">; // "b" | "d"

type Filter<T, U> = T extends U ? T : never;
type R1 = Filter<string | number | boolean, number>; // number

/**
 * 编写一个工具类型将interface中函数类型的名称取出来
 */
namespace h {
  interface Person2 {
    id: number;
    name: string;
    getName(): string;
    getAge(): number;
  }
  type FunctionPropertyNames<T> = {
    [K in keyof T]: T[K] extends Function ? K : never;
  }[keyof T];
  type R2 = FunctionPropertyNames<Person2>;
}

/**
 * 内置条件类型
 * Exclude  从 T 可分配给的类型中排除 U
 * Extract  从 T 可分配的类型中提取 U
 * NonNullable  从 T 中排除 null 和 undefined
 * ReturnType  获取函数类型的返回类型
 * Parameters  Constructs a tuple type of the types of the parameters of a function type T
 * InstanceType  获取构造函数类型的实例类型
 */
namespace b {
  type Exclude<T, U> = T extends U ? never : T;
  type E = Exclude<string | number, string>;
  let e: E = 10;
}

namespace e {
  type Extract<T, U> = T extends U ? T : never;
  type E = Extract<string | number, string>;
  let e: E = "1";
}

namespace f {
  type NonNullable<T> = T extends null | undefined ? never : T;
  type E = NonNullable<string | number | null | undefined>;
  // let e: E = null;
}

namespace g {
  function getUserInfo() {
    return { name: "zhufeng", age: 10 };
  }

  // 通过 ReturnType 将 getUserInfo 的返回值类型赋给了 UserInfo
  type UserInfo = ReturnType<typeof getUserInfo>;
  const userA: UserInfo = {
    name: "zhufeng",
    age: 10,
  };

  type ReturnType2<T extends (...args: any[]) => any> = T extends (
    ...args: any[]
  ) => infer R
    ? R
    : any;
}

//Parameters
type Parameters<T> = T extends (...args: infer R) => any ? R : any;

type f1 = Parameters<(a: number, b: string) => void>;
type f2 = Parameters<() => void>;

//InstanceType
namespace t {
  class Person {
    name: string;
    constructor(name: string) {
      this.name = name;
    }
    getName(): string {
      return this.name;
    }
  }
  type Construct = new (...args: any[]) => any;
  type ConstructorParameters<T extends Construct> = T extends new (
    ...args: infer R
  ) => any
    ? R
    : never;
  type InstanceType<T extends Construct> = T extends new (
    ...args: any[]
  ) => infer R
    ? R
    : never;
  type a = InstanceType<typeof Person>;
  let p3: Person = {
    name: "lee",
    getName() {
      return "lee";
    },
  };
  type c = ConstructorParameters<typeof Person>;
  let c: c = ["lee"];
}

/**
 * 内置工具类型
 * TS 中内置了一些工具类型来帮助我们更好地使用类型系统
 */

/**
 * partial将传入的属性由非可选变为可选
 */
namespace a {
  type Partial<T> = {
    [p in keyof T]?: T[p];
  };
  interface A {
    a1: string;
    a2: number;
    a3: boolean;
  }
  type pa = Partial<A>;
}

/**
 * 类型递归
 */
namespace v {
  interface Company {
    id: number;
    name: string;
  }
  interface Person {
    id: number;
    name: string;
    compant: Company;
  }
  type DeepPartial<T> = {
    [p in keyof T]?: T[p] extends object ? DeepPartial<T[p]> : T[p];
  };
  type P2 = DeepPartial<Person>;
}

/**
 * required
 * 将传入的属性由可选项变为必选项
 */
namespace r {
  interface Person {
    name?: string;
  }
  type Required<T> = {
    [p in keyof T]-?: T[p];
  };
  type P2 = Required<Person>;
}

/**
 * Readonly 通过为传入的属性每一项都加上 readonly 修饰符来实现。
 */
namespace t {
  interface Person {
    name: string;
    age: number;
    gender?: "male" | "female";
  }
  type Readonly<T> = {
    readonly [p in keyof T]: T[p];
  };
  type Pw = Readonly<Person>;
}

/**
 * Pick从传入的属性中摘取某一项返回
 */
namespace q {
  interface Animal {
    name: string;
    age: number;
    gender: number;
  }
  type Pick<T, K extends keyof T> = {
    [p in K]: T[p];
  };
  function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
    const result: Pick<T, K> = {} as Pick<T, K>;
    keys.map((key) => {
      result[key] = obj[key];
    });
    return result;
  }
  let animal: Animal = {
    name: "miao",
    age: 18,
    gender: 1,
  };
  let a = pick<Animal, "age" | "name">(animal, ["age", "name"]);
  type P5 = Pick<Animal, "age" | "name">;
}

/**
 * Record 是 TypeScript 的一个高级类型
 * 他会将一个类型的所有属性值都映射到另一个类型上并创造一个新的类型
 */
namespace h {
  type Record<K extends keyof any, T> = {
    [p in K]: T;
  };
  type point = "x" | "y";
  type PointList = Record<point, { name: string }>;

  function maoObject<K extends keyof any, T, U>(
    obj: Record<K, T>,
    map: (x: T) => U
  ): Record<K, U> {
    let result: any = {};
    for (let key in obj) {
      result[key] = map(obj[key]);
    }
    return result;
  }
  let name = { 1: "hello", 2: "world" };
  let map = (x: string) => x.length;
  let o = maoObject<string, string, number>(obj, map);
}

/**
 * Proxy
 */
type Proxy<T> = {
  get(): T;
  set(value: T): void;
};
type Proxify<T> = {
  [p in keyof T]: Proxy<T[p]>;
};
function proxify<T>(obj: T): Proxify<T> {
  let result = {} as Proxify<T>;
  for (let key in obj) {
    result[key] = {
      get() {
        return obj[key];
      },
      set(val) {
        obj[key] = val;
      },
    };
  }
  return result;
}
let props2 = {
  name: "zhufeng",
  age: 10,
};
let proxyProps = proxify(props2);
console.log(proxyProps);

function unProxify<T>(t: Proxify<T>): T {
  let result = {} as T;
  for (const k in t) {
    result[k] = t[k].get();
  }
  return result;
}

let originProps = unProxify(proxyProps);
console.log(originProps);

/**
 * SetDifference same as Exclude
 */
type SetDifference<A, B> = A extends B ? never : A;
type a = SetDifference<"1" | "2" | "3", "2" | "3" | "4">;

/**
 * Omit
 * Exclude 的作用是从 T 中排除出可分配给 U的元素..
 * Omit<T, K>的作用是忽略T中的某些属性
 * Omit = Exclude + Pick
 */
namespace y {
  type Omit<T, K extends keyof any> = Pick<T, SetDifference<keyof T, K>>;
  type Props = { name: string; age: number; visible: boolean };
  type Props2 = Omit<Props, "age">;
}

/**
 * Diff
 */
namespace u {
  type Diff<T extends object, U extends object> = Pick<
    T,
    SetDifference<keyof T, keyof U>
  >;
  type Props = { name: string; age: number; visible: boolean };
  type DefaultProps = { age: number };
  type DiffProps = Diff<Props, DefaultProps>;
}

/**
 * Intersection
 */
namespace i {
  type Intersection<T extends object, U extends object> = Pick<
    T,
    Extract<keyof T, keyof U> & Extract<keyof U, keyof T>
  >;
  type Props = { name: string; age: number; visible: boolean };
  type DefaultProps = { age: number };
  type DuplicateProps = Intersection<Props, DefaultProps>;
}

/**
 * Overwrite<T, U>顾名思义,是用U的属性覆盖T的相同属性.
 */
namespace p {
  type Intersection<T extends object, U extends object> = Pick<
    T,
    Extract<keyof T, keyof U> & Extract<keyof U, keyof T>
  >;
  type Overwrite<
    T extends object,
    U extends object,
    I = Diff<T, U> & Intersection<U, T>
  > = Pick<I, keyof I>;

  type Props = { name: string; age: number; visible: boolean };
  type NewProps = { age: string; other: string };

  // Expect: { name: string; age: string; visible: boolean; }
  type ReplacedProps = Overwrite<Props, NewProps>;
}

/**
 * Merge.
 * Merge<O1, O2>的作用是将两个对象的属性合并:
 */
namespace o {
  type O1 = {
    id: number;
    name: string;
  };

  type O2 = {
    id: number;
    age: number;
  };

  //Compute的作用是将交叉类型合并
  type Compute<A extends any> = A extends Function
    ? A
    : { [K in keyof A]: A[K] };

  type R1 = Compute<{ x: "x" } & { y: "y" }>;
  type Merge<O1 extends object, O2 extends object> = Compute<
    O1 & Omit<O2, keyof O1>
  >;

  type R2 = Merge<O1, O2>;
}
/**
 * Mutable 
 * 将 T 的所有属性的 readonly 移除
 */
type Mutable<T> = {
  -readonly [P in keyof T]: T[P]
}