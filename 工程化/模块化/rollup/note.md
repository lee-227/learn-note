## 简介

- 一款类似于 webpack 的模块打包工具，但是更为小巧，一个专门的高效的 esmodule 的打包器。

## 优点

- webpack 打包非常繁琐，打包体积比较大 而 ES module 打包结果更精简
- 基于 es module 的自动 tree-shaking , 优化代码体积

## 缺点

- 加载非 ESM 的第三方模块需要使用插件
- 模块最终都打包到一个函数中，无法实现 HMR

## 选型

- rollup 更倾向于开发类库
- webpack 开发应用程序

## 插件列表

- https://github.com/rollup/awesome
- **插件时 rollup 中扩展功能的唯一方式**
- Rollup 插件是一个具有以下描述的一个或多个属性、构建钩子和输出生成钩子的对象

## 钩子

- 钩子是 rollup 在构建的不同阶段调用的函数
- Build Hooks
  - async 钩子还可以返回解析为相同类型值的 Promise；否则，钩子将被标记为 sync
  - first 如果有几个插件实现了这个钩子，钩子会按顺序运行，直到钩子返回一个非 null 或未定义的值
  - sequential 如果几个插件实现了这个钩子，那么它们都将按照指定的插件顺序运行。如果一个钩子是异步的，那么这种类型的后续钩子将等待当前钩子被解析
  - parallel 如果多个插件实现了这个钩子，那么它们都将按照指定的插件顺序运行。如果一个钩子是异步的，那么这类后续钩子将并行运行，而不是等待当前钩子
- Build Hooks 在构建阶段运行，该阶段由 rollup.rollup(inputOptions)触发
- 它们主要负责在 rollup 处理输入文件之前定位、提供和转换输入文件
- 构建阶段的第一个钩子是 options，最后一个钩子总是 buildEnd
- 如果出现生成错误，将在此之后调用 closeBundle

- Output Generation Hooks

  - 输出生成钩子可以提供有关生成的包的信息，并在完成后修改构建
  - 输出生成阶段的第一个钩子是 outputOptions，最后一个钩子要么 generateBundle 是通过成功生成输出
  - 此外，closeBundle 可以作为最后一个钩子调用，但用户有责任手动调用 bundle.close()以触发此钩子

- 导入 polyfill

```js
dynamicImportPolyfill('./msg-ca034dda.js', import.meta.url).then((res) =>
  console.log(res.default)
);
function dynamicImportPolyfill(filename, url) {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.type = 'module';
    script.onload = () => {
      resolve(window.mod);
    };
    const absURL = new URL(filename, url).href;
    console.log(absURL);
    const blob = new Blob(
      [`import * as mod from "${absURL}";`, ` window.mod = mod;`],
      { type: 'text/javascript' }
    );
    script.src = URL.createObjectURL(blob);
    document.head.appendChild(script);
  });
}
```
