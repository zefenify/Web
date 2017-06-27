import { INITIAL_QUEUE } from 'app/redux/constant/initialQueue';

function initialQueue(payload) {
  return {
    type: INITIAL_QUEUE,
    payload,
  };
}

module.exports = {
  initialQueue,
};
