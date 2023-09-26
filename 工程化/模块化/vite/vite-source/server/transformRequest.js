const fs = require('fs-extra');
async function transformRequest(url, server) {
  const { pluginContainer } = server;
  // 21. 解析是否是经过预构建的路径 是的话直接返回预构建后的路径
  const { id } = await pluginContainer.resolveId(url);
  // 21. 暂未用到 load 加载模块
  const loadResult = await pluginContainer.load(id);
  let code;
  if (loadResult) {
    code = loadResult.code;
  } else {
    code = await fs.readFile(id, 'utf-8');
  }
  await server.moduleGraph.ensureEntryFromUrl(url);
  // 22. 开始转换路径
  // 31. 开始转换 vue 文件 使用 vue 插件的 transform 方法
  const transformResult = await pluginContainer.transform(code, id);
  return transformResult;
}
module.exports = transformRequest;
