const { toShortPluginId } = require('lee-cli-shared-utils');
const mergeDeps = require('./util/mergeDeps');
const { isBinaryFileSync } = require('isbinaryfile');
const isString = (val) => typeof val === 'string';
const isObject = (val) => val && typeof val === 'object';
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
class GeneratorAPI {
  constructor(id, generator, options, rootOptions) {
    this.id = id;
    this.generator = generator;
    this.options = options;
    this.rootOptions = rootOptions;
    this.pluginsData = generator.plugins
      .filter(({ id }) => id !== `@vue/cli-service`)
      .map(({ id }) => ({ name: toShortPluginId(id) }));
  }
  hasPlugin(id) {
    return this.generator.hasPlugin(id);
  }
  extendPackage(fields) {
    const pkg = this.generator.pkg;
    const toMerge = fields;
    for (const key in toMerge) {
      const value = toMerge[key];
      const existing = pkg[key];
      if (
        isObject(value) &&
        (key === 'dependencies' || key === 'devDependencies')
      ) {
        pkg[key] = mergeDeps(existing || {}, value);
      } else {
        pkg[key] = value;
      }
    }
  }
  _injectFileMiddleware(middleware) {
    this.generator.fileMiddlewares.push(middleware);
  }
  _resolveData(additionalData) {
    return Object.assign(
      {
        options: this.options,
        rootOptions: this.rootOptions,
        plugins: this.pluginsData,
      },
      additionalData,
    );
  }
  render(source, additionalData) {
    const baseDir = extractCallDir();
    if (isString(source)) {
      source = path.resolve(baseDir, source);
      this._injectFileMiddleware(async (files) => {
        const data = this._resolveData(additionalData);
        const globby = require('globby');
        const _files = await globby(['**/*'], { cwd: source });
        for (const rawPath of _files) {
          const targetPath = rawPath
            .split('/')
            .map((filename) => {
              if (filename.charAt(0) === '_' && filename.charAt(1) !== '_') {
                return `.${filename.slice(1)}`;
              }
              return filename;
            })
            .join('/');
          const sourcePath = path.resolve(source, rawPath);
          const content = renderFile(sourcePath, data);
          files[targetPath] = content;
        }
      });
    }
  }
}
function extractCallDir() {
  const obj = {};
  Error.captureStackTrace(obj);
  const callSite = obj.stack.split('\n')[3];
  const namedStackRegExp = /\s\((.*):\d+:\d+\)$/;
  let matchResult = callSite.match(namedStackRegExp);
  const fileName = matchResult[1];
  return path.dirname(fileName);
}
function renderFile(name, data) {
  if (isBinaryFileSync(name)) {
    return fs.readFileSync(name);
  }
  const template = fs.readFileSync(name, 'utf8');
  return ejs.render(template, data);
}
module.exports = GeneratorAPI;
