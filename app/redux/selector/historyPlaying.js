import { createSelector } from 'reselect';

// eslint-disable-next-line
module.exports = createSelector([state => state.history, state => state.initialQueue], (history, initialQueue) => {
  let playingHistory = false;

  if (initialQueue.length === history.length) {
    const initialQueueSongIds = initialQueue.map(song => song.track_id);
    const historySongIds = history.map(song => song.track_id);
    playingHistory = historySongIds.every(songId => initialQueueSongIds.includes(songId));
  }

  return playingHistory;
});
