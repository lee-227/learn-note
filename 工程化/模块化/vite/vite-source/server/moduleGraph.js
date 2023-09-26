const path = require('path');
class ModuleNode {
  // 存放导入了此模块的附魔卡
  importers = new Set();
  // 存放此模块热更新接受的模块
  acceptedHmrDeps = new Set();
  constructor(url) {
    this.url = url;
    this.type = 'js';
  }
}
class ModuleGraph {
  constructor(resolveId) {
    this.resolveId = resolveId;
  }

  fileToModulesMap = new Map();
  urlToModuleMap = new Map();
  idToModuleMap = new Map();

  getModulesByFile(file) {
    return this.fileToModulesMap.get(file);
  }
  getModuleById(id) {
    return this.idToModuleMap.get(id);
  }
  async ensureEntryFromUrl(rawUrl) {
    // 5.hmr serve 根据 url 创建对应模块
    const [url, resolvedId] = await this.resolveUrl(rawUrl);
    let mod = this.urlToModuleMap.get(url);
    if (!mod) {
      mod = new ModuleNode(url);
      this.urlToModuleMap.set(url, mod);
      this.idToModuleMap.set(resolvedId, mod);
      const file = (mod.file = resolvedId);
      let fileMappedModules = this.fileToModulesMap.get(file);
      if (!fileMappedModules) {
        fileMappedModules = new Set();
        this.fileToModulesMap.set(file, fileMappedModules);
      }
      fileMappedModules.add(mod);
    }
    return mod;
  }
  async resolveUrl(url) {
    const resolved = await this.resolveId(url);
    const resolvedId = resolved.id || url;
    return [url, resolvedId];
  }
  async updateModuleInfo(mod, importedModules, acceptedModules) {
    for (const imported of importedModules) {
      const dep = await this.ensureEntryFromUrl(imported);
      // 10.hmr serve 创建子模块 将子模块的 importers 加入父模块
      dep.importers.add(mod);
    }
    const deps = (mod.acceptedHmrDeps = new Set());
    for (const accepted of acceptedModules) {
      const dep = await this.ensureEntryFromUrl(accepted);
      // 11.hmr serve 将此模块中添加 accept 的热更新的子模块
      deps.add(dep);
    }
  }
}
exports.ModuleGraph = ModuleGraph;
