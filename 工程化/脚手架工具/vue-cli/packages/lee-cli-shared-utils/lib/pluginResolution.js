const pluginRE = /^@vue\/cli-plugin-/;
exports.toShortPluginId = (id) => id.replace(pluginRE, ''); //@vue/cli-plugin-babel => babel
exports.isPlugin = (id) => pluginRE.test(id);
exports.matchesPluginId = (input, full) => {
  return full === input;
};
