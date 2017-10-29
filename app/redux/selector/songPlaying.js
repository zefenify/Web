import { createSelector } from 'reselect';

import track from '@app/util/track';

// eslint-disable-next-line
module.exports = createSelector([state => state.song, state => state.initialQueue], (song, initialQueue) => {
  if (song === null) {
    return false;
  }

  let songPlaying = false;
  const tracks = track(Object.values(song.included.track), song.included);

  if (initialQueue.length === tracks.length) {
    const initialQueueSongIds = initialQueue.map(t => t.track_id);
    const songIds = tracks.map(t => t.track_id);
    songPlaying = songIds.every(songId => initialQueueSongIds.includes(songId));
  }

  return songPlaying;
});
