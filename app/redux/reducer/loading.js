import { LOADING } from '@app/redux/constant/loading';

function reducer(state = false, action) {
  switch (action.type) {
    case LOADING:
      return action.payload;

    default:
      return state;
  }
}

module.exports = reducer;
