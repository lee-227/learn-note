export {}
let flag: boolean = true
let age: number = 1
let myName: string = 'lee'
let arr: number[] = [1, 2, 3]
let arr2: Array<number> = [1, 2, 3]
let tuple: [string, symbol] = ['lee', Symbol(1)] //tuple(元组)表示一个已知数量跟类型的数组

/**
  普通枚举
 */
enum Gender {
  GIRL,
  BOY,
}
console.log(Gender.GIRL, Gender.BOY)
enum Week {
  MONDAY = 1,
  TUESDAY = 2,
}
console.log(Week.MONDAY, Week.TUESDAY)
/**
  常数枚举与普通枚举的区别是，它会在编译阶段被删除，并且不能包含计算成员
 */
const enum Colors {
  Red,
  Blue,
  Black = 1,
}
console.log(Colors.Red, Colors.Blue, Colors.Black)
// const enum Color {Red, Yellow, Blue = "blue".length}

/**
  any任意类型，第三方库没有提供类型文件时可以使用any，类型转换困难时，数据结构复杂难以定义时
 */
// let root: any = document.getElementById('root')
// root.style.color = 'red'

/**
  null跟udefined是其他类型的子类型，可以赋值给其他类型，赋值后类型变为null或者undefined
  tsconfig中的strictNullCheck为true时 null跟undefined只能赋值给自己
 */
let x: number = 1
// x = null
// x = undefined

/**
  void表示没有任何类型
  当一个函数没有返回值时，TS会认为他返回值为void类型
 */
function fn(): void {}

/**
 * never是其他类型（null,undefined）的子类型,代表不会出现的值。
 * 1.作为不会返回的函数的返回值类型
 * 2.ts中null跟undefined是任何类型的有效值，所以无法正确的监测他们是否被错误的使用，于是引用了strictNullChecks这种模式，
 *   这种模式下null跟undefined都会被检测到所以引入了never作为一种新的底部类型
 * 3.never void 区别 void可以被赋值为null和undefined的类型，never则是一个不包含任何值的类型。
 *   拥有void的返回值类型的函数可以正常运行。拥有never返回值类型的函数无法正常运行，无法终止，会抛出异常
 */
function fn2(x: number | string): void {
  if (typeof x === 'number') {
    console.log(x)
  } else if (typeof x === 'string') {
    console.log(x)
  } else {
    console.log(x) //never
  }
}

/**
 * 在使用Symbol时必须添加es6编译辅助库
 */
const sym1 = Symbol('key')
const sym2 = Symbol('key')
// console.log(sym1 == sym2);

/**
 * Bigint可以更安全的存储和操作大整数
 * 使用Bigint时必须添加‘ESNEXT’编译辅助库
 * 使用‘1n’需要target:'ESNEXT'
 * number 跟 bigint 类型不一样 不兼容
 */
const max = Number.MAX_SAFE_INTEGER
console.log(max + 1 === max + 2)
const max2 = BigInt(Number.MAX_SAFE_INTEGER)
// console.log(max2 + BigInt(1) === max2 + BigInt(2))
console.log(max2 + 1n === max2 + 2n)

/**
 * 类型推论是指编程语言能够自动推导出值的类型的能力，他是一些静态编程语言中体现的特征
 * 定义时未赋值就会推论成any类型
 * 如果定义时就赋值就能利用类型推论
 */
let x2
x2 = 2
x2 = 'string'
x2 = true

/**
 * 包装对象
 * JS类型分为两种，原始数据类型和对象类型
 * 所有的原始数据类型都没有属性 例如 null undefined boolean string number symbol
 * 当调用原始数据类型方法时js会在原始数据类型和对象数据类型之间做一个迅速强制性切换
 */
let isOk: boolean = true
let isOk2: boolean = Boolean(2)
// let isOk3: boolean = new Boolean(1) //编译失败

/**
 * 联合类型
 * 表示取值可以取多种类型中的一种
 * 未赋值时联合类型只能访问两个类型中的共有属性跟方法
 */
let y: number | string
// console.log(y.toString());
y = 3
console.log(y.toFixed(2))
y = 'lee'
console.log(y.toUpperCase())

/**
 * 类型断言
 * 将一个联合类型的变量指定为一个更加具体的类型
 * 不能将联合类型断言为一个不存在的类型
 */
let z: number | string
// console.log((z as number).toFixed());
// console.log((z as string).toLowerCase());
// console.log(z as boolean);

/**
 * 字面量类型跟类型字面量
 * 字面量类型要和实际的值的字面看一一对应不一致就报错
 * 类型字面量跟对象字面量语法很相似
 */
const up: 'UP' = 'UP'
const down: 'DOWN' = 'DOWN'

type Direction = 'UP' | 'DOWN'
function move(d: Direction): void {
  console.log(d)
}
move('UP')

type Direction2 = {
  name: string
  age: number
}

/**
 * 字符串字面量类型用来约束取值只能是某几个字符串中的一个，联合类型用来约束取值可以为某几个类型中的一种类型
 * 字符串字面量约束的是取值，联合类型约束的是类型不是值
 */

 