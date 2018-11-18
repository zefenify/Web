import { QUEUE_NEXT_ADD, QUEUE_NEXT_REMOVE } from '@app/redux/constant/queueNext';


export function queueNextAdd(payload) {
  return {
    type: QUEUE_NEXT_ADD,
    payload,
  };
}


export function queueNextRemove(payload) {
  return {
    type: QUEUE_NEXT_REMOVE,
    payload,
  };
}
