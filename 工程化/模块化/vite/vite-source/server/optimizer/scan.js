const { build } = require('esbuild');
const esbuildScanPlugin = require('./esbuildScanPlugin');
const path = require('path');
async function scanImports(config) {
  const depImports = {};
  const esPlugin = await esbuildScanPlugin(config, depImports);
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
