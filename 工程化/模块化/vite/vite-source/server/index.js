const connect = require('connect');
const serveStaticMiddleware = require('./middlewares/static');
const resolveConfig = require('./config');
const { createOptimizeDepsRun } = require('./optimizer');
const transformMiddleware = require('./middlewares/transform');
const { createPluginContainer } = require('./pluginContainer');
const { handleHMRUpdate } = require('./hmr');
const { createWebSocketServer } = require('./ws');
const { normalizePath } = require('../utils');
const chokidar = require('chokidar');
const { ModuleGraph } = require('./moduleGraph');
const path = require('path');
async function createServer() {
  const config = await resolveConfig();
  const middlewares = connect();
  const httpServer = require('http').createServer(middlewares);
  // 1.hmr serve 创建 ws 服务 同 http 公用一个端口
  const ws = createWebSocketServer(httpServer, config);
  // 2.hmr serve 监听文件变化
  const watcher = chokidar.watch(path.resolve(config.root), {
    ignored: ['**/node_modules/**', '**/.git/**'],
  });
  // 3.hmr serve 创建依赖图
  const moduleGraph = new ModuleGraph((url) => pluginContainer.resolveId(url));
  const pluginContainer = await createPluginContainer(config);
  const server = {
    config,
    ws,
    watcher,
    moduleGraph,
    httpServer,
    pluginContainer,
    async listen(port) {
      // 1. 启动服务前需要先 预编译第三方依赖
      await runOptimize(config, server);
      httpServer.listen(port, async () => {
        console.log(`dev server running at: http://localhost:${port}`);
      });
    },
  };
  // 12.hmr serve 文件发生变化后 开始热更新
  watcher.on('change', async (file) => {
    file = normalizePath(file);
    await handleHMRUpdate(file, server);
  });
  for (const plugin of config.plugins) {
    if (plugin.configureServer) {
      await plugin.configureServer(server);
    }
  }
  // 19. 修改第三方依赖的导入路径 以便能正确请求到预编译后的内容
  // 28. 对于 vue 文件的请求也会再次进行转换
  middlewares.use(transformMiddleware(server));
  // 创建静态资源中间件 返回静态资源
  middlewares.use(serveStaticMiddleware(config));
  return server;
}
async function runOptimize(config, server) {
  // 2. 开始执行预编译
  const optimizeDeps = await createOptimizeDepsRun(config);
  // 18. 预编译完成 将 _metadata 保存至 server 供后续使用
  server._optimizeDepsMetadata = optimizeDeps.metadata;
}
exports.createServer = createServer;
