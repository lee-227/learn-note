"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let person = {
    //接口可以用来描述`对象的形状`,少属性或者多属性都会报错
    speak() { },
    age: 1,
};
class Person {
    //一个类可以实现多个接口
    speak() { }
    eat() { }
}
/**
 * 接口的继承。
 * 一个接口可以继承自另外一个接口
 */
var a;
(function (a) {
    class Person {
        speak() { }
        speakChinese() { }
    }
})(a || (a = {}));
/**
 * readonly
 * 用 readonly 定义只读属性可以避免由于多人协作或者项目较为复杂等因素造成对象的值被重写
 */
var b;
(function (b) {
    let tom = {
        id: 1,
        name: "lee",
    };
    // tom.id = 2
})(b || (b = {}));
/**
 * 函数类型接口
 * 对方法传入的参数和返回值进行约束
 */
var c;
(function (c) {
    let fun = function (age) {
        return age;
    };
})(c || (c = {}));
/**
 * 可索引接口
 * 对数组和对象进行约束
 */
var d;
(function (d) {
    let a = {
        lee: "lee",
    };
    let b = {
        1: 2,
    };
    let arr2 = [1, 2];
})(d || (d = {}));
/**
 * 类接口
 */
var e;
(function (e) {
    class Person {
        constructor() {
            this.name = "lee";
        }
        speak(words) {
            return words;
        }
    }
})(e || (e = {}));
/**
 * 构造函数的类型
 * 使用interface的new()关键字描述类的构造函数
 */
var f;
(function (f) {
    class Animal {
        constructor(name) {
            this.name = name;
        }
    }
    function createAnima(clazz, name) {
        return new clazz(name);
    }
    createAnima(Animal, "lee");
})(f || (f = {}));
/**
 * 抽象类 VS 接口
 * 1. 不同类之间公有的属性或方法，可以抽象成一个接口（Interfaces）
 * 2. 抽象类是供其他类继承的基类，抽象类不允许被实例化。抽象类中的抽象方法必须在子类中被实现
 * 3. 抽象类本质是一个无法被实例化的类，其中能够实现方法和初始化属性，而接口仅能够用于描述,既不提供方法的实现，也不为属性进行初始化
 * 4. 一个类可以继承一个类或抽象类，但可以实现（implements）多个接口
 * 5. 抽象类也可以实现接口
 */
var g;
(function (g) {
    class Animal {
    }
    class D extends Animal {
        speak(word) {
            return word;
        }
        gaga(word) { }
    }
})(g || (g = {}));
