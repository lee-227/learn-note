## 介绍

- perttier 是一个**固定**的代码格式化工具
- 作用相当于 ESLint 的代码的排版风格校验

## 既然有 ESLint 那么 Prettier 存在的意义是什么？

- ESLint 提供了丰富的配置以支持 format 出各种不同排版风格的代码，但是多的选择也就意味着排版风格的多样性，这在调和上也造成更多困难，而且即便是对同一单个规则，最后符合这个规则的排版格式也可能有多种，而这些多样性在一个以保证代码可维护性至上的多人团队中存在的必要性是否定的。Prettier 就是致力于减少那些 ESLint 无法减少的多样性的一个存在。这也是为什么介绍说 perttier 是一个**固定**的代码格式化工具

## ESLint Prettier 结合使用
- 配合ESLint检测代码风格,eslint-plugin-prettier插件会调用prettier对你的代码风格进行检查，其原理是先使用prettier对你的代码进行格式化，然后与格式化之前的代码进行对比，如果过出现了不一致，这个地方就会被prettier进行标记。

- 在rules中添加，"prettier/prettier": "error"，表示被prettier标记的地方抛出错误信息。
```js
// npm i -D eslint-plugin-prettier
//.eslintrc.js
{
  "plugins": ["prettier"],
  "rules": {
    "prettier/prettier": "error"
  }
}
```

### 与已存在的插件冲突怎么办
```js
// npm i -D eslint-config-prettier
// 通过使用eslint-config-prettier配置，能够关闭一些不必要的或者是与prettier冲突的lint选项。
//.eslintrc.js
{
  extends: [
    'standard', // 使用standard做代码规范 会与prettier冲突
    "prettier", // 配置在extends的最后一项
  ],
}
```