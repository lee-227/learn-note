const path = require('path');
const fs = require('fs-extra');
function preAliasPlugin() {
  let server;
  return {
    name: 'vite:pre-alias',
    configureServer(_server) {
      server = _server;
    },
    resolveId(id) {
      const metadata = server._optimizeDepsMetadata;
      const isOptimized = metadata.optimized[id];
      if (isOptimized) {
        return {
          id: isOptimized.file,
        };
      }
    },
  };
}
module.exports = preAliasPlugin;
