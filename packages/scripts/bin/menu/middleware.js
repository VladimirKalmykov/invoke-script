const path = require("path");
const {
  PHASES,
  ACTIONS
} = require("./constants");
const {
  parseArgsStringToArgv
} = require("string-argv");
const {
  exec
} = require("child_process");

const findLocalScripts = require(path.join(
  process.env.INVOKE_SCRIPT_CORE,
  "find-local-scripts"
));
const findLocalScript = require(path.join(
  process.env.INVOKE_SCRIPT_CORE,
  "find-local-script"
));

const runScript = require(path.join(
  process.env.INVOKE_SCRIPT_CORE,
  "run-script"
));

function phaseMiddleware(store, action) {
  const state = store.getState();

  if (state.phase === PHASES.SELECT_SCRIPT) {
    switch (action.type) {
    /* User input letters */
    case ACTIONS.INPUT:
      store.dispatch({
        type: ACTIONS.SETQUERY,
        value: state.input + action.value
      });
      break;
    /* User press backspace or delete */
    case ACTIONS.BACKSPACE:
      store.dispatch({
        type: ACTIONS.SETQUERY,
        value: state.input.substring(0, state.input.length - 1)
      });
      break;
    /* Set query */
    case ACTIONS.SETQUERY: {
      const pattern = `${action.value ? `*${action.value}` : ""}*`;

      findLocalScripts({
        cwd: process.cwd(),
        ditailed: true,
        groupByLocation: false,
        match: pattern,
        keywords: false
      })
        .then(plainScripts => {
          /* Derive by groups */
          const locationIndexesInGroups = {};
          const groups = [];

          for (let i = 0; i < plainScripts.length; i++) {
            if (!locationIndexesInGroups.hasOwnProperty(plainScripts[i].location)) {
              locationIndexesInGroups[plainScripts[i].location] = groups.length;
              groups.push({
                path: plainScripts[i].location,
                scripts: []
              });
            }

            groups[locationIndexesInGroups[plainScripts[i].location]].scripts.push(plainScripts[i]);
          }

          groups.map(group => {
            /* Sort by rating and location */
            group.scripts.sort((script1, script2) => {
              if (script2.stats.executedTimes === script1.stats.executedTimes) {
                return 0;
              }

              return script2.stats.executedTimes > script1.stats.executedTimes
                ? 1
                : -1;
            });

            return group;
          });

          store.dispatch({
            type: ACTIONS.UPDATE_SCRIPT_GROUPS,
            value: groups
          });
        });
    }
      break;
    /* User accept selected script */
    case ACTIONS.ACCEPT:
      if (state.selectedScriptIndex >= 0 && state.selectedScriptIndex <= state.scriptGroups.length - 1) {
        store.dispatch({
          type: ACTIONS.SET_PHASE,
          value: PHASES.ENTER_ARGS
        });
      }
      break;
    case ACTIONS.SET_PHASE:
      if (action.value === PHASES.ENTER_ARGS) {
        /* Load script info */
        exec(`invoke ${state.scriptGroups[state.selectedScriptGroupIndex].scripts[state.selectedScriptIndex].path} --help`, {
          cwd: process.cwd(),
          charset: "utf-8"
        }, (error, data) => {
          if (!error) {
            store.dispatch({
              type: ACTIONS.SET_HELP_INFO,
              value: data
            });
          }
        });
      }
      break;
    default:
      break;
    }
  } else if (state.phase === PHASES.ENTER_ARGS) {
    switch (action.type) {
    case ACTIONS.ACCEPT: {
      /* Execute command */
      const args = parseArgsStringToArgv(state.input);

      findLocalScript(state.scriptGroups[state.selectedScriptGroupIndex].scripts[state.selectedScriptIndex].name)
        .then(scriptBinaryPath => {
          store.dispatch({
            type: ACTIONS.RUN_SCRIPT,
            script: scriptBinaryPath,
            args
          });
        })
        .catch(e => {
          throw e;
        });
      break;
    }
    default:
      break;
    }
  }
}

module.exports = store => {
  const onStdinDataHandler = ch => {
    if (ch === "\u0003") {
      process.exit();
    } else if (ch === "\u000D") {
      store.dispatch({
        type: ACTIONS.ACCEPT
      });
    } else if (ch === "\u0008" || ch === "\u007f") {
      store.dispatch({
        type: ACTIONS.BACKSPACE
      });
    } else if (ch === "\u001B") {
      store.dispatch({
        type: ACTIONS.DELETE
      });
    } else if (ch === "\u001B\u005B\u0041") {
      store.dispatch({
        type: ACTIONS.MOVE_UP
      });
    } else if (ch === "\u001B\u005B\u0043") {
      store.dispatch({
        type: ACTIONS.MOVE_RIGHT
      });
    } else if (ch === "\u001B\u005B\u0042") {
      store.dispatch({
        type: ACTIONS.MOVE_DOWN
      });
    } else if (ch === "\u001B\u005B\u0044") {
      store.dispatch({
        type: ACTIONS.MOVE_LEFT
      });
    } else if (ch.charCodeAt(0) > 27) {
      // store.dispatch({
      //   type: ACTIONS.LOG,
      //   name: "char",
      //   value: ch.charCodeAt(0)
      // });
      store.dispatch({
        type: ACTIONS.INPUT,
        value: ch
      });
    }
  };


  return next => action => {
    const state = store.getState();

    switch (action.type) {
    case ACTIONS.START: {
      const stdin = process.stdin;

      stdin.setEncoding("utf8");

      stdin.setRawMode(true);

      // on any data into stdin
      stdin.on("data", onStdinDataHandler);

      console.clear();

      store.dispatch({
        type: ACTIONS.INPUT,
        value: ""
      });
    }
      break;
    case ACTIONS.RUN_SCRIPT:
      console.clear();
      process.stdin.off("data", onStdinDataHandler);
      runScript(action.script, action.args, {
        cwd: process.cwd()
      })
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
      break;
    default:
      phaseMiddleware(store, action);
      break;
    }


    return next(action);
  };
};
