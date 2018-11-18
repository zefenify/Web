import { QUEUE_INITIAL } from '@app/redux/constant/queueInitial';


export function queueInitial(payload) {
  return {
    type: QUEUE_INITIAL,
    payload,
  };
}
