const fs = require('fs');
const path = require('path');
const resolve = require('resolve');
function resolvePlugin(config) {
  return {
    name: 'vite:resolve',
    resolveId(id, importer) {
      //如果/开头表示是绝对路径
      if (id.startsWith('/')) {
        return { id: path.resolve(config.root, id.slice(1)) };
      }
      //如果是绝对路径
      if (path.isAbsolute(id)) {
        return { id };
      }
      //如果是相对路径
      if (id.startsWith('.')) {
        const basedir = path.dirname(importer);
        const fsPath = path.resolve(basedir, id);
        return { id: fsPath };
      }
      //如果是第三方包
      let res = tryNodeResolve(id, importer, config);
      if (res) {
        return res;
      }
    },
  };
}

function tryNodeResolve(id, importer, config) {
  const pkgPath = resolve.sync(`${id}/package.json`, { basedir: config.root });
  const pkgDir = path.dirname(pkgPath);
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  const entryPoint = pkg.module;
  const entryPointPath = path.join(pkgDir, entryPoint);
  return { id: entryPointPath };
}
module.exports = resolvePlugin;
