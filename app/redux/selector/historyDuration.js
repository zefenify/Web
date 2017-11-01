import { createSelector } from 'reselect';

import { human } from '@app/util/time';

module.exports = createSelector([state => state.history], (history) => {
  return human(history.reduce((totalDuration, track) => totalDuration + track.track_track.s3_meta.duration, 0), true);
});
