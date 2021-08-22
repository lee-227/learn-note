const ora = require('ora');
const spinner = ora();

exports.logWithSpinner = (msg) => {
  spinner.text = msg;
  spinner.start();
};

exports.stopSpinner = () => {
  spinner.stop();
};

exports.logWithSpinner('npm install');
setTimeout(() => {
  exports.stopSpinner();
}, 3000);
