export default {};
/**
 * 1. CapitalizeString 首字母大写
 */

namespace space1 {
    type CapitalizeString<T> = T extends `${infer L}${infer R}` ? `${Uppercase<L>}${R}` : never;
    type str1 = CapitalizeString<'abcd'>;
    type str2 = CapitalizeString<'aaaa'>;
    type num = CapitalizeString<123>;
}

/**
 * 2. FirstChar 获取字符串字面量中的第一个字符
 */

namespace space2 {
    type FirstChar<T> = T extends `${infer L}${infer R}` ? L : never;
    type str1 = FirstChar<'abcd'>;
    type str2 = FirstChar<'baaa'>;
    type num = FirstChar<123>;
}

/**
 * 3. LastChar 获取字符串字面量中的最后一个字符
 */

namespace space3 {
    type LastChar<T, Prev = never> = T extends `${infer L}${infer R}` ? LastChar<R, L> : Prev;
    type str1 = LastChar<'abcd'>;
    type str2 = LastChar<'baac'>;
    type num = LastChar<123>;
}

/**
 * 4. StringToTuple 字符串转换为元组类型
 */

namespace space4 {
    type StringToTuple<T, P extends any[] = []> = T extends `${infer L}${infer R}` ? StringToTuple<R, [...P, L]> : P;
    type A = StringToTuple<'BFE.dev'> // ['B', 'F', 'E', '.', 'd', 'e','v']
    type B = StringToTuple<''> // []
}

/**
 * 5. StringToTuple 将字符串类型的元素转换为字符串字面量类型
 */

namespace space5 {
    type TupleToString<T, P extends string = ''> = T extends [infer L, ...infer R] ?
        L extends string ? TupleToString<R, `${P}${L}`> : never
        : P;
    type A = TupleToString<['a', 'b', 'c']> // 'abc'
    type B = TupleToString<[]>              // ''
    type C = TupleToString<['a']>           // 'a'
}
/**
 * 6. RepeatString 复制字符T为字符串类型，长度为C
 */

namespace space6 {
    type RepeatString<T extends string, P extends number, Arr extends any[] = [], Str extends string = ''> =
        P extends Arr['length'] ? Str : RepeatString<T, P, [...Arr, null], `${Str}${T}`>
    type A = RepeatString<'ab', 3> // 'aaa'
    type B = RepeatString<'a', 0> // ''
}

/**
 * 7. SplitString 将字符串字面量类型按照指定字符，分割为元组。无法分割则返回原字符串字面量
 */

namespace space7 {
    type SplitString<T, S extends string, Prev extends string[] = []> =
        T extends `${infer L}${S}${infer R}` ? SplitString<R, S, [...Prev, L]> : [...Prev, T];
    type A1 = SplitString<'handle-open-flag', '-'>        // ["handle", "open", "flag"]
    type A2 = SplitString<'open-flag', '-'>               // ["open", "flag"]
    type A3 = SplitString<'handle.open.flag', '.'>        // ["handle", "open", "flag"]
    type A4 = SplitString<'open.flag', '.'>               // ["open", "flag"]
    type A5 = SplitString<'open.flag', '-'>               // ["open.flag"]
}

/**
 * 8. LengthOfString 计算字符串字面量类型的长度
 */

namespace space8 {
    type LengthOfString<T, Prev extends string[] = []> =
        T extends `${infer L}${infer R}` ? LengthOfString<R, [...Prev, L]> : Prev['length'];
    type A = LengthOfString<'BFE.dev'> // 7
    type B = LengthOfString<''> // 0
}

/**
 * 9. KebabCase 驼峰命名转横杠命名
 */

namespace space9 {
    type KebabCase1<T, S extends string = '', Arr extends any[] = []> =
        T extends `${infer L}${infer R}` ? KebabCase1<R,
            Arr['length'] extends 0 ? `${Lowercase<L>}` : L extends Uppercase<L> ? `${S}-${Lowercase<L>}` : `${S}${L}`,
            [...Arr, L]
        > : S;
    type KebabCase2<T, S extends string = ''> =
        T extends `${infer L}${infer R}` ? KebabCase2<R,
            L extends Uppercase<L> ? `${S}-${Lowercase<L>}` : `${S}${L}`
        > : S extends `${infer L}${infer R}` ? R : S;
    type a1 = KebabCase2<'HandleOpenFlag'>           // handle-open-flag
    type a2 = KebabCase2<'OpenFlag'>                 // open-flag
}

/**
 * 10. CamelCase 横杠命名转化为驼峰命名
 */

