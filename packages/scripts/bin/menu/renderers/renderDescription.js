const path = require("path");

const chalk = require(path.join(
  process.env.INVOKE_SCRIPT_CORE,
  "chalk"
));


module.exports = function renderDescription(state) {
  const activeScript = state.selectedScriptIndex >= 0
    ? state.scripts[state.selectedScriptIndex]
    : null;

  if (activeScript) {
    return `
${chalk.cyan(activeScript.description)}`;
  }

  return "";
};
