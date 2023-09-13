import { createFilter } from 'rollup-pluginutils';
import babel from '@babel/core';
function plugin(pluginOptions = {}) {
  const defaultExtensions = ['.js', '.jsx'];
  const { exclude, include, extensions = defaultExtensions } = pluginOptions;
  const extensionRegExp = new RegExp(`(${extensions.join('|')})$`);
  const userDefinedFilter = createFilter(include, exclude);
  const filter = (id) => extensionRegExp.test(id) && userDefinedFilter(id);
  return {
    name: 'babel',
    async transform(code, filename) {
      if (!filter(filename)) return null;
      let result = await babel.transformAsync(code);
      return result;
    },
  };
}
export default plugin;
