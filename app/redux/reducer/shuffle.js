import { SHUFFLE } from '@app/redux/constant/shuffle';

function reducer(state = true, action) {
  switch (action.type) {
    case SHUFFLE:
      return action.payload;

    default:
      return state;
  }
}

module.exports = reducer;
