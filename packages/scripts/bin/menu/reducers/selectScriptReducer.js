const {
  ACTIONS
} = require("../constants");

function selectScriptsLength(scriptGroups, index) {
  return scriptGroups.length > index
    ? scriptGroups[index].scripts.length || 0
    : 0;
}

function validateAndFixSelect(state, selectedScriptGroupIndex) {
  let {
    selectedScriptIndex
  } = state;

  if (selectedScriptIndex > selectScriptsLength(state.scriptGroups, selectedScriptGroupIndex) - 1) {
    selectedScriptIndex = 0;
  }

  return {
    selectedScriptIndex
  };
}

module.exports = function selectScriptReducer(state, action) {
  switch (action.type) {
  case ACTIONS.MOVE_LEFT: {
    let selectedScriptIndex = state.selectedScriptIndex - 1;

    if (selectedScriptIndex < 0) {
      selectedScriptIndex = Math.max(0, selectScriptsLength(state.scriptGroups, state.selectedScriptGroupIndex) - 1);
    }

    return {
      ...state,
      selectedScriptIndex
    };
  }
  case ACTIONS.MOVE_RIGHT: {
    let selectedScriptIndex = state.selectedScriptIndex + 1;

    if (selectedScriptIndex > selectScriptsLength(state.scriptGroups, state.selectedScriptGroupIndex) - 1) {
      selectedScriptIndex = 0;
    }

    return {
      ...state,
      selectedScriptIndex
    };
  }
  case ACTIONS.MOVE_UP: {
    let selectedScriptGroupIndex = state.selectedScriptGroupIndex - 1;

    if (selectedScriptGroupIndex < 0) {
      selectedScriptGroupIndex = state.scriptGroups.length - 1;
    }

    return {
      ...state,
      ...validateAndFixSelect(state, selectedScriptGroupIndex),
      selectedScriptGroupIndex
    };
  }
  case ACTIONS.MOVE_DOWN: {
    let selectedScriptGroupIndex = state.selectedScriptGroupIndex + 1;

    if (selectedScriptGroupIndex > state.scriptGroups.length - 1) {
      selectedScriptGroupIndex = 0;
    }

    return {
      ...state,
      ...validateAndFixSelect(state, selectedScriptGroupIndex),
      selectedScriptGroupIndex
    };
  }
  case ACTIONS.SETQUERY: {
    return {
      ...state,
      input: action.value
    };
  }
  case ACTIONS.UPDATE_SCRIPT_GROUPS: {
    const scriptGroups = action.value;
    let {
      selectedScriptIndex,
      selectedScriptGroupIndex
    } = state;

    if (selectedScriptGroupIndex > scriptGroups.length - 1) {
      selectedScriptGroupIndex = Math.max(0, scriptGroups.length - 1);
    }

    if (selectedScriptIndex > selectScriptsLength(scriptGroups, selectedScriptGroupIndex) - 1) {
      selectedScriptIndex = Math.max(0, selectScriptsLength(scriptGroups, selectedScriptGroupIndex) - 1);
    }

    return {
      ...state,
      selectedScriptIndex,
      scriptGroups
    };
  }
  default:
    return state;
  }
};