namespace space10 {
    type CapitalizeString<T> = T extends `${infer L}${infer R}` ? `${Uppercase<L>}${R}` : never;
    type CamelCase<T extends string, S extends string = ''> =
        T extends `${infer L}-${infer T}${infer R}` ? CamelCase<R, `${S}${L}${Uppercase<T>}`> : CapitalizeString<`${S}${T}`>;
    type a1 = CamelCase<'handle-open-flag'>         // HandleOpenFlag
    type a2 = CamelCase<'open-flag'>                // OpenFlag
}

/**
 * 11. ObjectAccessPaths 得到对象中的值访问字符串
 */

namespace space11 {
    // 简单来说，就是根据如下对象类型：
    /*
    {
        home: {
            topBar: {
                title: '顶部标题',
                welcome: '欢迎登录'
            },
            bottomBar: {
                notes: 'XXX备案，归XXX所有',
            },
        },
        login: {
            username: '用户名',
            password: '密码'
        }
    }
    */
    // 得到联合类型：
    /*
    home.topBar.title | home.topBar.welcome | home.bottomBar.notes | login.username | login.password
    */
    type ObjectAccessPaths<T, R extends string = ``, K = keyof T> =
        K extends keyof T ?
        K extends string ?
        T[K] extends Record<string, any> ?
        ObjectAccessPaths<T[K], `${R}.${K}`>
        : `${R}.${K}` extends `.${infer R}` ? R : never
        : never
        : never;
    // 完成 createI18n 函数中的 ObjectAccessPaths<Schema>，限制函数i18n的参数为合法的属性访问字符串
    function createI18n<Schema>(schema: Schema): ((path: ObjectAccessPaths<Schema>) => string) { return [{ schema }] as any }

    // i18n函数的参数类型为：home.topBar.title | home.topBar.welcome | home.bottomBar.notes | login.username | login.password
    const i18n = createI18n({
        home: {
            topBar: {
                title: '顶部标题',
                welcome: '欢迎登录'
            },
            bottomBar: {
                notes: 'XXX备案，归XXX所有',
            },
        },
        login: {
            username: '用户名',
            password: '密码'
        }
    })

    i18n('home.topBar.title')           // correct
    i18n('home.topBar.welcome')         // correct
    i18n('home.bottomBar.notes')        // correct

    // i18n('home.login.abc')              // error，不存在的属性
    // i18n('home.topBar')                 // error，没有到最后一个属性
}

/**
 * 12. ComponentEmitsType 定义组件的监听事件类型
 */

namespace space10 {
    // 实现 ComponentEmitsType<Emits> 类型，将
    /*
    {
        'handle-open': (flag: boolean) => true,
        'preview-item': (data: { item: any, index: number }) => true,
        'close-item': (data: { item: any, index: number }) => true,
    }
    */
    // 转化为类型
    /*
    {
        onHandleOpen?: (flag: boolean) => void,
        onPreviewItem?: (data: { item: any, index: number }) => void,
        onCloseItem?: (data: { item: any, index: number }) => void,
    }
    */
    type CapitalizeString<T> = T extends `${infer L}${infer R}` ? `${Uppercase<L>}${R}` : never;
    type CamelCase<T extends string, S extends string = ''> =
        T extends `${infer L}-${infer T}${infer R}` ? CamelCase<R, `${S}${L}${Uppercase<T>}`> : CapitalizeString<`${S}${T}`>;
    type ComponentEmitsType<T> = {
        [K in keyof T as K extends string ? `on${CamelCase<K>}` : '']?: T[K] extends (...args: infer A) => true ? (...args: A) => void : T[K]
    }
    type a = ComponentEmitsType<{
        'handle-open': (flag: boolean) => true,
        'preview-item': (data: { item: any, index: number }) => true,
        'close-item': (data: { item: any, index: number }) => true,
    }>
}

/**
 * 13. LengthOfTuple
 */
namespace space13 {
    type LengthOfTuple<T> = T extends any[] ? T['length'] : T
    type A = LengthOfTuple<['B', 'F', 'E']> // 3
    type B = LengthOfTuple<[]> // 0
}

/**
 * 14. FirstItem 得到元组类型中的第一个元素
 */
namespace space14 {
    type FirstItem<T> = T extends [infer R, ...any[]] ? R : T
    type A = FirstItem<[string, number, boolean]> // string
    type B = FirstItem<['B', 'F', 'E']> // 'B'
}

/**
 * 15. LastItem 得到元组类型中的最后一个元素
 */
