"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
let sum = (a, b) => {
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
let defaultProps = {
    name: "lee",
    age: 18,
};
let props = {
    ...defaultProps,
    gender: "male",
};
// 7.小心使用返回值
// 尽管 TypeScript 一般情况下能推断函数的返回值，但是它可能并不是你想要的
function addOne(a) {
    return a + 1;
}
function sum2(a, b) {
    return a + addOne(b);
}
let p = {
    name: "lee",
    fly() { },
    talk() { },
};
// let c1: Tc = "lee";
let c2 = 1;
function mixin(one, two) {
    let result = {};
    for (let i in one) {
        result[i] = one[i];
    }
    for (let i in two) {
        result[i] = two[i];
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
function getName(p) {
    return p.name;
}
getName({
    name: "123",
    age: 1,
    gender: "femal",
});
let FrontEndJob = {
    name: "lee",
};
let name = "lee";
function getValueByKey(p, key) {
    return p[key];
}
let val = getValueByKey({
    name: "lee",
    age: 18,
    gender: "male",
}, "name");
let p2 = {};
let p3 = { name: "lee" };
var a;
(function (a) {
    function pick(o, keys) {
        return keys.map((key) => o[key]);
    }
    let user = {
        name: "lee",
        age: 18,
        gender: "male",
    };
    pick(user, ["name", "age"]);
})(a || (a = {}));
let condition = {
    //condition = Sky
    sky: "lee",
};
/**
 * 条件类型的分发
 */
let condition2; //condition2 = Water | Sky
/**
 * 内置条件类型
 * Exclude  从 T 可分配给的类型中排除 U
 * Extract  从 T 可分配的类型中提取 U
 * NonNullable  从 T 中排除 null 和 undefined
 * ReturnType  获取函数类型的返回类型
 * Parameters  Constructs a tuple type of the types of the parameters of a function type T
 * InstanceType  获取构造函数类型的实例类型
 */
var b;
(function (b) {
    let e = 10;
})(b || (b = {}));
var e;
(function (e_1) {
    let e = "1";
})(e || (e = {}));
var g;
(function (g) {
    function getUserInfo() {
        return { name: "zhufeng", age: 10 };
    }
    const userA = {
        name: "zhufeng",
        age: 10,
    };
})(g || (g = {}));
//InstanceType
var t;
(function (t) {
    class Person {
        constructor(name) {
            this.name = name;
        }
        getName() {
            return this.name;
        }
    }
    let p3 = {
        name: "lee",
        getName() {
            return "lee";
        },
    };
    let c = ["lee"];
})(t || (t = {}));
/**
 * Pick从传入的属性中摘取某一项返回
 */
var q;
(function (q) {
    function pick(obj, keys) {
        const result = {};
        keys.map((key) => {
            result[key] = obj[key];
        });
        return result;
    }
    let animal = {
        name: "miao",
        age: 18,
        gender: 1,
    };
    let a = pick(animal, ["age", "name"]);
})(q || (q = {}));
/**
 * Record 是 TypeScript 的一个高级类型
 * 他会将一个类型的所有属性值都映射到另一个类型上并创造一个新的类型
 */
var h;
(function (h) {
    function maoObject(obj, map) {
        let result = {};
        for (let key in obj) {
            result[key] = map(obj[key]);
        }
        return result;
    }
    let name = { 1: "hello", 2: "world" };
    let map = (x) => x.length;
    let o = maoObject(obj, map);
})(h || (h = {}));
function proxify(obj) {
    let result = {};
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
function unProxify(t) {
    let result = {};
    for (const k in t) {
        result[k] = t[k].get();
    }
    return result;
}
let originProps = unProxify(proxyProps);
console.log(originProps);
