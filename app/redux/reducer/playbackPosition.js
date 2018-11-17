import { PLAYBACK_POSITION } from '@app/redux/constant/playbackPosition';


function playbackPosition(state = 0, action) {
  switch (action.type) {
    case PLAYBACK_POSITION:
      return action.payload;

    default:
      return state;
  }
}


export default playbackPosition;
