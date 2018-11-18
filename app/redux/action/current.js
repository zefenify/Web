import { CURRENT } from '@app/redux/constant/current';


export function current(payload) {
  return {
    type: CURRENT,
    payload,
  };
}
