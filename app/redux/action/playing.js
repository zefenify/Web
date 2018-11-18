import { PLAYING } from '@app/redux/constant/playing';


export function playing(payload) {
  return {
    type: PLAYING,
    payload,
  };
}
