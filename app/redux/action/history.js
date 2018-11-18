import { HISTORY_PUSH, HISTORY_POP, HISTORY_FRONT } from '@app/redux/constant/history';


export function historyPush(payload) {
  return {
    type: HISTORY_PUSH,
    payload,
  };
}


export function historyPop(payload) {
  return {
    type: HISTORY_POP,
    payload,
  };
}


export function historyFront(payload) {
  return {
    type: HISTORY_FRONT,
    payload,
  };
}
