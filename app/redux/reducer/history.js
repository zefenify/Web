import { HISTORY_PUSH, HISTORY_POP, HISTORY_FRONT } from '@app/redux/constant/history';

function reducer(state = [], action) {
  switch (action.type) {
    case HISTORY_PUSH:
      return [action.payload, ...state];

    case HISTORY_POP:
      return [...state.slice(0, action.payload), ...state.slice(action.payload + 1)];

    case HISTORY_FRONT:
      // eslint-disable-next-line
      return [state[action.payload], ...state.slice(0, action.payload), ...state.slice(action.payload + 1)];

    default:
      return state;
  }
}

module.exports = reducer;
