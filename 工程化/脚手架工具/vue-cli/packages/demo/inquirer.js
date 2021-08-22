const inquirer = require('inquirer');
const isManualMode = (answers) => answers.preset === '__manual__';
let defaultPreset = {
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
let presets = {
  default: Object.assign({ vueVersion: '2' }, defaultPreset),
  __default_vue_3__: Object.assign({ vueVersion: '3' }, defaultPreset),
};
const presetChoices = Object.entries(presets).map(([name, preset]) => {
  let displayName = name;
  if (name === 'default') {
    displayName = 'Default';
  } else if (name === '__default_vue_3__') {
    displayName = 'Default (Vue 3)';
  }
  return {
    name: `${displayName}`,
    value: name,
  };
});
const presetPrompt = {
  name: 'preset',
  type: 'list',
  message: `Please pick a preset:`,
  choices: [
    ...presetChoices,
    {
      name: 'Manually select features',
      value: '__manual__',
    },
  ],
};
let features = [
  'vueVersion',
  'babel',
  'typescript',
  'pwa',
  'router',
  'vuex',
  'cssPreprocessors',
  'linter',
  'unit',
  'e2e',
];
const featurePrompt = {
  name: 'features',
  when: isManualMode,
  type: 'checkbox',
  message: 'Check the features needed for your project:',
  choices: features,
  pageSize: 10,
};
const prompts = [presetPrompt, featurePrompt];

(async function () {
  let result = await inquirer.prompt(prompts);
  console.log(result);
})();
