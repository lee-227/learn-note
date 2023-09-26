const { normalizePath } = require('./utils');
const path = require('path');
async function createPluginContainer({ plugins, root }) {
  class PluginContext {
    async resolve(id, importer = path.join(root, 'index.html')) {
      return await container.resolveId(id, importer);
    }
  }
  const container = {
    async resolveId(id, importer) {
      let ctx = new PluginContext();
      let resolveId = id;
      for (const plugin of plugins) {
        if (!plugin.resolveId) continue;
        const result = await plugin.resolveId.call(ctx, id, importer);
        if (result) {
          resolveId = result.id || result;
          break;
        }
      }
      return { id: normalizePath(resolveId) };
    },
    async load(id) {
      const ctx = new PluginContext();
      for (const plugin of plugins) {
        if (!plugin.load) continue;
        const result = await plugin.load.call(ctx, id);
        if (result !== null) {
          return result;
        }
      }
      return null;
    },
    async transform(code, id) {
      for (const plugin of plugins) {
        if (!plugin.transform) continue;
        const ctx = new PluginContext();
        const result = await plugin.transform.call(ctx, code, id);
        if (!result) continue;
        code = result.code || result;
      }
      return { code };
    },
  };
  return container;
}
exports.createPluginContainer = createPluginContainer;
