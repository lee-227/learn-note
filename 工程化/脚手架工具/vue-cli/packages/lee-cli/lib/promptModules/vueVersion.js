module.exports = (cli) => {
  //cli.injectFeature 是注入 featurePrompt，即初始化项目时选择 babel，typescript，pwa 等等
  cli.injectFeature({
    name: 'Choose Vue version',
    value: 'vueVersion',
    description:
      'Choose a version of Vue.js that you want to start the project with',
    checked: true,
  });
  //cli.injectPrompt 是根据选择的 featurePrompt 然后注入对应的 prompt，当选择了 unit，接下来会有以下的 prompt，选择 Mocha + Chai 还是 Jest
  cli.injectPrompt({
    name: 'vueVersion',
    when: (answers) => answers.features.includes('vueVersion'),
    message:
      'Choose a version of Vue.js that you want to start the project with',
    type: 'list',
    choices: [
      {
        name: '2.x',
        value: '2',
      },
      {
        name: '3.x',
        value: '3',
      },
    ],
    default: '2',
  });
  //cli.onPromptComplete 就是一个回调，会根据选择来添加对应的插件， 当选择了 mocha ，那么就会添加 @vue/cli-plugin-unit-mocha 插件
  cli.onPromptComplete((answers, options) => {
    if (answers.vueVersion) {
      options.vueVersion = answers.vueVersion;
    }
  });
};
