import fs from 'fs';

function build() {
  return {
    name: 'build',
    async watchChange(id, change) {
      console.log('watchChange', id, change);
    },
    async closeWatcher() {
      console.log('closeWatcher');
    },
    async options(inputOptions) {
      // 构建阶段的第一个钩子
      // 用于替换或操作传递给rollup的选项对象
      // 如果只需要阅读options，建议使用buildStart钩子，因为在考虑了所有选项钩子的转换后，该钩子可以访问选项
      // 这是唯一一个无法访问大多数插件上下文实用程序功能的钩子，因为它是在完全配置汇总之前运行的
      console.log('options');
      //inputOptions.input = './src/main.js';
    },
    async buildStart(inputOptions) {
      // 每次rollup.rollup build都要调用此钩子
      // 当您需要访问传递给rollup的选项时，建议使用这个钩子
      // 因为它考虑了所有options钩子的转换，还包含未设置选项的正确默认值
      console.log('buildStart');
    },
    async resolveId(source, importer) {
      // 定义自定义解析器
      // 在解析入口点时，importer通常是undefined
      if (source === 'virtual') {
        console.log('resolveId', source);
        // 如果resolveId钩子有返回值了，那么就会跳过后面的查找逻辑，以此返回值作为最终的模块ID
        // 返回null将遵循其他resolveId函数，最终遵循默认的解析行
        // 返回false信号，表示源应被视为外部模块，不包括在bundle中
        return source;
      }
    },
    //加载此模块ID对应的内容
    async load(id) {
      // 定义自定义加载程序
      // 返回null会推迟到其他加载函数（最终是从文件系统加载的默认行为）
      if (id === 'virtual') {
        console.log('load', id);
        return `export default "virtual"`;
      }
    },
    async shouldTransformCachedModule({ id, code, ast }) {
      // 如果使用了Rollup缓存（例如，在监视模式下），如果在加载钩子之后，加载的代码与缓存副本的代码相同，则Rollup将跳过模块的转换钩子
      // 为了防止这种情况，丢弃缓存的副本，而是转换一个模块，插件可以实现这个钩子并返回true。
      console.log('shouldTransformCachedModule');
      //不使用缓存，再次进行转换
      return true;
    },
    async transform(code, id) {
      // 可用于转换单个模块
      console.log('transform');
    },
    async moduleParsed(moduleInfo) {
      // 每当模块被Rollup完全解析时，就会调用这个钩子。看看this.getModuleInfo了解传递给这个钩子的信息
      console.log('moduleParsed');
    },
    async resolveDynamicImport(specifier, importer) {
      // 为动态导入定义自定义解析程序
      // 返回false表明导入应该保持原样，而不是传递给其他解析程序，从而使其成为外部的
      // 与resolveId钩子类似，还可以返回一个对象，将导入解析为不同的id，同时将其标记为外部
      console.log('resolveDynamicImport', specifier, importer);
    },
    async buildEnd() {
      // 在rollup完成打包时调用，但在调用generate或write之前调用；
      console.log('buildEnd');
    },
  };
}
export default build;
