export {}
/**
 * 接口
 * 1. 接口一方面可以在面向对象编程中表示为行为的抽象，另外可以用来描述对象的形状
 * 2. 接口就是把一些类中共有的属性和方法抽象出来,可以用来约束实现此接口的类
 * 3. 一个类可以继承另一个类并实现多个接口
 * 4. 接口像插件一样是用来增强类的，而抽象类是具体类的抽象概念
 * 5. 一个类可以实现多个接口，一个接口也可以被多个类实现，但一个类的可以有多个子类，但只能有一个父类
 */
interface Speakable {
  speak(): void;
  name?: string; //？表示可选属性
  [key: string]: any; //无法预先知道有哪些新的属性的时候,可以使用 `[propName:string]:any`,propName名字是任意的
}
interface Eatable {
  eat(): void;
}
let person: Speakable = {
  //接口可以用来描述`对象的形状`,少属性或者多属性都会报错
  speak() {},
  age: 1,
};
class Person implements Speakable, Eatable {
  //一个类可以实现多个接口
  speak() {}
  eat() {}
}

/**
 * 接口的继承。
 * 一个接口可以继承自另外一个接口
 */
namespace a {
  interface Speakable {
    speak(): void;
  }
  interface SpeakChinese extends Speakable {
    speakChinese(): void;
  }
  class Person implements SpeakChinese {
    speak() {}
    speakChinese() {}
  }
}

/**
 * readonly
 * 用 readonly 定义只读属性可以避免由于多人协作或者项目较为复杂等因素造成对象的值被重写
 */
namespace b {
  interface Person {
    readonly id: number;
    name: string;
  }
  let tom: Person = {
    id: 1,
    name: "lee",
  };
  // tom.id = 2
}

/**
 * 函数类型接口
 * 对方法传入的参数和返回值进行约束
 */
namespace c {
  interface Fun {
    (age: number): number;
  }
  let fun: Fun = function (age: number): number {
    return age;
  };
}

/**
 * 可索引接口
 * 对数组和对象进行约束
 */
namespace d {
  interface A {
    [index: string]: string;
  }
  let a: A = {
    lee: "lee",
  };
  // let arr: A = ["1", "2"];
  interface B {
    [index: number]: number;
  }
  let b: B = {
    1: 2,
  };
  let arr2: B = [1, 2];
}

/**
 * 类接口
 */
namespace e {
  interface Speak {
    name: string;
    speak(words: string): string;
  }
  class Person implements Speak {
    name: string = "lee";
    speak(words: string): string {
      return words;
    }
  }
}

/**
 * 构造函数的类型
 * 使用interface的new()关键字描述类的构造函数
 */
namespace f {
  class Animal {
    constructor(public name: string) {}
  }
  //不加new是修饰函数的,加new是修饰类的
  interface C {
    new (name: string): void;
  }
  function createAnima(clazz: C, name: string) {
    return new clazz(name);
  }
  createAnima(Animal, "lee");
}

/**
 * 抽象类 VS 接口
 * 1. 不同类之间公有的属性或方法，可以抽象成一个接口（Interfaces）
 * 2. 抽象类是供其他类继承的基类，抽象类不允许被实例化。抽象类中的抽象方法必须在子类中被实现
 * 3. 抽象类本质是一个无法被实例化的类，其中能够实现方法和初始化属性，而接口仅能够用于描述,既不提供方法的实现，也不为属性进行初始化
 * 4. 一个类可以继承一个类或抽象类，但可以实现（implements）多个接口
 * 5. 抽象类也可以实现接口
 */
namespace g {
  interface Duck {
    gaga(word: string): void;
  }
  abstract class Animal implements Duck {
    name?: string;
    abstract speak(word: string): string;
    abstract gaga(word: string): void;
  }

  class D extends Animal {
    speak(word: string): string {
      return word;
    }
    gaga(word: string) {}
  }
}
