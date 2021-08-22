const { isPlugin, matchesPluginId } = require('lee-cli-shared-utils');
const GeneratorAPI = require('./GeneratorAPI');
const normalizeFilePaths = require('./util/normalizeFilePaths');
const writeFileTree = require('./util/writeFileTree');
const ejs = require('ejs');
class Generator {
  constructor(context, { pkg = {}, plugins = [] } = {}) {
    this.context = context;
    this.plugins = plugins;
    this.files = {};
    this.fileMiddlewares = [];
    this.pkg = pkg;
    this.allPluginIds = Object.keys(this.pkg.dependencies || {})
      .concat(Object.keys(this.pkg.devDependencies || {}))
      .filter(isPlugin);
    const cliService = plugins.find((p) => p.id === '@vue/cli-service');
    this.rootOptions = cliService.options;
  }
  async generate() {
    await this.initPlugins();
    //将一些配置信息从package.json中提取到单独的文件中，比如postcss.config.js babel.config.js
    this.extractConfigFiles();
    //遍历fileMiddleware，向files里写入文件，并插入import和rootOptions
    await this.resolveFiles();
    console.log(this.files);
    this.sortPkg();
    this.files['package.json'] = JSON.stringify(this.pkg, null, 2) + '\n';
    //把内存中的文件写入硬盘
    await writeFileTree(this.context, this.files);
  }
  sortPkg() {
    console.log('ensure package.json keys has readable order');
  }
  async resolveFiles() {
    const files = this.files;
    for (const middleware of this.fileMiddlewares) {
      await middleware(files, ejs.render);
    }
    normalizeFilePaths(files);
  }
  extractConfigFiles() {
    console.log('extractConfigFiles');
  }
  async initPlugins() {
    const { rootOptions } = this;
    for (const plugin of this.plugins) {
      const { id, apply, options } = plugin;
      const api = new GeneratorAPI(id, this, options, rootOptions);
      await apply(api, options, rootOptions);
    }
  }
  hasPlugin(_id) {
    return [...this.plugins.map((p) => p.id), ...this.allPluginIds].some(
      (id) => {
        return matchesPluginId(_id, id);
      },
    );
  }
  printExitLogs() {
    console.log('printExitLogs');
  }
}
module.exports = Generator;
