module.exports = {
  env: {
    // 标记代码的运行环境 既可使用的全局变量
    browser: true, // 允许浏览器的全局变量 
    es2021: true, // 允许高级语法中的 api 如 Promise
    node: true, // 允许 node 中的全局变量
  },
  extends: ['standard'], // 集成别人写好的最佳实践 包含 plugin 与 rules
  parserOptions: {
    ecmaVersion: 12, // 允许使用的高级语法
    sourceType: 'module', // 允许使用的模块类型 es module
    ecmaFeatures: {
      jsx: true, // 允许代码中使用 jsx
    }
  },
  rules: {
    quotes: ['error', 'double']
  },
  plugins: [
    '@typescript-eslint', // typescript 的 eslint 插件
  ],
  parser: '@typescript-eslint/parser', // 解析器 使用 typescript 时的解析器
  globals: { // 允许的一些全局变量
    custom: 'writable', 
    my: 'readonly' 
  }
}
