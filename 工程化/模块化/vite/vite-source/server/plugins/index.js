const importAnalysisPlugin = require('./importAnalysis');
const preAliasPlugin = require('./preAlias');
const resolvePlugin = require('./resolve');
async function resolvePlugins(config) {
  return [
    preAliasPlugin(config),
    resolvePlugin(config),
    importAnalysisPlugin(config),
  ];
}
exports.resolvePlugins = resolvePlugins;
