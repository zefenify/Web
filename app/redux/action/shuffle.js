import { SHUFFLE } from '@app/redux/constant/shuffle';


export function shuffle(payload) {
  return {
    type: SHUFFLE,
    payload,
  };
}
