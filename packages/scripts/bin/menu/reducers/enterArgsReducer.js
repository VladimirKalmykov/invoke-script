const {
  ACTIONS
} = require("../constants");

module.exports = (state, action) => {
  switch (action.type) {
  case ACTIONS.INPUT: {
    return {
      ...state,
      input: state.input.substring(0, state.inputCaretPos) + action.value + state.input.substring(state.inputCaretPos),
      inputCaretPos: Math.max(0, Math.min(state.inputCaretPos + 1, state.input.length + 1))
    };
  }
  case ACTIONS.DELETE: {
    return {
      ...state,
      input: state.input.substring(0, state.inputCaretPos) + state.input.substring(state.inputCaretPos + 1)
    };
  }
  case ACTIONS.BACKSPACE: {
    return {
      ...state,
      input: state.input.substring(0, state.input.length - 1),
      inputCaretPos: Math.max(0, state.inputCaretPos - 1)
    };
  }
  case ACTIONS.MOVE_LEFT:
    return {
      ...state,
      inputCaretPos: Math.max(0, state.inputCaretPos - 1)
    };
  case ACTIONS.MOVE_RIGHT:
    return {
      ...state,
      inputCaretPos: Math.min(state.inputCaretPos + 1, state.input.length)
    };
  default:
    return state;
  }
};
