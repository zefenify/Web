import { createSelector } from 'reselect';

import track from '@app/util/track';
import time from '@app/util/time';

export default createSelector([state => state.song], (song) => {
  if (song === null) {
    return {
      hour: 0,
      minute: 0,
      second: 0,
    };
  }

  const tracks = track(Object.values(song.included.track), song.included);
  return time(tracks.reduce((totalDuration, _track) => totalDuration + _track.track_track.s3_meta.duration, 0), true);
});
