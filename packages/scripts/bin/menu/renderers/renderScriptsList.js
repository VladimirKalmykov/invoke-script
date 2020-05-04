const path = require("path");

const chalk = require(path.join(
  process.env.INVOKE_SCRIPT_CORE,
  "chalk"
));

module.exports = function renderScriptsList(state) {
  return state.scripts.map((variant, index) => (index === state.selectedScriptIndex
    ? chalk.black.bgGreen(variant.name)
    : variant.name))
    .join("\t");
};
