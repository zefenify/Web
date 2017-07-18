import { createSelector } from 'reselect';

// eslint-disable-next-line
module.exports = createSelector([state => state.history, state => state.initialQueue], (history, initialQueue) => {
  let playingHistory = false;

  if (initialQueue.length === history.length) {
    const initialQueueSongIds = initialQueue.map(song => song.songId);
    const historySongIds = history.map(song => song.songId);
    playingHistory = historySongIds.every(songId => initialQueueSongIds.includes(songId));
  }

  return playingHistory;
});
