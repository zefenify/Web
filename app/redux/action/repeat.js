import { REPEAT } from '@app/redux/constant/repeat';


export function repeat(payload) {
  return {
    type: REPEAT,
    payload,
  };
}
