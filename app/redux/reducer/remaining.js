import { REMAINING } from '@app/redux/constant/remaining';

function remaining(state = false, action) {
  switch (action.type) {
    case REMAINING:
      return action.payload;

    default:
      return state;
  }
}

module.exports = remaining;
