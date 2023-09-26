const { init, parse } = require('es-module-lexer');
const MagicString = require('magic-string');
const { lexAcceptedHmrDeps } = require('../hmr');
const path = require('path');
function importAnalysisPlugin(config) {
  const { root } = config;
  let server;
  return {
    name: 'vite:import-analysis',
    configureServer(_server) {
      server = _server;
    },
    async transform(source, importer) {
      await init;
      // 23. 利用 es-module-lexer 解析 导入的模块
      let imports = parse(source)[0];
      if (!imports.length) {
        return source;
      }
      const { moduleGraph } = server;
      const importerModule = moduleGraph.getModuleById(importer);
      const importedUrls = new Set();
      const acceptedUrls = new Set();
      let ms = new MagicString(source);
      const normalizeUrl = async (url) => {
        const resolved = await this.resolve(url, importer);
        if (resolved.id.startsWith(root + '/')) {
          url = resolved.id.slice(root.length);
        }
        await moduleGraph.ensureEntryFromUrl(url);
        return url;
      };
      // 24. 遍历所有的导入模块
      for (let index = 0; index < imports.length; index++) {
        const { s: start, e: end, n: specifier } = imports[index];
        const rawUrl = source.slice(start, end);
        if (rawUrl === 'import.meta') {
          const prop = source.slice(end, end + 4);
          if (prop === '.hot') {
            if (source.slice(end + 4, end + 11) === '.accept') {
              lexAcceptedHmrDeps(
                source,
                source.indexOf('(', end + 11) + 1,
                acceptedUrls
              );
            }
          }
        }
        if (specifier) {
          // 25. 解析导入的模块路径 将其转换为相对路径
          const normalizedUrl = await normalizeUrl(specifier);
          if (normalizedUrl !== specifier) {
            // 26. 将解析后的路径重写 此时完成了第三方模块 -> 相对路径的转换
            ms.overwrite(start, end, normalizedUrl);
          }
          importedUrls.add(normalizedUrl);
        }
      }
      const normalizedAcceptedUrls = new Set();
      const toAbsoluteUrl = (url) =>
        path.posix.resolve(path.posix.dirname(importerModule.url), url);
      for (const { url, start, end } of acceptedUrls) {
        const [normalized] = await moduleGraph.resolveUrl(toAbsoluteUrl(url));
        normalizedAcceptedUrls.add(normalized);
        ms.overwrite(start, end, JSON.stringify(normalized));
      }
      await moduleGraph.updateModuleInfo(
        importerModule,
        importedUrls,
        normalizedAcceptedUrls
      );
      return ms.toString();
    },
  };
}
module.exports = importAnalysisPlugin;
