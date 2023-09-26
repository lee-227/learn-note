const fs = require('fs-extra');
const path = require('path');
const { createPluginContainer } = require('../pluginContainer');
const resolvePlugin = require('../plugins/resolve');
const { normalizePath } = require('../utils');
const htmlTypesRE = /\.html$/;
const scriptModuleRE = /<script type="module" src\="(.+?)"><\/script>/;
const JS_TYPES_RE = /\.js$/;
async function esbuildScanPlugin(config, depImports) {
  config.plugins = [resolvePlugin(config)];
  const container = await createPluginContainer(config);
  const resolve = async (id, importer) => {
    return await container.resolveId(id, importer);
  };
  return {
    name: 'vite:dep-scan',
    setup(build) {
      // 27. 预编译时 遇到 vue 文件 标记为外部文件 不做处理
      build.onResolve(
        {
          filter: /\.vue$/,
        },
        async ({ path: id, importer }) => {
          const resolved = await resolve(id, importer);
          if (resolved) {
            return {
              path: resolved.id,
              external: true,
            };
          }
        }
      );
      // 6. 解析 index.html 是执行此方法
      build.onResolve({ filter: htmlTypesRE }, async ({ path, importer }) => {
        // 7. 解析出绝对路径 并将命名空间标记为 html 单独处理此模块
        const resolved = await resolve(path, importer);
        if (resolved) {
          return {
            path: resolved.id || resolved,
            namespace: 'html',
          };
        }
      });
      build.onResolve({ filter: /.*/ }, async ({ path, importer }) => {
        // 12. 入口模块会在此解析 同时其依赖的其他模块也会在这里被解析
        const resolved = await resolve(path, importer);
        if (resolved) {
          const id = resolved.id || resolved;
          // 13. 判断解析的模块是否是第三方模块
          const included = id.includes('node_modules');
          if (included) {
            // 14. 将其保存至 depImports 中 并标记为 external 外部模块 esbuild 不在处理
            // 15. 至此会找到所有要预编译的第三方依赖
            depImports[path] = normalizePath(id);
            return {
              path: id,
              external: true,
            };
          }
          return {
            path: id,
          };
        }
        return { path };
      });
      // 8. 开始处理 html 入口模块
      build.onLoad(
        { filter: htmlTypesRE, namespace: 'html' },
        async ({ path }) => {
          // 9. 读取 html 内容
          let html = fs.readFileSync(path, 'utf-8');
          // 10. 筛选出 script 引入
          let [, scriptSrc] = html.match(scriptModuleRE);
          // 11. 将其处理成 js 模块再交由 ES build 处理
          let js = `import ${JSON.stringify(scriptSrc)};\n`;
          return {
            loader: 'js',
            contents: js,
          };
        }
      );
      build.onLoad({ filter: JS_TYPES_RE }, ({ path: id }) => {
        let ext = path.extname(id).slice(1);
        let contents = fs.readFileSync(id, 'utf-8');
        return {
          loader: ext,
          contents,
        };
      });
    },
  };
}
module.exports = esbuildScanPlugin;
