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