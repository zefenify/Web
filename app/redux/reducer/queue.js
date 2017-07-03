import { QUEUE_SET, QUEUE_ADD, QUEUE_REMOVE, QUEUE_CLEAR } from '@app/redux/constant/queue';

function queue(state = [], action) {
  switch (action.type) {
    case QUEUE_SET:
      return action.payload;

    case QUEUE_ADD:
      return [action.payload, ...state];

    case QUEUE_REMOVE:
      return [...state.slice(0, action.payload), ...state.slice(action.payload + 1)];

    case QUEUE_CLEAR:
      return [];

    default:
      return state;
  }
}

module.exports = queue;
