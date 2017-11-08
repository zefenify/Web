import { SONG } from '@app/redux/constant/song';

function song(state = null, action) {
  switch (action.type) {
    case SONG:
      return action.payload;

    default:
      return state;
  }
}

module.exports = song;
