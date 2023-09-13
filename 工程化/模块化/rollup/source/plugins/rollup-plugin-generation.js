function generation() {
  return {
    name: 'rollup-plugin-generation',
    //这个钩子是同步的，不能加async
    outputOptions(outputOptions) {
      // 替换或操作传递给bundle.generate()的输出选项对象bundle.write()
      console.log('outputOptions');
    },
    renderStart() {
      // 每次初始调用bundle.generate()或被bundle.write()调用
      console.log('renderStart');
    },
    banner() {
      console.log('banner');
    },
    footer() {
      console.log('footer');
    },
    intro() {
      console.log('intro');
    },
    outro() {
      console.log('outro');
    },
    renderDynamicImport() {
      // 这个钩子提供了对如何呈现动态导入的细粒度控制
      // 方法是替换导入表达式参数的左侧 ( import() 和右侧 ( ) 的代码。)
      // 返回null延迟到此类型的其他钩子并最终呈现特定于格式的默认值
      console.log('renderDynamicImport');
    },
    augmentChunkHash() {
      // 可用于增加单个块的散列
      console.log('augmentChunkHash');
    },
    resolveFileUrl() {
      console.log('resolveFileUrl');
    },
    resolveImportMeta() {
      console.log('resolveImportMeta');
    },
    renderChunk() {
      console.log('renderChunk');
    },
    generateBundle() {
      // 在bundle.generate()之后调用
      // 或者在 bundle.write()把文件写入之前调用
      console.log('generateBundle');
    },
    writeBundle() {
      console.log('writeBundle');
    },
    renderError() {
      console.log('renderError');
    },
    closeBundle() {
      console.log('closeBundle');
    },
  };
}
export default generation;
