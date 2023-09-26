function normalizePath(id) {
  return id.replace(/\\/g, '/');
}
exports.normalizePath = normalizePath;

const knownJsSrcRE = /\.(js|vue)/;
const isJSRequest = (url) => {
  if (knownJsSrcRE.test(url)) {
    return true;
  }
  return false;
};
exports.isJSRequest = isJSRequest;
