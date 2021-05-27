"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 泛型（Generics）是指在定义函数、接口或类的时候，不预先指定具体的类型，而在使用的时候再指定类型的一种特性
 * 泛型T作用域只限于函数内部使用
 */
function creatArr(length, value) {
    let result = [];
    for (let i = 0; i < length; i++) {
        result.push(value);
    }
    return result;
}
creatArr(5, "lee");
/**
 * 泛型类
 */
class MyArr {
    constructor() {
        this.list = [];
    }
    add(value) {
        this.list.push(value);
        return this;
    }
    getMax() {
        return this.list[0];
    }
}
let arr = new MyArr();
arr.add(2).add(2);
/**
 * 泛型与new
 */
function factory(type) {
    return new type(1);
}
class A {
    constructor(age) {
        this.age = age;
    }
}
factory(A);
let add = (a, b) => {
    return a;
};
add(1, 2);
/**
 * 多个泛型
 */
function swap(a, b) {
    return [b, a];
}
swap(2, "lee");
/**
 * 默认泛型类型
 */
function add2(a) {
    return a;
}
add2(1);
/**
 * 泛型约束
 * 在函数中使用泛型的时候，由于预先并不知道泛型的类型，所以不能随意访问相应类型的属性或方法。
 */
function logger(a) {
    // console.log(a.length);
}
function logger2(a) {
    console.log(a.length);
}
logger2("str");
let cart = {
    list: [{ name: "lee", value: 2 }],
};
let c2 = { list: [1, 2, 3] };
let c3 = ["1", "2"];
/**
 * 泛型接口 VS 泛型类型别名
 * 接口创建了一个新的名字，它可以在其他任意地方被调用。而类型别名并不创建新的名字，例如报错信息就不会使用别名
 * 类型别名不能被 extends和 implements,这时我们应该尽量使用接口代替类型别名
 * 当我们需要使用联合类型或者元组类型的时候，类型别名会更合适
 */
