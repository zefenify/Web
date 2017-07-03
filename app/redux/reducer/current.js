import { CURRENT } from '@app/redux/constant/current';

function current(state = null, action) {
  switch (action.type) {
    case CURRENT:
      return action.payload;

    default:
      return state;
  }
}

module.exports = current;
