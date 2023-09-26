const fs = require('fs-extra');
async function transformRequest(url, server) {
  const { pluginContainer } = server;
  const { id } = await pluginContainer.resolveId(url);
  const loadResult = await pluginContainer.load(id);
  let code;
  if (loadResult) {
    code = loadResult.code;
  } else {
    code = await fs.readFile(id, 'utf-8');
  }
  await server.moduleGraph.ensureEntryFromUrl(url);
  const transformResult = await pluginContainer.transform(code, id);
  return transformResult;
}
module.exports = transformRequest;
