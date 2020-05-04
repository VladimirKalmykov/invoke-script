const {
  ACTIONS
} = require("../constants");

module.exports = function selectScriptReducer(state, action) {
  switch (action.type) {
  case ACTIONS.MOVE_LEFT: {
    let selectedScriptIndex = state.selectedScriptIndex - 1;

    if (selectedScriptIndex < 0) {
      selectedScriptIndex = state.scripts.length - 1;
    }

    return {
      ...state,
      selectedScriptIndex
    };
  }
  case ACTIONS.MOVE_RIGHT: {
    let selectedScriptIndex = state.selectedScriptIndex + 1;

    if (selectedScriptIndex > state.scripts.length - 1) {
      selectedScriptIndex = 0;
    }

    return {
      ...state,
      selectedScriptIndex
    };
  }
  case ACTIONS.SETQUERY: {
    return {
      ...state,
      input: action.value
    };
  }
  case ACTIONS.UPDATE_SCRIPTS: {
    const scripts = action.value;
    let selectedScriptIndex = state.selectedScriptIndex;

    if (selectedScriptIndex > scripts.length - 1) {
      selectedScriptIndex = Math.max(0, scripts.length - 1);
    }

    return {
      ...state,
      selectedScriptIndex,
      scripts
    };
  }
  default:
    return state;
  }
};