namespace space15 {
    type LastItem<T, P = never> = T extends [infer L, ...infer R] ? LastItem<R, L> : P
    type A = LastItem<[string, number, boolean]> // boolean
    type B = LastItem<['B', 'F', 'E']> // 'E'
    type C = LastItem<[]> // never
}

/**
 * 16. Shift 移除元组类型中的第一个类型
 */
namespace space16 {
    type Shift<T> = T extends [infer L, ...infer R] ? R : T
    type A = Shift<[1, 2, 3]> // [2,3]
    type B = Shift<[1]> // []
    type C = Shift<[]> // []
}

/**
 * 17. Push 在元组类型T中添加新的类型I
 */
namespace space17 {
    type Push<T, P> = T extends any[] ? [...T, P] : T
    type A = Push<[1, 2, 3], 4> // [1,2,3,4]
    type B = Push<[1], 2> // [1, 2]
}

/**
 * 18. ReverseTuple 反转元组
 */
namespace space18 {
    type ReverseTuple<T, P extends any[] = []> = T extends [infer L, ...infer R] ? ReverseTuple<R, [L, ...P]> : P
    type A = ReverseTuple<[string, number, boolean]> // [boolean, number, string]
    type B = ReverseTuple<[1, 2, 3]> // [3,2,1]
    type C = ReverseTuple<[]> // []
}

/**
 * 19. Flat 拍平元组
 */
namespace space19 {
    type Flat<T, P extends any[] = []> = T extends [infer L, ...infer R] ?
        [...(L extends any[] ? Flat<L> : [L]), ...Flat<R>, ...P]
        : T
    type A = Flat<[1, 2, 3]> // [1,2,3]
    type B = Flat<[1, [2, 3], [4, [5, [6]]]]> // [1,2,3,4,5,6]
    type C = Flat<[]> // []
    type D = Flat<[1]> // [1]
}

/**
 * 20. Repeat<T,C> 复制类型T为C个元素的元组类型
 */
namespace space20 {
    type Repeat<T, N, P extends any[] = []> = N extends P['length'] ? P : Repeat<T, N, [...P, T]>
    type A = Repeat<number, 3> // [number, number, number]
    type B = Repeat<string, 2> // [string, string]
    type C = Repeat<1, 1> // [1]
    type D = Repeat<0, 0> // []
}

/**
 * 21. Filter<T,A> 保留元组类型T中的A类型
 */
namespace space21 {
    type Filter<T, K, P extends any[] = []> = T extends [infer L, ...infer R] ?
        L extends K ? Filter<R, K, [...P, L]> : Filter<R, K, [...P]>
        : P
    type A = Filter<[1, 'BFE', 2, true, 'dev'], number> // [1, 2]
    type B = Filter<[1, 'BFE', 2, true, 'dev'], string> // ['BFE', 'dev']
    type C = Filter<[1, 'BFE', 2, any, 'dev'], string> // ['BFE', any, 'dev']
}

/**
 * 22. FindIndex<T,E> 找出E类型在元组类型T中的下标
 */
namespace space22 {
    type Equal<T, E> = [T] extends [E] ? [E] extends [T] ?
        keyof T extends keyof E ? keyof E extends keyof T ? true : false : false
        : false : false;
    type FindIndex<T, N, D extends any[] = []> = T extends [infer L, ...infer R] ?
        Equal<L, N> extends true ? D['length'] : FindIndex<R, N, [...D, null]>
        : never
    type A = [any, never, 1, '2', true]
    type B = FindIndex<A, 1> // 2
    type C = FindIndex<A, 3> // never
}

/**
 * 23. Equal<T, E> 判断 T 跟 E 是否是同样的类型
 */
namespace space23 {
    type Equal<T, E> = [T] extends [E] ? [E] extends [T] ?
        keyof T extends keyof E ? keyof E extends keyof T ? true : false : false
        : false : false;

    type A = Equal<any, any> // true
    type B = Equal<any, 1> // false
    type C = Equal<never, never> // true
    type D = Equal<'BFE', 'BFE'> // true
    type E = Equal<'BFE', string> // false
    type F = Equal<1 | 2, 2 | 1> // true
    type G = Equal<{ a: number }, { a: number }> // true

