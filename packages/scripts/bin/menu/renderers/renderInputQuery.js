const path = require("path");

const chalk = require(path.join(
  process.env.INVOKE_SCRIPT_CORE,
  "chalk"
));

module.exports = function renderInputQuery(state) {
  return `${chalk.bgCyan.black.bold("Invoke:")} > ${state.input}`;
};
