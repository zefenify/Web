import { createSelector } from 'reselect';

// eslint-disable-next-line
module.exports = createSelector([state => state.tracks, state => state.queueInitial], (tracks, queueInitial) => {
  if (queueInitial.length === tracks.length) {
    const queueInitialTrackIds = queueInitial.map(track => track.track_id);
    const tracksTrackIds = tracks.map(track => track.track_id);
    return tracksTrackIds.every(trackId => queueInitialTrackIds.includes(trackId));
  }

  return false;
});
