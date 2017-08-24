import { USER } from '@app/redux/constant/user';

function reducer(state = null, action) {
  switch (action.type) {
    case USER:
      return action.payload;

    default:
      return state;
  }
}

module.exports = reducer;
