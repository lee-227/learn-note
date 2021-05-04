const { src, dest, parallel, series, watch } = require('gulp');

const del = require('del'); // 删除模块
const browserSync = require('browser-sync'); // 启动服务

const loadPlugins = require('gulp-load-plugins'); // 会自动加载所有的gulp插件

const plugins = loadPlugins(); // 所有插件都放到了plugins对象中 名字为去掉gulp-之后的字段
const bs = browserSync.create();

const data = {
  menus: [
    {
      name: 'Home',
      icon: 'aperture',
      link: 'index.html',
    },
    {
      name: 'Features',
      link: 'features.html',
    },
    {
      name: 'About',
      link: 'about.html',
    },
    {
      name: 'Contact',
      link: '#',
      children: [
        {
          name: 'Twitter',
          link: 'https://twitter.com/w_zce',
        },
        {
          name: 'About',
          link: 'https://weibo.com/zceme',
        },
        {
          name: 'divider',
        },
        {
          name: 'About',
          link: 'https://github.com/zce',
        },
      ],
    },
  ],
  pkg: require('./package.json'),
  date: new Date(),
};

const clean = () => {
  return del(['dist', 'temp']);
};
const style = () => {
  return src('src/assets/styles/*.scss', { base: 'src' })
    .pipe(plugins.sass({ outputStyle: 'expanded' }))
    .pipe(dest('temp'))
    .pipe(bs.reload({ stream: true }));
};
const script = () => {
  return src('src/assets/scripts/*.js', { base: 'src' })
    .pipe(plugins.babel({ presets: ['@babel/preset-env'] }))
    .pipe(dest('temp'))
    .pipe(bs.reload({ stream: true }));
};
const page = () => {
  return src('src/*.html', { base: 'src' })
    .pipe(plugins.swig({ data, defaults: { cache: false } }))
    .pipe(dest('temp'))
    .pipe(bs.reload({ stream: true }));
};
const image = () => {
  return src('src/assets/images/**', { base: 'src' })
    .pipe(plugins.imagemin())
    .pipe(dest('dist'));
};

const font = () => {
  return src('src/assets/fonts/**', { base: 'src' })
    .pipe(plugins.imagemin())
    .pipe(dest('dist'));
};

const extra = () => {
  return src('public/**', { base: 'public' }).pipe(dest('dist'));
};

const serve = () => {
  watch('src/assets/styles/*.scss', style);
  watch('src/assets/scripts/*.js', script);
  watch('src/*.html', page);
  watch(
    ['src/assets/images/**', 'src/assets/fonts/**', 'public/**'],
    bs.reload
  );
  bs.init({
    notify: false,
    port: 8888,
    open: true,
    // files: 'dist/**', // 开机监听 当dist中文件发生变化时会自动更新浏览器内容
    server: {
      baseDir: ['temp', 'src', 'public'],
      routes: {
        '/node_modules': 'node_modules', // 重定向 当请求/node_modules时 会到 noed_modules 找对应的资源
      },
    },
  });
};

const useref = () => {
  return (
    src('temp/*.html', { base: 'temp' })
      .pipe(plugins.useref({ searchPath: ['temp', '.'] }))
      // html js css
      .pipe(plugins.if(/\.js$/, plugins.uglify()))
      .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
      .pipe(
        plugins.if(
          /\.html$/,
          plugins.htmlmin({
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: true,
          })
        )
      )
      .pipe(dest('dist'))
  );
};
const compile = parallel(style, script, page);

// 上线之前执行的任务
const build = series(
  clean,
  parallel(series(compile, useref), image, font, extra)
);

const develop = series(compile, serve);

module.exports = {
  clean,
  build,
  develop,
};
