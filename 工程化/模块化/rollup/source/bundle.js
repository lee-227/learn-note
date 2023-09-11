let fs = require('fs');
let path = require('path');
let Module = require('./module');
let MagicString = require('magic-string');
const { hasOwnProperty, replaceIdentifiers } = require('./utils');
class Bundle {
  constructor(options) {
    //入口文件数据
    this.entryPath = path.resolve(options.entry.replace(/\.js$/, '') + '.js');
    //存放所有的模块
    this.modules = {};
  }
  build(filename) {
    const entryModule = this.fetchModule(this.entryPath); //获取模块代码
    this.statements = entryModule.expandAllStatements(true); //展开所有的语句
    this.deconflict();
    const { code } = this.generate(); //生成打包后的代码
    fs.writeFileSync(filename, code); //写入文件系统
  }
  deconflict() {
    const defines = {}; //定义的变量
    const conflicts = {}; //变量名冲突的变量
    this.statements.forEach((statement) => {
      Object.keys(statement._defines).forEach((name) => {
        if (hasOwnProperty(defines, name)) {
          conflicts[name] = true;
        } else {
          defines[name] = []; //defines.age = [];
        }
        //把此声明变量的语句，对应的模块添加到数组里
        defines[name].push(statement._module);
      });
    });
    Object.keys(conflicts).forEach((name) => {
      const modules = defines[name]; //获取定义此变量名的模块的数组
      modules.pop(); //最后一个模块不需要重命名,保留 原来的名称即可 [age1,age2]
      modules.forEach((module, index) => {
        let replacement = `${name}$${modules.length - index}`;
        debugger;
        module.rename(name, replacement); //module age=>age$2
      });
    });
  }
  fetchModule(importee, importer) {
    let route;
    if (!importer) {
      route = importee;
    } else {
      if (path.isAbsolute(importee)) {
        route = importee;
      } else {
        route = path.resolve(
          path.dirname(importer),
          importee.replace(/\.js$/, '') + '.js'
        );
      }
    }
    if (route) {
      let code = fs.readFileSync(route, 'utf8');
      const module = new Module({
        code,
        path: importee,
        bundle: this,
      });
      return module;
    }
  }
  generate() {
    let magicString = new MagicString.Bundle();
    this.statements.forEach((statement) => {
      let replacements = {};
      Object.keys(statement._dependsOn)
        .concat(Object.keys(statement._defines))
        .forEach((name) => {
          const canonicalName = statement._module.getCanonicalName(name);
          if (name !== canonicalName) replacements[name] = canonicalName;
        });
      const source = statement._source.clone();
      if (statement.type === 'ExportNamedDeclaration') {
        source.remove(statement.start, statement.declaration.start);
      }
      replaceIdentifiers(statement, source, replacements);
      magicString.addSource({
        content: source,
        separator: '\n',
      });
    });
    return { code: magicString.toString() };
  }
}
module.exports = Bundle;
