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
      build.onResolve({ filter: htmlTypesRE }, async ({ path, importer }) => {
        const resolved = await resolve(path, importer);
        if (resolved) {
          return {
            path: resolved.id || resolved,
            namespace: 'html',
          };
        }
      });
      build.onResolve({ filter: /.*/ }, async ({ path, importer }) => {
        const resolved = await resolve(path, importer);
        if (resolved) {
          const id = resolved.id || resolved;
          const included = id.includes('node_modules');
          if (included) {
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
      build.onLoad(
        { filter: htmlTypesRE, namespace: 'html' },
        async ({ path }) => {
          let html = fs.readFileSync(path, 'utf-8');
          let [, scriptSrc] = html.match(scriptModuleRE);
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
