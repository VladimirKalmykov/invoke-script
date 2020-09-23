const path = require("path");

const chalk = require(path.join(
  process.env.INVOKE_SCRIPT_CORE,
  "chalk"
));

const builtInPath = path.dirname(require.resolve("@invoke-script/scripts"));

module.exports = function renderScriptsList(state) {
  /* Sort by location */

  return state.scriptGroups.map((group, groupIndex) => {
    const scriptsText = group.scripts.map((variant, index) => (index === state.selectedScriptIndex && groupIndex === state.selectedScriptGroupIndex
      ? chalk.black.bgGreen(variant.name)
      : variant.name))
      .join(" ");

    return `${chalk.gray(group.path.startsWith(builtInPath) ? "Built-in" : group.path)}
    
${scriptsText}`;
  })
    .join("\n\n");
};
