import { REMAINING } from '@app/redux/constant/remaining';


export function remaining(payload) {
  return {
    type: REMAINING,
    payload,
  };
}
