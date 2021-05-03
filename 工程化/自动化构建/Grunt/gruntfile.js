// Grunt 的入口文件 用于定义一些需要 Grunt 自动执行的任务
// 需要导出一个函数 此函数接收一个 grunt 的对象类型的形参
// grunt 对象中提供一些创建任务时会用到的 API
const loadGruntTasks = require('load-grunt-tasks');
module.exports = (grunt) => {
  // grunt.initConfig() 用于为任务添加一些配置选项
  grunt.initConfig({
    // 键一般对应任务的名称
    // 值可以是任意类型的数据
    foo: {
      bar: 'baz',
    },
    // 注册多任务
    mulitTask: {
      options: {
        msg: 'lee',
      },
      foo: 1,
      bar: 2,
    },
    // 使用babel插件
    babel: {
      options: {
        sourceMap: true,
        presets: ['@babel/preset-env'],
      },
      main: {
        files: {
          'dist/js/app.js': 'src/js/app.js',
        },
      },
    },
  });
  // 通过 yarn grunt foo 执行任务
  grunt.registerTask('foo', () => {
    // 任务中可以使用 grunt.config() 获取配置
    console.log(grunt.config('foo'));
    // 如果属性值是对象的话，config 中可以使用点的方式定位对象中属性的值
    console.log(grunt.config('foo.bar'));
  });
  grunt.registerTask('bar', () => {
    grunt.task.run('foo');
    console.log('bar task ~');
    // 任务函数执行过程中如果返回 false 则意味着此任务执行失败
    // 如果一个任务列表中的某个任务执行失败,则后续任务默认不会运行,除非 grunt 运行时指定 --force 参数强制执行
    return false;
  });
  // default 是默认任务名称 通过 grunt 执行时可以省略
  // 第二个参数可以指定此任务的映射任务，映射的任务会按顺序依次执行，不会同步执行
  grunt.registerTask('default', ['bar', 'foo']);

  grunt.registerTask('async-task', function () {
    // 由于函数体中需要使用 this，所以这里不能使用箭头函数
    const done = this.async();
    setTimeout(() => {
      console.log('async task working~');
      // 异步函数中标记当前任务执行失败的方式是为回调函数指定一个 false 的实参
      done(false);
    }, 1000);
  });

  grunt.registerMultiTask('mulitTask', function () {
    console.log(this.options(), this.target, this.data);
  });
  // grunt.loadNpmTasks('grunt-babel'); // 会加载下载的babel插件 注册babel任务
  loadGruntTasks(grunt); // 自动加载所有的 grunt 插件中的任务
};