    /*
    *  使用 [T] extends [K] ? [K] extends [T]， 而不是直接使用 T extends K ? K extends T，具体原因是因为泛型条件类型前者不会分布，后者会分布
    *
    *  使用 `keyof T extends keyof K ? keyof K extends keyof T`判断的原因是用来区别 any与其他类型；
    *  keyof any 得到的是 string|number|symbol
    *  keyof number 得到的是 toString | toFixed | ...
    */
    type E1<T, K> = [T] extends [K] ? [K] extends [T] ? 'a' : 'b' : 'c'
    type E2<T, K> = T extends K ? (K extends T ? 'a' : 'b') : 'c'

    type e1 = E1<1 | 2, 2 | 1>          // a：不会分布
    type e2 = E2<1 | 2, 2 | 1>          // a,b：会分布（即使是分布，那也应该是只有a呀？）；可能情况是这样的，在T extends K之后的 K extends T的后面的T，已经是收窄了；
    // 第一步：(1 extends 2|1 ? {{1}} : 'c') | (2 extends 2|1 ? {{2}} : 'c')第一步两个都通过了
    // 第二步：此时{{1}} 应该是 2|1 extends 1，{{2}} 应该是 2|1 extends 2，两个结果都是 'a'|'b'，所以最后结果是这个

    type isExtend<T, K> = T extends K ? 'a' : 'b'
    type h1 = isExtend<1 | 2 | 3, 1 | 2 | 4>                    // 是ab
    type h2 = 1 | 2 | 3 extends 1 | 2 | 4 ? 'a' : 'b'           // b，难道不是 a,b吗？，由此可见，直接判断确定的类型与通过泛型类型的方式来判断是不一样的，直接类型不会分布，泛型会分布
}

/**
 * 24. TupleToEnum 元组类型转换为枚举类型
 */
namespace space24 {
    type A = ['str1', 'str2', 'str3'][number] // 元组中的所有类型转换为联合类型
    type Equal<T, E> = [T] extends [E] ? [E] extends [T] ?
        keyof T extends keyof E ? keyof E extends keyof T ? true : false : false
        : false : false;
    type FindIndex<T, N, D extends any[] = []> = T extends [infer L, ...infer R] ?
        Equal<L, N> extends true ? D['length'] : FindIndex<R, N, [...D, null]>
        : never
    type TupleToEnum<T extends string[], E = false> = {
        readonly [Key in T[number]]: E extends true ? FindIndex<T, Key> : Key
    }
    // 默认情况下，枚举对象中的值就是元素中某个类型的字面量类型
    type a1 = TupleToEnum<["MacOS", "Windows", "Linux"]>
    // -> { readonly MacOS: "MacOS", readonly Windows: "Windows", readonly Linux: "Linux" }

    // 如果传递了第二个参数为true，则枚举对象中值的类型就是元素类型中某个元素在元组中的index索引，也就是数字字面量类型
    type a2 = TupleToEnum<["MacOS", "Windows", "Linux"], true>
    // -> { readonly MacOS: 0, readonly Windows: 1, readonly Linux: 2 }
}

/**
 * 25. Slice 截取元组中的部分元素
 */
namespace space25 {
    type Slice<T extends any[], S, E = T['length'], R extends any[] = [], B extends any[] = [], G extends any[] = []> =
        T extends [infer L, ...infer F] ?
        G['length'] extends E ?
        [...R, L]
        : B['length'] extends S ?
        Slice<F, S, E, [...R, L], [...B], [...G, '']>
        : Slice<F, S, E, [...R], [...B, ''], [...G, '']>
        : R
    type A1 = Slice<[any, never, 1, '2', true, boolean], 0, 2>          // [any,never,1]                    从第0个位置开始，保留到第2个位置的元素类型
    type A2 = Slice<[any, never, 1, '2', true, boolean], 1, 3>          // [never,1,'2']                    从第1个位置开始，保留到第3个位置的元素类型
    type A3 = Slice<[any, never, 1, '2', true, boolean], 1, 2>          // [never,1]                        从第1个位置开始，保留到第2个位置的元素类型
    type A4 = Slice<[any, never, 1, '2', true, boolean], 2>             // [1,'2',true,boolean]             从第2个位置开始，保留后面所有元素类型
    type A5 = Slice<[any], 2>                                           // []                               从第2个位置开始，保留后面所有元素类型
    type A6 = Slice<[], 0>                                              // []                               从第0个位置开始，保留后面所有元素类型
}

/**
 * 26. Splice 删除并且替换部分元素
 */
