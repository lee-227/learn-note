const Bundle = require('./bundle');
function rollup(entry, filename) {
  const bundle = new Bundle({ entry });
  bundle.build(filename);
}
module.exports = rollup;
