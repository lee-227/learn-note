const path = require('path');
class ModuleNode {
  importers = new Set();
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
      dep.importers.add(mod);
    }
    const deps = (mod.acceptedHmrDeps = new Set());
    for (const accepted of acceptedModules) {
      const dep = await this.ensureEntryFromUrl(accepted);
      deps.add(dep);
    }
  }
}
exports.ModuleGraph = ModuleGraph;
