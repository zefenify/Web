import { PLAYBACK_POSITION } from '@app/redux/constant/playbackPosition';


export function playbackPosition(payload) {
  return {
    type: PLAYBACK_POSITION,
    payload,
  };
}
