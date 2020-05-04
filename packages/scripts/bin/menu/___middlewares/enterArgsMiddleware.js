const {
  PHASES,
  ACTIONS
} = require("../constants");
const {
  exec
} = require("child_process");

module.exports = store => next => action => {
  const state = store.getState();

  if (state.phase === PHASES.ENTER_ARGS) {
    switch (action.type) {
    case ACTIONS.ACCEPT: {
      /* Execute command */
      const command = `${state.scripts[state.selectedScriptIndex].name} ${state.input}`;

      try {
        exec(command, {
          cwd: process.cwd()
        }, (error, stdout) => {
          if (error) {
            throw error;
          } else {
            console.log("ok");
          }
        });
        /*
         * child.stderr.on('data', (error) => {
         *   reject(error);
         * });
         */
      } catch (e) {
        throw e();
      }
      break;
    }
    default:
      break;
    }
  }

  return next(action);
};
