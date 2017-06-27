import { INITIAL_QUEUE } from 'app/redux/constant/initialQueue';

function initialQueue(state = [], action) {
  switch (action.type) {
    case INITIAL_QUEUE:
      return action.payload;

    default:
      return state;
  }
}

module.exports = initialQueue;
