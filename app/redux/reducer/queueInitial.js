import { QUEUE_INITIAL } from '@app/redux/constant/queueInitial';

function initialQueue(state = [], action) {
  switch (action.type) {
    case QUEUE_INITIAL:
      return action.payload;

    default:
      return state;
  }
}

module.exports = initialQueue;
