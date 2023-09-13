export default function resolveFileUrl() {
  return {
    name: 'resolveFileUrl',
    resolveId(source) {
      if (source === 'logger') {
        return source;
      }
    },
    load(importee) {
      if (importee === 'logger') {
        let referenceId = this.emitFile({
          type: 'asset',
          source: 'console.log("logger")',
          fileName: 'logger.js',
        });
        return `export default import.meta.ROLLUP_FILE_URL_${referenceId}`;
      }
    },
    resolveFileUrl({
      chunkId,
      fileName,
      format,
      moduleId,
      referenceId,
      relativePath,
    }) {
      //import.meta.url
      return `new URL('${fileName}', document.baseURI).href`;
    },
  };
}
