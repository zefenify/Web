import { HISTORY_PUSH, HISTORY_POP, HISTORY_FRONT } from '@app/redux/constant/history';

function historyPush(payload) {
  return {
    type: HISTORY_PUSH,
    payload,
  };
}

function historyPop(payload) {
  return {
    type: HISTORY_POP,
    payload,
  };
}

function historyFront(payload) {
  return {
    type: HISTORY_FRONT,
    payload,
  };
}

module.exports = {
  historyPush,
  historyPop,
  historyFront,
};
