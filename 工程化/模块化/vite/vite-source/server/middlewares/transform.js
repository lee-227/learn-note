const { isJSRequest } = require('../utils');
const send = require('../send');
const transformRequest = require('../transformRequest');
const { parse } = require('node:url');
function transformMiddleware(server) {
  return async function (req, res, next) {
    if (req.method !== 'GET') {
      return next();
    }
    let url = parse(req.url).pathname;
    // 29. js vue 都会进入此判断
    if (isJSRequest(url)) {
      // 20. 只处理 js 模块即可
      // 30. 进行 vue 转换工作
      const result = await transformRequest(url, server);
      // 27. 转换完成后 将结果返回至浏览器
      if (result) {
        const type = 'js';
        return send(req, res, result.code, type);
      }
    } else {
      return next();
    }
  };
}
module.exports = transformMiddleware;
