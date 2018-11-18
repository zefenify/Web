import { DURATION } from '@app/redux/constant/duration';


export function duration(payload) {
  return {
    type: DURATION,
    payload,
  };
}
