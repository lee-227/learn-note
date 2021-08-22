const path = require('path');
const Creator = require('./Creator');
const { getPromptModules } = require('./util/createTools');

async function create(projectName, options) {
  const cwd = process.cwd();
  const name = projectName;
  const targetDir = path.resolve(cwd, projectName);
  const promptModules = getPromptModules();
  const creator = new Creator(name, targetDir, promptModules);
  await creator.create();
}

module.exports = (...args) => {
  return create(...args).catch((err) => {
    console.log(err);
  });
};
