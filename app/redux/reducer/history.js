import { HISTORY_PUSH, HISTORY_POP } from 'app/redux/constant/history';

function reducer(state = [], action) {
  switch (action.type) {
    case HISTORY_PUSH:
      return [action.payload, ...state];

    case HISTORY_POP:
      return [...state.slice(1)];

    default:
      return state;
  }
}

module.exports = reducer;
