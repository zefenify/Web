import { SONG } from '@app/redux/constant/song';


export function song(payload) {
  return {
    type: SONG,
    payload,
  };
}
