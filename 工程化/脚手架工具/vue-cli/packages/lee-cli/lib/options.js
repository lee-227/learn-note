exports.defaultPreset = {
  useConfigFiles: false,
  cssPreprocessor: undefined,
  plugins: {
    '@vue/cli-plugin-babel': {},
    '@vue/cli-plugin-eslint': {
      config: 'base',
      lintOn: ['save'],
    },
  },
};

exports.defaults = {
  presets: {
    default: Object.assign({ vueVersion: '2' }, exports.defaultPreset),
    __default_vue_3__: Object.assign(
      { vueVersion: '3' },
      exports.defaultPreset,
    ),
  },
};
