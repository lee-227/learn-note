const Bundle = require('./bundle');
function rollup(entry, filename) {
  // 创建 bundle 类似 webpack 中的 chunk 既模块的集合
  const bundle = new Bundle({ entry });
  bundle.build(filename);
}
module.exports = rollup;
