import { createSelector } from 'reselect';

import track from '@app/util/track';

// eslint-disable-next-line
module.exports = createSelector([state => state.song], (song) => {
  if (song === null) {
    return [];
  }

  const tracks = track(Object.values(song.included.track), song.included);

  // re-building { [trackId]: track } for sorting, recent top...
  const trackIdMapTrack = {};
  tracks.forEach((t) => {
    trackIdMapTrack[t.track_id] = t;
  });

  return song.data.song_track.map(trackId => trackIdMapTrack[trackId]);
});
