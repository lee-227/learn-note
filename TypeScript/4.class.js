"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * "strictPropertyInitialization": true / 启用类属性初始化的严格检查 /
 */
class Persron {
    getName() {
        console.log(this.name);
    }
}
let p = new Persron();
p.name = "lee";
p.getName();
/**
 * 存取器可以改变类中一个属性的读取和赋值行为
 * 构造函数
 *   1. 用于初始化类的成员变量属性
 *   2. 类的对象创建时自动调用
 *   3. 没有返回值
 */
class User {
    constructor(myName) {
        this.myName = myName;
    }
    get name() {
        return this.myName;
    }
    set name(val) {
        this.myName = val;
    }
}
let user = new User("lee");
console.log(user.name);
user.name = "nb";
console.log(user.name);
/**
 * 参数属性
 */
class User2 {
    constructor(myName) {
        this.myName = myName;
    } // 省略this.myName = myName
}
/**
 * readonly
 * 1. readonly只能在构造函数中初始化
 * 2. ts中const是常量表示符，其值不能重新分配
 * 3. ts的类型系统也同样允许interface type class上的属性标识为readonly
 * 4. readonly实际上只是在编译阶段进行代码检查，而const则会在运行时检查
 */
class Animal {
    constructor(name) {
        this.name = name;
    }
    changeName(name) {
        // this.name = name
    }
}
/**
 * 继承
 * 子类继承父类后拥有父类的属性和方法，可以增强代码的复用性
 * 将子类共用的方法定义到父类上自己的特殊逻辑放到子类中重写父类的逻辑
 * super可以调用父类上的方法和属性
 */
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    getName() {
        return this.name;
    }
    setName(val) {
        this.name = val;
    }
}
class Student extends Person {
    constructor(name, age, no) {
        super(name, age);
        this.no = no;
    }
    getNo() {
        return this.no;
    }
}
let s1 = new Student("lee", 18, 1);
console.log(s1);
/**
 * 修饰符
 * public 任何地方都可以访问
 * protected 父类子类可以访问
 * private 只有本类可以访问
 */
class Father {
    constructor(name, age, money) {
        this.name = name;
        this.age = age;
        this.money = money;
    }
}
class Child extends Father {
    constructor(name, age, money) {
        super(name, age, money);
    }
    print() {
        // console.log(this.name, this.age, this.money)
    }
}
/**
 * 静态属性 静态方法
 */
class Father2 {
    static getClassName() {
        return Father2.className;
    }
}
Father2.className = "Father2";
let f = new Father2();
/**
 * 类装饰器，在类声明之前用来监视修改或替换定义
 */
var a;
(function (a_1) {
    function addNameEat(constructor) {
        constructor.prototype.name = "lee";
        constructor.prototype.eat = function () {
            console.log("吃吃吃");
        };
    }
    let A = class A {
        constructor() { }
    };
    A = __decorate([
        addNameEat
    ], A);
    let a = new A();
    console.log(a.name);
    a.eat();
})(a || (a = {}));
var b;
(function (b) {
    //装饰器工厂
    function addFactory(name) {
        return function addNameEat(constructor) {
            constructor.prototype.name = name;
            constructor.prototype.eat = function () {
                console.log("吃吃吃");
            };
        };
    }
    let A = class A {
        constructor() { }
    };
    A = __decorate([
        addFactory("lee2")
    ], A);
    let a = new A();
    console.log(a.name);
    a.eat();
})(b || (b = {}));
var c;
(function (c) {
    //装饰器替换类 要求两个类结构一致
    function addFactory(constructor) {
        return class B {
            constructor() {
                this.name = "lee3";
            }
            eat() {
                console.log("eat");
            }
        };
    }
    let A = class A {
        constructor() { }
    };
    A = __decorate([
        addFactory
    ], A);
    let a = new A();
    console.log(a.name);
    a.eat();
})(c || (c = {}));
/**
 * 属性装饰器
 * 属性装饰器表达式会在运行时当作函数被调用，传入下列2个参数
 * 属性装饰器用来装饰属性
    第一个参数对于静态成员来说是类的构造函数，对于实例成员是类的原型对象
    第二个参数是属性的名称
 * 方法装饰器用来装饰方法
    第一个参数对于静态成员来说是类的构造函数，对于实例成员是类的原型对象
    第二个参数是方法的名称
    第三个参数是方法描述符
 */
(function (c_1) {
    //装饰实例属性
    function upperCase(target, key) {
        console.log("------", target, key);
        let value = target[key];
        const getter = function () {
            return value;
        };
        const setter = function (val) {
            value = val.toUpperCase();
        };
        if (delete target[key]) {
            Object.defineProperty(target, key, {
                set: setter,
                get: getter,
                enumerable: true,
                configurable: true,
            });
        }
    }
    //装饰实例方法
    function noEnum(target, key, descriptor) {
        console.log("------", target, key, descriptor);
        console.log(target.getName);
        console.log(target.age);
        descriptor.enumerable = false;
    }
    //重写方法
    function toNumber(target, key, descriptor) {
        console.log("------", target, key, descriptor);
        let oldMethods = descriptor.value;
        descriptor.value = function (...args) {
            args = args.map((item) => parseFloat(item));
            return oldMethods.apply(this, args);
        };
    }
    class C {
        constructor() {
            this.name = "lee";
        }
        getName() {
            console.log(this.name);
        }
        sum(...args) {
            return args.reduce((accu, cur) => accu + cur, 0);
        }
    }
    C.age = 18;
    __decorate([
        upperCase
    ], C.prototype, "name", void 0);
    __decorate([
        noEnum
    ], C.prototype, "getName", null);
    __decorate([
        toNumber
    ], C.prototype, "sum", null);
    let c = new C();
    console.log(c.name);
    for (let arrt in c) {
        console.log(arrt);
    }
    c.name = "lee1";
    c.getName();
    console.log(c.sum("1", "2", "3"));
})(c || (c = {}));
/**
 * 参数装饰器
 * 会在运行时当作函数调用，可以使用参数装饰器为类的原型增加一些元数据
 * 第1个参数对于静态成员是类的构造函数，对于实例成员是类的原型对象
 * 第2个参数的名称
 * 第3个参数在函数列表中的索引
 */
