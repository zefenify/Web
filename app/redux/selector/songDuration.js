import { createSelector } from 'reselect';

import track from '@app/util/track';
import { human } from '@app/util/time';

module.exports = createSelector([state => state.song], (song) => {
  if (song === null) {
    return { hours: 0, minutes: 0, seconds: 0 };
  }

  const tracks = track(Object.values(song.included.track), song.included);
  return human(tracks.reduce((totalDuration, t) => totalDuration + t.track_track.s3_meta.duration, 0), true);
});
