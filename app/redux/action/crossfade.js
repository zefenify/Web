import { CROSSFADE } from '@app/redux/constant/crossfade';


export function crossfade(payload) {
  return {
    type: CROSSFADE,
    payload,
  };
}
