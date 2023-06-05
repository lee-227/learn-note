const { src, dest, series, watch } = require('gulp');
const browserSync = require('browser-sync'); // 启动服务
const bs = browserSync.create();

const script = () => {
  return src('src/**/*.js', { base: 'src' })
    .pipe(dest('temp'))
    .pipe(bs.reload({ stream: true }));
};
const page = () => {
  return src('src/*.html', { base: 'src' })
    .pipe(dest('temp'))
    .pipe(bs.reload({ stream: true }));
};
const serve = () => {
  watch('src/**/*.js', script);
  watch('src/*.html', page);
  bs.init({
    notify: false,
    port: 8888,
    open: true,
    // files: 'dist/**', // 开机监听 当dist中文件发生变化时会自动更新浏览器内容
    server: {
      baseDir: ['src'],
      routes: {
        '/node_modules': 'node_modules', // 重定向 当请求/node_modules时 会到 noed_modules 找对应的资源
      },
    },
  });
};
const develop = series(script, serve);
module.exports = {
  develop,
};
