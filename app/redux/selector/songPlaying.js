import { createSelector } from 'reselect';

import track from '@app/util/track';

// eslint-disable-next-line
module.exports = createSelector([state => state.song, state => state.queueInitial], (song, queueInitial) => {
  if (song === null) {
    return false;
  }

  let songPlaying = false;
  const tracks = track(Object.values(song.included.track), song.included);

  if (queueInitial.length === tracks.length) {
    const queueInitialTrackIds = queueInitial.map(t => t.track_id);
    const songIds = tracks.map(t => t.track_id);
    songPlaying = songIds.every(songId => queueInitialTrackIds.includes(songId));
  }

  return songPlaying;
});
