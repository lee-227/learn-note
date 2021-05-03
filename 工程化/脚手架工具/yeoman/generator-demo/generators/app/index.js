// 此文件作为 Generator 的核心入口
// 需要导出一个继承自 Yeoman Generator 的类型
// Yeoman Generator 在工作时会自动调用我们在此类型中定义的一些生命周期方法
// 我们在这些方法中可以通过调用父类提供的一些工具方法实现一些功能，例如文件写入
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  // Yeoman 在询问用户环节会自动调用此方法 在此方法中可以调用父类的 prompt() 方法发出对用户的命令行询问
  prompting() {
    return this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Your project name',
        default: this.appname,
      },
    ]).then((answers) => {
      this.answers = answers;
    });
  }
  // Yeoman 自动在生成文件阶段调用此方法
  writing() {
    // 模板文件路径
    const tmpl = this.templatePath('index.html');
    // 输出目标路径
    const output = this.destinationPath('index.html');
    // 模板数据上下文
    const context = this.answers;

    this.fs.copyTpl(tmpl, output, context);

    // 模板文件路径
    const tmpl2 = this.templatePath('foo.txt');
    // 输出目标路径
    const output2 = this.destinationPath('foo.txt');
    // 模板数据上下文
    const context2 = this.answers;

    this.fs.copyTpl(tmpl2, output2, context2);
  }
};
