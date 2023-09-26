const importAnalysisPlugin = require('./importAnalysis');
const preAliasPlugin = require('./preAlias');
const resolvePlugin = require('./resolve');
async function resolvePlugins(config, userPlugins) {
  return [
    preAliasPlugin(config),
    resolvePlugin(config),
    ...userPlugins,
    importAnalysisPlugin(config),
  ];
}
exports.resolvePlugins = resolvePlugins;
