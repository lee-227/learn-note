const execa = require('execa');

(async () => {
  const { stdout } = await execa('echo', ['unicorns']);
  console.log(stdout);
})();
