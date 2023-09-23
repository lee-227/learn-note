const connect = require('connect');
const serveStaticMiddleware = require('./middlewares/static');
const resolveConfig = require('./config');
const { createOptimizeDepsRun } = require('./optimizer');
async function createServer() {
  const config = await resolveConfig();
  const middlewares = connect();
  const server = {
    async listen(port) {
      await runOptimize(config, server);
      require('http')
        .createServer(middlewares)
        .listen(port, async () => {
          console.log(`dev server running at: http://localhost:${port}`);
        });
    },
  };
  middlewares.use(serveStaticMiddleware(config));
  return server;
}
async function runOptimize(config, server) {
  const optimizeDeps = await createOptimizeDepsRun(config);
  server._optimizeDepsMetadata = optimizeDeps.metadata;
}
exports.createServer = createServer;
