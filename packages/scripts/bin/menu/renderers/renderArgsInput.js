const path = require("path");

const chalk = require(path.join(
  process.env.INVOKE_SCRIPT_CORE,
  "chalk"
));

module.exports = function renderArgsInput(state) {
  const script = state.scripts[state.selectedScriptIndex];

  const inputText = state.inputCaretPos >= 0
    ? `${state.input.substring(0, state.inputCaretPos)}${chalk.inverse(state.input[state.inputCaretPos] || " ")}${state.input.substring(state.inputCaretPos + 1)}`
    : state.input;

  return `${chalk.bgCyan.black.bold("Enter args")} > ${chalk.bold(script.name)} ${inputText}

${chalk.gray(state.helpInfo)}
  `;
};
