function normalizePath(id) {
  return id.replace(/\\/g, '/');
}
exports.normalizePath = normalizePath;

const knownJsSrcRE = /\.js/;
const isJSRequest = (url) => {
  if (knownJsSrcRE.test(url)) {
    return true;
  }
  return false;
};
exports.isJSRequest = isJSRequest;
