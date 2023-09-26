const scanImports = require('./scan');
const fs = require('fs-extra');
const path = require('path');
const { build } = require('esbuild');
const { normalizePath } = require('../utils');
async function createOptimizeDepsRun(config) {
  // 3. 扫描第三方依赖
  const deps = await scanImports(config);
  const { cacheDir } = config;
  const depsCacheDir = path.resolve(cacheDir, 'deps');
  const metadataPath = path.join(depsCacheDir, '_metadata.json');
  const metadata = {
    optimized: {},
  };
  // 16. 遍历找到的所有第三方依赖 挨个使用 esbuild 完成依赖的编译工作
  for (const id in deps) {
    const entry = deps[id];
    metadata.optimized[id] = {
      file: normalizePath(path.resolve(depsCacheDir, id + '.js')),
      src: entry,
    };
    await build({
      absWorkingDir: process.cwd(),
      entryPoints: [deps[id]],
      outfile: path.resolve(depsCacheDir, id + '.js'),
      bundle: true,
      write: true,
      format: 'esm',
    });
  }
  await fs.ensureDir(depsCacheDir);
  // 17. 创建 _metadata.json 将第三方依赖及其打包后的信息保存至此
  await fs.writeFile(
    metadataPath,
    JSON.stringify(
      metadata,
      (key, value) => {
        if (key === 'file' || key === 'src') {
          //optimized里存的是绝对路径，此处写入硬盘的是相对于缓存目录的相对路径
          console.log(depsCacheDir, value);
          return normalizePath(path.relative(depsCacheDir, value));
        }
        return value;
      },
      2
    )
  );
  return { metadata };
}
exports.createOptimizeDepsRun = createOptimizeDepsRun;