namespace space26 {
    type Splice<T extends any[], S, E, P extends any[] = [], Start extends any[] = [], End extends any[] = [], Insert extends any[] = [], Res extends any[] = []> =
        T extends [infer L, ...infer R] ?
        Start['length'] extends S ?
        Insert['length'] extends S ?
        Splice<[L, ...R], S, E, P, Start, End, [...Insert, ''], [...Res, ...P]>
        : End['length'] extends E ?
        [...Res, L, ...R]
        : Splice<R, S, E, P, Start, [...End, ''], [...Insert, ''], [...Res]>
        : Splice<R, S, E, P, [...Start, ''], End, [...Insert, ''], [...Res, L]>
        : Res
    type A1 = Splice<[string, number, boolean, null, undefined, never], 0, 2>
    // [boolean,null,undefined,never]               从第0开始删除，删除2个元素
    type A2 = Splice<[string, number, boolean, null, undefined, never], 1, 3>
    // [string,undefined,never]                     从第1开始删除，删除3个元素
    type A3 = Splice<[string, number, boolean, null, undefined, never], 1, 2, [1, 2, 3]>
    // [string,1,2,3,null,undefined,never]          从第1开始删除，删除2个元素，替换为另外三个元素1,2,3
}

/**
 * 27. OptionalKeys 获取对象类型中的可选属性的联合类型
 */
namespace space27 {
    type ExcludeUndefined<T> = {
        [K in keyof T]: Exclude<T[K], undefined>
    }
    type A = ExcludeUndefined<{ foo: number | undefined, bar?: string, flag: boolean }>
    type OptionalKeys1<T> = { [K in keyof T]-?: undefined extends ExcludeUndefined<T>[K] ? K : never }[keyof T]
    type OptionalKeys2<T, K = keyof T> = K extends keyof T ? undefined extends ExcludeUndefined<T>[K] ? K : never : never
    // 忽略可选属性依旧可以赋值给改属性 而 必选属性不可以
    type OptionalKeys<T, K = keyof T> = K extends keyof T ? Omit<T, K> extends T ? K : never : never
    type a1 = OptionalKeys<{ foo: number | undefined, bar?: string, flag: boolean }>        // bar
    type a2 = OptionalKeys<{ foo: number, bar?: string }>                                   // bar
    type a3 = OptionalKeys<{ foo: number, flag: boolean }>                                  // never
    type a4 = OptionalKeys<{ foo?: number, flag?: boolean }>                                // foo|flag
    type a5 = OptionalKeys<{}>                                                              // never
}

/**
 * 28. PickOptional 保留一个对象中的可选属性类型
 */
namespace space28 {
    type ExcludeUndefined<T> = {
        [K in keyof T]: Exclude<T[K], undefined>
    }
    type OptionalKeys<T> = { [K in keyof T]-?: undefined extends ExcludeUndefined<T>[K] ? K : never }[keyof T]
    type PickOptional<T> = Pick<T, OptionalKeys<T>>
    type a1 = PickOptional<{ foo: number | undefined, bar?: string, flag: boolean }>        // {bar?:string|undefined}
    type a2 = PickOptional<{ foo: number, bar?: string }>                                   // {bar?:string}
    type a3 = PickOptional<{ foo: number, flag: boolean }>                                  // {}
    type a4 = PickOptional<{ foo?: number, flag?: boolean }>                                // {foo?:number,flag?:boolean}
    type a5 = PickOptional<{}>                                                              // {}v
}

/**
 * 29. RequiredKeys 获取对象类型中的必须属性的联合类型
 */
namespace space29 {
    type ExcludeUndefined<T> = {
        [K in keyof T]: Exclude<T[K], undefined>
    }
    type RequiredKeys<T, K = keyof T> = K extends keyof T ? undefined extends ExcludeUndefined<T>[K] ? never : K : never
    type a1 = RequiredKeys<{ foo: number | undefined, bar?: string, flag: boolean }>        // foo|flag
    type a2 = RequiredKeys<{ foo: number, bar?: string }>                                   // foo
    type a3 = RequiredKeys<{ foo: number, flag: boolean }>                                  // foo|flag
    type a4 = RequiredKeys<{ foo?: number, flag?: boolean }>                                // never
    type a5 = RequiredKeys<{}>                                                              // never
}

/**
 * 30. PickRequired 保留一个对象中的必须属性
 */
