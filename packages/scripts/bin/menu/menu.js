#!/usr/bin/env node
const {
  createStore,
  applyMiddleware
} = require("redux");

const {
  ACTIONS,
  PHASES
} = require("./constants");

/* Import renderers */
const createRenderer = require("./renderer");

/* Import reducers */
const selectScriptReducer = require("./reducers/selectScriptReducer");
const enterArgsReducer = require("./reducers/enterArgsReducer");

/* Import middlewares */
const middleware = require("./middleware");

if (!process.env.INVOKE_SCRIPT_CORE) {
  console.warn("This script should be executed with invoke-script command");
  process.exit(1);
}
const path = require("path");
const echo = require(path.join(
  process.env.INVOKE_SCRIPT_CORE,
  "echo"
));
const parseArgv = require(path.join(
  process.env.INVOKE_SCRIPT_CORE,
  "parse-argv"
));

const firstArg = (process.argv[2] || "").replace(/[./]/g, "");

const args = parseArgv(process.argv);

/* Help */
if (firstArg === "--help") {
  echo(`Select and run script from menu
  
    This script has no options
`);
  process.exit(0);
}

/*
 * stdin.on("keypress", (chunk, key) => {
 *   process.stdout.write(`Get Chunk: ${chunk}\n`);
 *   if (key && key.ctrl && key.name == "c") {
 *     process.exit();
 *   }
 * });
 */

const reducer = (state = {
  phase: PHASES.SELECT_SCRIPT,
  input: "",
  inputCaretPos: 0,
  scripts: [],
  selectedScriptIndex: 0,
  debugLog: {},
  args
}, action) => {
  switch (action.type) {
  case ACTIONS.LOG:
    return {
      ...state,
      debugLog: {
        ...state.debugLog,
        [action.name]: action.value
      }
    };
  case ACTIONS.SET_PHASE:
    return {
      ...state,
      input: "",
      phase: action.value
    };
  case ACTIONS.RUN_SCRIPT:
    return {
      ...state,
      phase: PHASES.RUN
    };
  default:
    switch (state.phase) {
    case PHASES.SELECT_SCRIPT:
      return selectScriptReducer(state, action);
    case PHASES.ENTER_ARGS:
      return enterArgsReducer(state, action);
    default:
      return state;
    }
  }
};

const debugMiddleare = () => next => action => next(action);

const store = createStore(reducer, applyMiddleware(debugMiddleare, middleware));

const renderer  = createRenderer();

store.subscribe(() => renderer(store));

store.dispatch({
  type: ACTIONS.START
});
/*
 * findLocalScripts({
 * cwd: process.cwd(),
 * ditailed: options.ditailed || options.realpath,
 * groupByLocation: options.groupByLocation,
 * match: firstParam,
 * keywords: keywords || false
 * })
 */
