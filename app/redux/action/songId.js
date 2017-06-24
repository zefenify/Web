import { SONG_ID } from 'app/redux/constant/songId';

function songId(payload) {
  return {
    type: SONG_ID,
    payload,
  };
}

module.exports = {
  songId,
};
