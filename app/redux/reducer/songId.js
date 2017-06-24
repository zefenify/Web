import { SONG_ID } from 'app/redux/constant/songId';

function songId(state = null, action) {
  switch (action.type) {
    case SONG_ID:
      return action.payload;

    default:
      return state;
  }
}

module.exports = songId;
