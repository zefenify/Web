import { createSelector } from 'reselect';

import track from '@app/util/track';

// eslint-disable-next-line
export default createSelector([state => state.song, state => state.queueInitial], (song, queueInitial) => {
  if (song === null) {
    return false;
  }

  const tracks = track(Object.values(song.included.track), song.included);

  if (queueInitial.length === tracks.length) {
    const queueInitialTrackIds = queueInitial.map(t => t.track_id);
    const songIds = tracks.map(_track => _track.track_id);
    return songIds.every(songId => queueInitialTrackIds.includes(songId));
  }

  return false;
});
