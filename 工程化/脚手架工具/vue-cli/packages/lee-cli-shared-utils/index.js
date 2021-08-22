exports.chalk = require('chalk');
exports.execa = require('execa');
['pluginResolution', 'module'].forEach((m) => {
  Object.assign(exports, require(`./lib/${m}`));
});