var d;
(function (d) {
    function addAge(target, methodName, index) {
        console.log(target, methodName, index);
        target.age = 10;
    }
    class Person {
        login(username, password) {
            console.log(this.age, username, password);
        }
    }
    __decorate([
        __param(1, addAge)
    ], Person.prototype, "login", null);
    let c = new Person();
    c.login("lee", "password");
})(d || (d = {}));
/**
 * 装饰器的执行顺序
 * 1. 有多个参数装饰器时：从最后一个参数依次向前执行
 * 2. 方法和方法参数中参数装饰器先执行。
 * 3. 类装饰器总是最后执行
 * 4. 方法和属性装饰器，谁在前面谁先执行。因为参数属于方法一部分，所以参数会一直紧紧挨着方法执行
 */
var e;
(function (e) {
    function class1Descriptor() {
        return function (target) {
            console.log("类装饰器1");
        };
    }
    function class2Descriptor() {
        return function (target) {
            console.log("类装饰器2");
        };
    }
    function propertyDescriptor(name) {
        return function (target, key) {
            console.log(name + "属性装饰器");
        };
    }
    function methodDescriptor() {
        return function (target, key, descriptor) {
            console.log("方法装饰器");
        };
    }
    function argDescriptor(name) {
        return function (target, methodName, index) {
            console.log(name + "参数装饰器");
        };
    }
    let Person = class Person {
        constructor() {
            this.name = "lee";
            this.age = 18;
        }
        say(name, age) {
            console.log("hello");
        }
    };
    __decorate([
        propertyDescriptor("name")
    ], Person.prototype, "name", void 0);
    __decorate([
        propertyDescriptor("age")
    ], Person.prototype, "age", void 0);
    __decorate([
        methodDescriptor(),
        __param(0, argDescriptor("name")),
        __param(1, argDescriptor("age"))
    ], Person.prototype, "say", null);
    Person = __decorate([
        class1Descriptor(),
        class2Descriptor()
    ], Person);
})(e || (e = {}));
/**
 * 抽象类
 * 描述一种抽象的概念，无法被实例化，只能被继承
 * 无法创建抽象类的实例
 * 抽象方法不能在抽象类中实现，只能在抽象类的具体子类中实现，而且必须实现
 */
(function (e) {
    class Animal {
    }
    class Miao extends Animal {
        say() {
            console.log("我是猫");
        }
    }
    let m = new Miao();
    m.say();
})(e || (e = {}));
/**
 * 抽象类 VS 接口
 * 1. 不同类之间公有的属性或方法，可以抽象成一个接口（Interfaces）
 * 2. 而抽象类是供其他类继承的基类，抽象类不允许被实例化。抽象类中的抽象方法必须在子类中被实现
 * 3. 抽象类本质是一个无法被实例化的类，其中能够实现方法和初始化属性，而接口仅能够用于描述，既不提供方法的实现，也不为属性进行初始化
 * 4. 一个类可以继承一个类或抽象类，但可以实现（implements）多个接口
 * 5. 抽象类也可以实现接口
 */
var g;
(function (g) {
    class Animal {
        constructor(name) {
            this.name = name;
        }
    }
    class Duck extends Animal {
        constructor(name) {
            super(name);
        }
        speak() {
            console.log("我是" + this.name);
        }
        fly() {
            console.log("我会飞");
        }
    }
    let d = new Duck("duck");
    console.log(d.name);
    d.speak();
    d.fly();
})(g || (g = {}));
/**
 * 抽象方法
 * 1. 抽象类和方法不包含具体实现，必须在子类中实现
 * 2. 抽象方法只能出现在抽象类中
 * 3. 子类可以对抽象类进行不同的实现
 */
var h;
(function (h) {
    class Animal {
    }
    class Dog extends Animal {
        speak() {
            console.log("小狗汪汪汪");
        }
    }
    class Cat extends Animal {
        speak() {
            console.log("小猫喵喵喵");
        }
    }
    let dog = new Dog();
    let cat = new Cat();
    dog.speak();
    cat.speak();
})(h || (h = {}));
/**
 * 重写跟重载
 * 1. 重写是指子类重写继承自父类中的方法
 * 2. 重载是指为同一个函数提供多个类型定义
 */
var j;
(function (j) {
    class Animal {
        speak(word) {
            return "动作叫:" + word;
        }
    }
    class Cat extends Animal {
        speak(word) {
            return "猫叫:" + word;
        }
    }
    let cat = new Cat();
    console.log(cat.speak("hello"));
    function double(val) {
        if (typeof val == "number") {
            return val * 2;
        }
        return val + val;
    }
    let r = double(1);
    console.log(r);
})(j || (j = {}));
/**
 * 继承  多态
 * 1. 继承(Inheritance)子类继承父类，子类除了拥有父类的所有特性外，还有一些更具体的特性
 * 2. 多态(Polymorphism)由继承而产生了相关的不同的类，对同一个方法可以有不同的行为
 */
