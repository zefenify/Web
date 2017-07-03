import { QUEUE_SET, QUEUE_ADD, QUEUE_REMOVE, QUEUE_CLEAR } from '@app/redux/constant/queue';

function queueSet(payload) {
  return {
    type: QUEUE_SET,
    payload,
  };
}

function queueAdd(payload) {
  return {
    type: QUEUE_ADD,
    payload,
  };
}

function queueRemove(payload) {
  return {
    type: QUEUE_REMOVE,
    payload,
  };
}

function queueClear() {
  return {
    type: QUEUE_CLEAR,
  };
}

module.exports = {
  queueSet,
  queueAdd,
  queueRemove,
  queueClear,
};
