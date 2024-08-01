const importAnalysisPlugin = require('./importAnalysis');
const preAliasPlugin = require('./preAlias');
const resolvePlugin = require('./resolve');
const definePlugin = require('./define');
async function resolvePlugins(config, userPlugins) {
  return [
    preAliasPlugin(config), // 重写第三方依赖导入路径 指向 node_modules/.vite
    resolvePlugin(config), // 解析导入路径 拿到对应模块的绝对路径
    ...userPlugins,
    definePlugin(config), // 配置中定义编译时要替换的变量
    importAnalysisPlugin(config),
  ];
}
exports.resolvePlugins = resolvePlugins;