namespace space30 {
    type ExcludeUndefined<T> = {
        [K in keyof T]: Exclude<T[K], undefined>
    }
    type RequiredKeys<T, K = keyof T> = K extends keyof T ? undefined extends ExcludeUndefined<T>[K] ? never : K : never
    type PickRequired<T> = Pick<T, RequiredKeys<T>>
    type a1 = PickRequired<{ foo: number | undefined, bar?: string, flag: boolean }>        // {foo:number|undefined,flag:boolean}
    type a2 = PickRequired<{ foo: number, bar?: string }>                                   // {foo:number}
    type a3 = PickRequired<{ foo: number, flag: boolean }>                                  // {foo:number,flag:boolean}
    type a4 = PickRequired<{ foo?: number, flag?: boolean }>                                // {}
    type a5 = PickRequired<{}>                                                              // {}
}

/**
 * 31. Merge 合并两个对象类型T以及K，如果属性重复，则以K中属性类型为准；
 */
namespace space31 {
    type obj1 = {
        el: string,
        age: number
    }

    type obj2 = {
        el: HTMLElement,
        flag: boolean
    }

    type Merge<T, K> = {
        [Key in Exclude<keyof T, keyof K>]: T[Key]
    } & K

    type obj3 = Merge<obj1, obj2>   // {el:HtmlElement,age:number,flag:boolean}

    const a = { ...{} as obj3 }
    console.log(a.el.scrollTop, a.age.toFixed(0), a.flag.valueOf())
    // console.log(a.el.charAt(0))     // error
}

/**
 * 32. IsNever 判断是否为never类型
 */
namespace space32 {
    type IsNever<T> = [T] extends [never] ? true : false
    type A = IsNever<never>             // true
    type B = IsNever<string>            // false
    type C = IsNever<undefined>         // false
    type D = IsNever<any>               // false
}

/**
 * 33. IsEmptyType 判断是否为没有属性的对象类型{}
 */
namespace space33 {
    type IsEmptyType<T> = [keyof T] extends [never] ?
        number extends T ?
        unknown extends T ? false : true
        : false
        : false
    type A = IsEmptyType<string>            // false
    type B = IsEmptyType<{ a: 3 }>          // false
    type C = IsEmptyType<{}>                // true
    type D = IsEmptyType<any>               // false
    type E = IsEmptyType<object>            // false
    type F = IsEmptyType<Object>            // false
    type G = IsEmptyType<unknown>           // false
}

/**
 * 34. IsAny 判断是否为any类型
 */
namespace space34 {
    type IsAny<T> = [unknown] extends [T] ? [T] extends [string] ? true : false : false
    type A = IsAny<string>      // false
    type B = IsAny<any>         // true
    type C = IsAny<unknown>     // false
    type D = IsAny<never>       // false
}

/**
 * 35. Redux Connect 实现Connect类型，能够自动地转化Redux Module对象中的函数类型
 */
namespace space35 {
    interface Module {
        count: number;
        message: string;

        asyncMethod<T, U>(input: Promise<T>): Promise<Action<U>>;

        syncMethod<T, U>(action: Action<T>): Action<U>;
    }

    interface Action<T> {
        payload?: T;
        type: string;
    }

    type FuncKeys<T, K = keyof T> = K extends keyof T ? T[K] extends (...args: any) => any ? K : never : never
    type FuncType<Func> = Func extends <T, U>(input: Promise<T>) => Promise<Action<U>> ?
        <T, U>(input: T) => Action<U> :
        Func extends <T, U>(action: Action<T>) => Action<U> ?
        <T, U>(action: T) => Action<U> :
        never
    type Connect<T> = {
        [K in FuncKeys<T>]: FuncType<T[K]>
    }

    type Res = Connect<Module>
    // 这个要求的结果
    type Result = {
        asyncMethod<T, U>(input: T): Action<U>;
        syncMethod<T, U>(action: T): Action<U>;
    }

    // 实现类型Connect，要求 Connect<Module> 的结果为上面的 Result
    // 只要函数类型的属性；
    // 如果函数是异步函数，要求自动解析出来Promise中的类型；
}

/**
 * 36. UnionToBooleanProps 有且只有一个属性
 */
namespace space36 {

    // 实现一个叫做 UnionToBooleanProps 的泛型，使得以下需求成立
    type MessageStringType = "info" | "success" | "warning" | "error";

    type UnionToBooleanProps<T extends string, K extends string = T> = K extends T ?
        {
            [Key1 in K]: true
        } & {
            [Key2 in Exclude<T, K>]?: false
        }
        : never

    type OneMessageTypes = UnionToBooleanProps<MessageStringType>

    // type OneMessageTypes =
    //     { info: true, success?: never, warning?: never, error?: never } |
    //     { info?: never, success: true, warning?: never, error?: never } |
    //     { info?: never, success?: never, warning: true, error?: never } |
    //     { info?: never, success?: never, warning?: never, error: true }

