import { QUEUE_NEXT_ADD, QUEUE_NEXT_REMOVE } from '@app/redux/constant/queueNext';


function queueNextAdd(payload) {
  return {
    type: QUEUE_NEXT_ADD,
    payload,
  };
}


function queueNextRemove(payload) {
  return {
    type: QUEUE_NEXT_REMOVE,
    payload,
  };
}


module.exports = {
  queueNextAdd,
  queueNextRemove,
};
