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
  // 13.hmr serve 通过变化的文件路径找到对应模块
  const modules = moduleGraph.getModulesByFile(file) || [];
  updateModules(shortFile, modules, server);
}

function updateModules(file, modules, { ws }) {
  const updates = [];
  for (const mod of modules) {
    const boundaries = new Set();
    // 14.hmr serve 构建热更新信息
    propagateUpdate(mod, boundaries);
    updates.push(
      ...[...boundaries].map(({ boundary, acceptedVia }) => ({
        type: `${boundary.type}-update`,
        path: boundary.url,
        acceptedPath: acceptedVia.url,
      }))
    );
  }
  // 16.hmr serve 发送至客户端 通知热更新
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
      // 15.hmr serve 找到父模块 且 父模块接受此模块的热更新
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
