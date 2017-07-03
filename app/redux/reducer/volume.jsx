import { VOLUME } from '@app/redux/constant/volume';

function reducer(state = 1, action) {
  switch (action.type) {
    case VOLUME:
      return action.payload;

    default:
      return state;
  }
}

module.exports = reducer;
