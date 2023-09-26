const path = require('path');
const LexerState = {
  inCall: 0,
  inSingleQuoteString: 1,
  inTemplateString: 2,
};
function getShortName(file, root) {
  return file.startsWith(root + '/') ? path.posix.relative(root, file) : file;
}
async function handleHMRUpdate(file, server) {
  const { config, moduleGraph } = server;
  const shortFile = getShortName(file, config.root);
  const modules = moduleGraph.getModulesByFile(file) || [];
  updateModules(shortFile, modules, server);
}

function updateModules(file, modules, { ws }) {
  const updates = [];
  for (const mod of modules) {
    const boundaries = new Set();
    propagateUpdate(mod, boundaries);
    updates.push(
      ...[...boundaries].map(({ boundary, acceptedVia }) => ({
        type: `${boundary.type}-update`,
        path: boundary.url,
        acceptedPath: acceptedVia.url,
      }))
    );
  }
  ws.send({
    type: 'update',
    updates,
  });
}
function propagateUpdate(node, boundaries) {
  if (!node.importers.size) {
    return true;
  }
  for (const importer of node.importers) {
    if (importer.acceptedHmrDeps.has(node)) {
      boundaries.add({
        boundary: importer,
        acceptedVia: node,
      });
      continue;
    }
  }
  return false;
}
function lexAcceptedHmrDeps(code, start, urls) {
  let state = LexerState.inCall;
  let prevState = LexerState.inCall;
  let currentDep = '';
  function addDep(index) {
    urls.add({
      url: currentDep,
      start: index - currentDep.length - 1,
      end: index + 1,
    });
    currentDep = '';
  }
  for (let i = start; i < code.length; i++) {
    const char = code.charAt(i);
    switch (state) {
      case LexerState.inCall:
        if (char === `'`) {
          prevState = state;
          state = LexerState.inSingleQuoteString;
        }
        break;
      case LexerState.inSingleQuoteString:
        if (char === `'`) {
          addDep(i);
          return false;
        } else {
          currentDep += char;
        }
        break;
      default:
        break;
    }
  }
  return false;
}
exports.handleHMRUpdate = handleHMRUpdate;
exports.updateModules = updateModules;
exports.lexAcceptedHmrDeps = lexAcceptedHmrDeps;