    type Props = OneMessageTypes & { id: string; }
    function Component(props: Props) {
        return <></>
    }

    const a = <Component id="abc" info />           // correct
    const b = <Component id="abc" success />        // correct
    // const c = <Component id="abc" />                // wrong
    // const d = <Component id="abc" info success />   // wrong

    // 组件Component所接收的属性，有且只有一个 "info" | "success" | "warning" | "error" 中的值；
}

/**
 * 37. UnionToIntersection 将联合类型转换为交叉类型
 */
namespace space37 {
    type UnionToIntersection<T> = (T extends any ? (p: T) => T : never) extends (p: infer R) => infer T ? R : never
    type A = UnionToIntersection<{ a: string } | { b: string } | { c: string }>
    // {a: string} & {b: string} & {c: string}
}

/**
 * 38. UnionPop 取出来联合类型中的任意一个类型
 */
namespace space38 {
    type UnionPop<T> = ((T extends any ?
        ((k: (a: T) => void) => void)
        : never) extends (k: infer I) => void ? I
        : never) extends (a: infer J) => void ? J
        : never
    type A1 = UnionPop<1 | 2 | 3>;
    type A2 = UnionPop<string | number | boolean>;
    type A3 = UnionPop<string | number | boolean | any>;

    type p1 = { name: 1 }
    type p2 = { age: 2 }
    type p3 = { flag: true }

    type k = ((x: p1) => number) & ((y: p2) => string) & ((z: p3) => boolean);  // 这里实际上就是一个重载函数
    type d = k extends ((a: infer A) => void) ? A : 'b'       //  最后一个的参数类型：p3，这是为啥
    type e = k extends ((a: any) => infer A) ? A : 'b'        //  最后一个的返回值类型：boolean，这是为啥

    function overload(a: number): 'a';
    function overload(a: string): 'b';
    function overload(a: number | string) {
        return a;
    }

    type f1 = typeof overload extends (a: infer A) => void ? A : 'b'        // 最后一个的参数类型：string，这是为啥
    type f2 = typeof overload extends (a: any) => infer A ? A : 'b'         // 最后一个的返回值类型：'b'，这是为啥
    type f3 = ReturnType<typeof overload>

}

/**
 * 39. UnionToTuple 联合类型转换为元组类型
 */
namespace space39 {
    type UnionPop<T> = ((T extends any ?
        ((k: (a: T) => void) => void)
        : never) extends (k: infer I) => void ? I
        : never) extends (a: infer J) => void ? J
        : never
    type UnionToTuple<T, TT = T, Pre extends any[] = []> = [T] extends [Pre[number]] ?
        Pre
        : UnionToTuple<T, Exclude<TT, UnionPop<TT>>, [UnionPop<TT>, ...Pre]>
    type a = UnionToTuple<1 | 2 | 3>                      // [1,2,3]
    type b = UnionToTuple<1 | string | boolean>           // [1,string,boolean]
    type c = UnionToTuple<any>                            // [any]

    type Q1 = UnionToTuple<string | number | symbol>                                // [symbol,number,string]
    type Q2 = UnionToTuple<string | number | symbol | boolean>                      // [boolean,symbol,number,string]
    type Q3 = UnionToTuple<string | number | symbol | boolean | [boolean]>          // [boolean,[boolean],symbol,number,string]
}

/**
 * 40. 实现组件继承属性类型
 * - 实现类型 ComponentType 以及函数createComponent的类型定义（无需实现功能）
 * - 使得函数createComponent能够创建一个React组件，支持设置三个属性值：props属性，emits事件以及inherit继承组件，具体要求看使用代码
 * - 先做的简单一点，组件所有属性都是可选属性(props,emits以及继承的属性都是可选的)
 * - 提示：先完整看一遍题目再开始实现功能
 */
namespace space40 {
    type CapitalizeString<T> = T extends `${infer L}${infer R}` ? `${Uppercase<L>}${R}` : never;
    type CamelCase<T extends string, S extends string = ''> =
        T extends `${infer L}-${infer T}${infer R}` ? CamelCase<R, `${S}${L}${Uppercase<T>}`> : CapitalizeString<`${S}${T}`>;
        
    /*---------------------------------------utils-------------------------------------------*/
    interface SimpleConstruct { new(): any }

    type InferInstance<T> = T extends () => infer R ? R : (T extends new (...args: any[]) => infer R ? R : T)

