const { build } = require('esbuild');
const esbuildScanPlugin = require('./esbuildScanPlugin');
const path = require('path');
async function scanImports(config) {
  const depImports = {};
  // 4. 创建 ES build 插件进行依赖扫描
  const esPlugin = await esbuildScanPlugin(config, depImports);
  // 5. 执行 ES build 开始扫描 以 index.html 作为入口点
  await build({
    absWorkingDir: config.root,
    entryPoints: [path.resolve('./index.html')],
    bundle: true,
    format: 'esm',
    outfile: 'dist/index.js',
    write: true,
    plugins: [esPlugin],
  });
  return depImports;
}
module.exports = scanImports;
