"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 类型保护就是一些表达式，他们在编译的时候就能通过类型信息确保某个作用域内变量的类型
 * 类型保护就是能够通过关键字判断出分支中的类型
 */
/**
 * typeof保护
 */
function double(input) {
    if (typeof input === 'string') {
        return input.toLocaleUpperCase();
    }
    else if (typeof input === 'number') {
        input.toFixed();
    }
    else {
        return !input;
    }
}
/**
 * instanseof
 */
class Animal {
}
class Bird extends Animal {
}
function getName(ani) {
    if (ani instanceof Bird) {
        ani.swing;
    }
    else if (ani instanceof Animal) {
        ani.name;
    }
}
/**
 * null保护
 * 如果开启了strictNullChecks 对于可能为null的变量不能调用他的属性跟方法
 */
function getFirst(s) {
    //第一种方式是加上null判断
    if (s === null) {
        return '';
    }
    //第二种处理是增加一个或的处理
    s = s || '';
    return s.charAt(0);
}
function getLast(s) {
    function logger() {
        s.charAt(0);
    }
    s = s || '';
    logger();
}
function getButton(b) {
    if (b.class === 'danger') {
        b.text;
    }
    else {
        b;
    }
}
function reducer(action) {
    switch (action.type) {
        case 'add':
            let user = action.playload;
            break;
        case 'del':
            let id = action.playload;
            break;
    }
}
/**
 * in操作符
 */
var a;
(function (a) {
    function getNumber(x) {
        if ('swing' in x) {
            x;
        }
        else {
            x;
        }
    }
})(a || (a = {}));
/**
 * 自定义类型的类型保护
 * TypeScript 里的类型保护本质上就是一些表达式，它们会在运行时检查类型信息，以确保在某个作用域里的类型是符合预期的
 * type is Type1Class就是类型谓词
 * 谓词为 parameterName is Type这种形式,parameterName必须是来自于当前函数签名里的一个参数名
 * 每当使用一些变量调用isType1时，如果原始类型兼容，TypeScript会将该变量缩小到该特定类型
 */
var b;
(function (b) {
    //没有相同字段可以定义一个类型保护函数
    function isBird(x) {
        return x.swing !== undefined;
    }
    function getAnimal(x) {
        if (isBird(x)) {
            x;
        }
        else {
            x;
        }
    }
    let a = { leg: 2 };
    getAnimal(a);
})(b || (b = {}));
/**
 * unknow
 * TypeScript 3.0 引入了新的unknown 类型，它是 any 类型对应的安全类型
 * unknown 和 any 的主要区别是 unknown 类型会更加严格：在对 unknown 类型的值执行大多数操作之前，我们必须进行某种形式的检查。
 * 而在对 any 类型的值执行操作之前，我们不必进行任何检查
 */
var c;
(function (c) {
    //在 TypeScript 中，任何类型都可以被归为 any 类型。这让 any 类型成为了类型系统的 顶级类型 (也被称作 全局超级类型)。
    //TypeScript允许我们对 any 类型的值执行任何操作，而无需事先执行任何形式的检查
    let value;
    value = true; // OK
    value = 42; // OK
    value = 'Hello World'; // OK
    value = []; // OK
    value = {}; // OK
    value = Math.random; // OK
    value = null; // OK
    value = undefined; // OK
    value.foo.bar; // OK
    value.trim(); // OK
    value(); // OK
    new value(); // OK
})(c || (c = {}));
var d;
(function (d) {
    //就像所有类型都可以被归为 any，所有类型也都可以被归为 unknown。这使得 unknown 成为 TypeScript 类型系统的另一种顶级类型（另一种是 any）
    let value;
    value = true; // OK
    value = 42; // OK
    value = 'Hello World'; // OK
    value = []; // OK
    value = {}; // OK
    value = Math.random; // OK
    value = null; // OK
    value = undefined; // OK
    value = new TypeError(); // OK
    //unknown类型只能被赋值给any类型和unknown类型本身
    let value1 = value; // OK
    let value2 = value; // OK
    // let value3: boolean = value // Error
    // let value4: number = value // Error
    // let value5: string = value // Error
    // let value6: object = value // Error
    // let value7: any[] = value // Error
    // let value8: Function = value // Error
})(d || (d = {}));
var e;
(function (e) {
    //如果没有类型断言或类型细化时，不能在unknown上面进行任何操作
    let word = 'hello word';
    let w = word;
    w.toLocaleUpperCase();
})(e || (e = {}));
/**
 * 只能对unknown进行等或不等操作，不能进行其它操作
 * 不能访问属性
 * 不能作为函数调用
 * 不能当作类的构造函数不能创建实例
 */
