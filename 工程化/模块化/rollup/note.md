## 简介
- 一款类似于 webpack 的模块打包工具，但是更为小巧，一个专门的高效的 esmodule 的打包器。

## 优点
- webpack 打包非常繁琐，打包体积比较大 而 ES module 打包结果更精简
- 基于 es module 的自动 tree-shaking , 优化代码体积

## 缺点
- 加载非 ESM 的第三方模块需要使用插件
- 模块最终都打包到一个函数中，无法实现 HMR

**插件时rollup中扩展功能的唯一方式**

## 选型
- rollup更倾向于开发类库
- webpack开发应用程序

## 插件列表
- https://github.com/rollup/awesome