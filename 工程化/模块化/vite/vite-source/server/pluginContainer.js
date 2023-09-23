const { normalizePath } = require('./utils');
const path = require('path');
async function createPluginContainer({ plugins, root }) {
  class PluginContext {}
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
  };
  return container;
}
exports.createPluginContainer = createPluginContainer;