    /*---------------------------------------component-------------------------------------------*/
    interface ComponentOption {
        props?: Record<string, SimpleConstruct | SimpleConstruct[]>,
        emits?: Record<string, (...args: any[]) => any>,
        inherit?: keyof JSX.IntrinsicElements | ((props: any) => any)
    }

    type ExtractPropType<T> = { [k in keyof T]?: T[k] extends any[] ? InferInstance<T[k][number]> : InferInstance<T[k]> }

    type ExtractEmitType<T> = { [k in keyof T as `on${k extends string ? CamelCase<k> : ''}`]?: T[k] extends ((...args: infer A) => any) ? (...args: A) => void : T[k] }

    type ExtractInheritType<T> = T extends (props: infer R) => any ? R : (T extends keyof JSX.IntrinsicElements ? JSX.IntrinsicElements[T] : {})

    type MergeTypes<Props, Emits, Inherit> = Props & Emits & Omit<Inherit, keyof Props | keyof Emits>

    type ComponentType<Option> = Option extends { props?: infer Props, emits?: infer Emits, inherit?: infer Inherit } ? MergeTypes<ExtractPropType<Props>, ExtractEmitType<Emits>, ExtractInheritType<Inherit>> : never

    /*---------------------------------------create component-------------------------------------------*/

    /*
    *  实现类型 ComponentType<Option> 以及函数createComponent的类型定义（无需实现功能）
    *  使得函数createComponent能够创建一个React组件，支持设置三个属性值：props属性，emits事件以及inherit继承组件，具体要求看使用代码；
    *  提示：先完整看一遍题目再开始实现功能；
    */
    function createComponent<Option extends ComponentOption>(option: Option): { (props: ComponentType<Option>): any } { return {} as any }

    // 基于button标签封装的组件，覆盖title属性以及onClick事件类型
    const Button = createComponent({
        inherit: "button",
        props: {
            // 基础类型的属性
            label: String,
            width: Number,
            loading: Boolean,
            block: [Boolean, Number],                   // 联合属性类型：block: boolean|number
            title: Number,                              // 覆盖继承button的属性类型 title:string -> title:number
        },
        emits: {
            'show-change': (len: number) => { },         // 自定义的事件类型
            click: (name: string) => { },                // 覆盖button的click事件类型
        },
    })

    console.log(
        /*
        *  要求：
        *  1. 属性类型为 {label:string, width:number, loading: boolean, block:boolean|number, title:number}
        *  2. 事件类型为：{onShowChange:(len:number)=>void, onClick:(name:string)=>void}
        *  3. 能够继承button的所有属性以及事件
        */
        <Button
            label={""}
            width={100}
            title={111}
            onShowChange={len => {
                console.log(len.toFixed(0))     // 不允许有隐式的any类型，这里即使没有定义len的类型，len也应该能够自动推断出来为number类型
            }}
            onClick={e => {
                console.log(e.charAt(0))
            }}
        />
    )

    // 基于Button组件封装的组件，覆盖label属性以及show-change，click事件类型
    const ProButton = createComponent({
        inherit: Button,
        props: {
            // 基础类型数据推断
            proLabel: String,
            label: [String, Number],                    // 覆盖继承属性类型
        },
        emits: {
            'show-change': (el: HTMLButtonElement) => { },// 覆盖的事件类型
            click: (el: HTMLButtonElement) => { },       // 覆盖的事件类型
            'make-pro': () => { },                       // 自定义事件类型
        },
    })

    console.log(
        /*
        *  要求：
        *  1. 属性类型为 {proLabel:string, label:string|number}
        *  2. 事件类型为：{onShowChange:(el: HTMLButtonElement)=>void, onClick:(el: HTMLButtonElement)=>void, onMakePro:()=>void}
        *  3. 继承Button组件所有的属性以及事件
        */
        <ProButton
            label={111}
            onShowChange={e => {
                console.log(e.offsetWidth)                  // 不允许有隐式的any类型，这里即使没有定义len的类型，len也应该能够自动推断出来为number类型
            }}
            onClick={e => {
                console.log(e.offsetWidth)
            }}
            onMakePro={() => { }}
        />
    )

    /*
    *  提示，如何得到button标签的属性类型
    *  在文件：node_modules/@types/react/index.d.ts 中寻找 JSX.IntrinsicElements
    *  比如div标签的属性类型为 JSX.IntrinsicElements["div"]
    */
    const MyDiv = (props: JSX.IntrinsicElements["div"]) => null
    console.log(<>
        <div contentEditable={true} aria-label="div text" />
        <MyDiv contentEditable={true} aria-label="div text" />
    </>)
    // 

}