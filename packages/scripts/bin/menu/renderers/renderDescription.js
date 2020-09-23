const path = require("path");

const chalk = require(path.join(
  process.env.INVOKE_SCRIPT_CORE,
  "chalk"
));


module.exports = function renderDescription(state) {
  const activeScript = state.scriptGroups.length > state.selectedScriptGroupIndex && state.scriptGroups[state.selectedScriptGroupIndex].scripts.length > state.selectedScriptIndex
    ? state.scriptGroups[state.selectedScriptGroupIndex].scripts[state.selectedScriptIndex]
    : null;

  if (activeScript) {
    return `
${chalk.cyan(activeScript.description)}`;
  }

  return "";
};
