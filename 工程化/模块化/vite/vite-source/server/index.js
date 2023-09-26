const connect = require('connect');
const serveStaticMiddleware = require('./middlewares/static');
const resolveConfig = require('./config');
const { createOptimizeDepsRun } = require('./optimizer');
const transformMiddleware = require('./middlewares/transform');
const { createPluginContainer } = require('./pluginContainer');
async function createServer() {
  const config = await resolveConfig();
  const middlewares = connect();
  const pluginContainer = await createPluginContainer(config);
  const server = {
    pluginContainer,
    async listen(port) {
      await runOptimize(config, server);
      require('http')
        .createServer(middlewares)
        .listen(port, async () => {
          console.log(`dev server running at: http://localhost:${port}`);
        });
    },
  };
  for (const plugin of config.plugins) {
    if (plugin.configureServer) {
      await plugin.configureServer(server);
    }
  }
  middlewares.use(transformMiddleware(server));
  middlewares.use(serveStaticMiddleware(config));
  return server;
}
async function runOptimize(config, server) {
  const optimizeDeps = await createOptimizeDepsRun(config);
  server._optimizeDepsMetadata = optimizeDeps.metadata;
}
exports.createServer = createServer;
