import { PLAYBACK_POSITION } from '@app/redux/constant/playbackPosition';

function playbackPosition(state = null, action) {
  switch (action.type) {
    case PLAYBACK_POSITION:
      return action.payload;

    default:
      return state;
  }
}

module.exports = playbackPosition;
