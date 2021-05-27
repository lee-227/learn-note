"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getName(animal) {
    return animal.name;
}
let p = {
    name: "lee",
    age: 18,
    gender: 1,
};
getName(p);
/**
 * 基本类型的兼容性
 */
//基本数据类型也有兼容性判断
let num;
let str = "kee";
num = str;
//只要有toString()方法就可以赋给字符串变量
let nums;
let str2 = "lee";
nums = str2;
/**
 * 类的兼容性检查
 * 在TS中是结构类型系统，只会对比结构而不在意类型
 */
var a;
(function (a_1) {
    class Anims {
        constructor() {
            this.name = "lee";
        }
    }
    class Bird extends Anims {
        constructor() {
            super(...arguments);
            this.swing = 2;
        }
    }
    let a;
    a = new Bird();
    let b;
    // b = new Anims(); //并不是父类兼容子类，子类不兼容父类
})(a || (a = {}));
var b;
(function (b_1) {
    class Animal {
        constructor() {
            this.name = "zhu";
        }
    }
    class Bird extends Animal {
    }
    let a;
    a = new Bird();
    let b;
    b = new Animal();
})(b || (b = {}));
var c;
(function (c) {
    class Animal {
        constructor() {
            this.name = "zhu";
        }
    }
    class Person {
        constructor() {
            this.name = "lee";
        }
    }
    let a;
    a = new Person();
    let b;
    b = new Animal();
})(c || (c = {}));
let sum;
sum = (a, b) => {
    return a + b;
};
//可以少一个参数
sum = (a) => {
    return a;
};
let fun;
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
(function (a) {
    class Animal {
    }
    class Dog extends Animal {
        constructor() {
            super(...arguments);
            this.name = "dog";
        }
    }
    class BlackDog extends Dog {
        constructor() {
            super(...arguments);
            this.age = 18;
        }
    }
    let animal;
    let dog;
    let blackDog;
    function exec(cb) {
        cb(dog);
    }
    let childToChild = (blackDog) => blackDog;
    let childToParent = (blackDog) => animal;
    const parentToParent = (animal) => animal;
    const parentToChild = (animal) => blackDog;
    exec(parentToChild);
})(a || (a = {}));
var e;
(function (e) {
    function exec2(callback) {
        callback("");
    }
    const parentToChild2 = (a) => "";
    exec2(parentToChild2);
    const parentToParent3 = (a) => "";
    // exec2(parentToParent3);
})(e || (e = {}));
let x;
let y;
x = y;
let x1;
let y1;
let xx2;
let yy2;
// xx2 = yy2;
/**
 * 枚举的兼容性
 * 枚举类型与数字类型兼容，并且数字类型与枚举类型兼容
 * 不同枚举类型之间是不兼容的
 */
//数字可以赋给枚举
var f;
(function (f) {
    let Colors;
    (function (Colors) {
        Colors[Colors["Red"] = 0] = "Red";
        Colors[Colors["Yellow"] = 1] = "Yellow";
    })(Colors || (Colors = {}));
    let c;
    c = Colors.Red;
    c = 1;
    // c = "1";
    //枚举值可以赋给数字
    let n;
    n = 1;
    n = Colors.Red;
})(f || (f = {}));
