import { createSelector } from 'reselect';

import { human } from '@app/util/time';

module.exports = createSelector([state => state.history], (history) => {
  return human(history.reduce((totalDuration, song) => totalDuration + song.playtime, 0), true);
});
