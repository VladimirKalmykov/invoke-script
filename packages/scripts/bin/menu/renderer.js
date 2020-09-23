const path = require("path");

const chalk = require(path.join(
  process.env.INVOKE_SCRIPT_CORE,
  "chalk"
));

const {
  PHASES
} = require("./constants");

const renderInputQuery = require("./renderers/renderInputQuery");
const renderScriptsList = require("./renderers/renderScriptsList");
const renderDescription = require("./renderers/renderDescription");
const renderArgsInput = require("./renderers/renderArgsInput");

const logUpdate = require("log-update");

module.exports = () => {
  let cachedPhase = null;

  return store => {
    const state = store.getState();

    let content;

    switch (state.phase) {
    case PHASES.SELECT_SCRIPT:
      content = `${renderInputQuery(state)}
        
${renderScriptsList(state)}
${renderDescription(state)}`;
      break;
    case PHASES.ENTER_ARGS:
      if (cachedPhase !== state.phase) {
        cachedPhase = state.phase;
        logUpdate.clear();
      }

      content = `${renderArgsInput(state)}`;
      break;
    case PHASES.RUN:
      if (cachedPhase !== state.phase) {
        cachedPhase = state.phase;
        logUpdate.clear();
        logUpdate.done();
      }
      break;
    default:
      content = "Not supported";
    }

    const debugLogKeys = Object.keys(state.debugLog);

    for (let i = 0; i < debugLogKeys.length; i++) {
      content += `\n${chalk.gray.bold(debugLogKeys[i])}${chalk.gray(":")} ${chalk.gray(state.debugLog[debugLogKeys[i]])}`;
    }

    logUpdate(content);
  };
};
