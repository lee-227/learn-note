## 简介
- 一款类似于 webpack 的 js 模块打包工具, 使用 ES Module 的模块规范

## 优点
- 基于 ES Module 规范, 可以静态分析代码模块, 自动剔除无用依赖跟变量, 拥有更好的 Tree-Shaking
- 虽然基于 ES Module 规范, 也可以通过 插件 支持 CommonJS 模块导入

## 缺点
- 加载非 ESM 的第三方模块需要使用插件
- 模块最终都打包到一个函数中，无法实现 HMR

**插件是 rollup 中扩展功能的唯一方式**

## 选型
- rollup 更倾向于开发类库
- webpack 开发应用程序

## 使用
- rollup -c --environment INCLUDE_DEPS,BUILD:production
- process.env.INCLUDE_DEPS === 'true'  process.env.BUILD === 'production'

