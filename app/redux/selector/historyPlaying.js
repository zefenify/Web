import { createSelector } from 'reselect';

// eslint-disable-next-line
module.exports = createSelector([state => state.history, state => state.queueInitial], (history, queueInitial) => {
  let playingHistory = false;

  if (queueInitial.length === history.length) {
    const queueInitialTrackIds = queueInitial.map(track => track.track_id);
    const historyTrackIds = history.map(track => track.track_id);
    playingHistory = historyTrackIds.every(trackId => queueInitialTrackIds.includes(trackId));
  }

  return playingHistory;
});
