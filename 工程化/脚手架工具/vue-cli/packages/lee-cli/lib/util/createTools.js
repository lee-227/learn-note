exports.getPromptModules = () => {
  return ['vueVersion'].map((file) => require(`../promptModules/${file}`));
};
