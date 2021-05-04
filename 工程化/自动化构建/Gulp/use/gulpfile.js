// gulpfile 导出的函数都会作为 gulp 任务
// gulp 的任务都是异步的，通过传入的回调函数done标识任务完成

// 通过 yarn gulp foo 执行该任务
exports.foo = (done) => {
  console.log('foo task');
  done();
};

// default 默认任务 执行时不需要加任务名
exports.default = (done) => {
  console.log('default task');
  done();
};

// v4.0 之前需要通过 gulp.task() 方法注册任务
const gulp = require('gulp');

gulp.task('bar', (done) => {
  console.log('bar task working~');
  done();
});

// 任务的串行跟并行
const { series, parallel } = require('gulp');
const task1 = (done) => {
  setTimeout(() => {
    console.log('task1 working~');
    done();
  }, 1000);
};

const task2 = (done) => {
  setTimeout(() => {
    console.log('task2 working~');
    done();
  }, 1000);
};

const task3 = (done) => {
  setTimeout(() => {
    console.log('task3 working~');
    done();
  }, 1000);
};

exports.series = series(task1, task2, task3); // 串行
exports.parallel = parallel(task1, task2, task3); // 并行

// gulp 的异步任务

exports.callback = (done) => {
  console.log('callback task');
  done();
};
exports.callback_error = (done) => {
  console.log('callback_error task');
  // 通过回调函数传入错误参数 标识任务执行失败
  done(new Error('task failed'));
};
exports.promise = () => {
  console.log('promise task');
  return Promise.resolve();
};
exports.promise_error = () => {
  console.log('promise_error task');
  // 通过返回reject状态的promise 标识任务失败
  return Promise.reject(new Error('task failed'));
};
// promise的语法糖 等同于返回了一个promise 等promise转成resolve状态时 任务完成
exports.async = async () => {
  await timeout(1000);
  console.log('async task');
};

// gulp 流任务，当读取流触发end事件后 标识任务完成，需要返回该读取流
const fs = require('fs');
const { Transform } = require('stream');
exports.stream = () => {
  const read = fs.createReadStream('yarn.lock');
  const write = fs.createWriteStream('a.txt');
  // 文件转换流
  const transformStream = new Transform({
    // 核心转换过程
    transform: (chunk, encoding, callback) => {
      const input = chunk.toString();
      const output = input.replace(/\s+/g, '').replace(/\/\*.+?\*\//g, '');
      callback(null, output);
    },
  });
  read.pipe(transformStream).pipe(write);
  return read;
};

// gulp 封装的流操作 src读取流 dest写入流
const { src, dest } = require('gulp');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
exports.default = () => {
  return src('src/*.css')
    .pipe(cleanCSS())
    .pipe(rename({ extname: '.min.css' }))
    .pipe(dest('dist'));
};
