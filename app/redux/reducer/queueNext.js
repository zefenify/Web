import { QUEUE_NEXT_ADD, QUEUE_NEXT_REMOVE } from '@app/redux/constant/queueNext';

function queueNext(state = [], action) {
  switch (action.type) {
    case QUEUE_NEXT_ADD:
      return [action.payload, ...state];

    case QUEUE_NEXT_REMOVE:
      return [...state.slice(0, action.payload), ...state.slice(action.payload + 1)];

    default:
      return state;
  }
}

module.exports = queueNext;
