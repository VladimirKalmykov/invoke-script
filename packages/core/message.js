const chalk = require("chalk");

module.exports = function message(m) {
  console.log(chalk.cyan(m));
};
