import {
  QUEUE_SET,
  QUEUE_ADD,
  QUEUE_REMOVE,
  QUEUE_CLEAR,
} from '@app/redux/constant/queue';


export function queueSet(payload) {
  return {
    type: QUEUE_SET,
    payload,
  };
}


export function queueAdd(payload) {
  return {
    type: QUEUE_ADD,
    payload,
  };
}


export function queueRemove(payload) {
  return {
    type: QUEUE_REMOVE,
    payload,
  };
}


export function queueClear() {
  return {
    type: QUEUE_CLEAR,
  };
}
