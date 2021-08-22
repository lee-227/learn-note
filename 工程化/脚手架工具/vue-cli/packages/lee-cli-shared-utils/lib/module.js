const Module = require('module');
const path = require('path');

exports.loadModule = function (request, context) {
  return Module.createRequire(path.resolve(context, 'package.json'))(request);
};
