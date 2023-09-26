const path = require('path');
const { normalizePath } = require('./utils');
const { resolvePlugins } = require('./plugins');
async function resolveConfig() {
  //当前的根目录 window \\  linux /
  const root = normalizePath(process.cwd());
  const cacheDir = normalizePath(path.resolve(`node_modules/.vite7`));
  let config = {
    root,
    cacheDir,
  };
  const plugins = await resolvePlugins(config);
  config.plugins = plugins;
  return config;
}
module.exports = resolveConfig;
