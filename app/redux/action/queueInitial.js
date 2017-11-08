import { QUEUE_INITIAL  } from '@app/redux/constant/queueInitial';

function queueInitial(payload) {
  return {
    type: QUEUE_INITIAL,
    payload,
  };
}

module.exports = {
  queueInitial,
};
