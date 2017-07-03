import { PLAYBACK_POSITION } from '@app/redux/constant/playbackPosition';

function playbackPosition(payload) {
  return {
    type: PLAYBACK_POSITION,
    payload,
  };
}

module.exports = {
  playbackPosition,
};
