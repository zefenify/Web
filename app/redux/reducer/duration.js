import { DURATION } from '@app/redux/constant/duration';

function duration(state = null, action) {
  switch (action.type) {
    case DURATION:
      return action.payload;

    default:
      return state;
  }
}

module.exports = duration;
