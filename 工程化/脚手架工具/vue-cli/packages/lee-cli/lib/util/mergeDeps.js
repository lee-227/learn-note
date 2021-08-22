function mergeDeps(sourceDeps, depsToInject) {
  const result = Object.assign({}, sourceDeps);
  for (const depName in depsToInject) {
    result[depName] = depsToInject[depName];
  }
  return result;
}

module.exports = mergeDeps;
