import { REPEAT } from '@app/redux/constant/repeat';

function reducer(state = 'ALL', action) {
  switch (action.type) {
    case REPEAT:
      return action.payload;

    default:
      return state;
  }
}

module.exports = reducer;
