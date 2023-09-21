export default function dynamicImportPolyfillPlugin() {
  return {
    name: 'dynamic-import-polyfill',
    renderDynamicImport() {
      return {
        left: 'dynamicImportPolyfill(',
        right: ', import.meta.url)',
      };
    },
  };
}
