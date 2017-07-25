/* eslint no-console: 0 */

// Congratulations!? you played yourself
// DJ K...

import React from 'react';
import { connect } from 'react-redux';

import { PLAY, TOGGLE_PLAY_PAUSE } from '@app/redux/constant/wolfCola';

import historyDuration from '@app/redux/selector/historyDuration';
import historyPlaying from '@app/redux/selector/historyPlaying';

import Recent from '@app/component/presentational/Recent';

const RecentlyPlayed = props => (<Recent {...props} />);

module.exports = connect(state => ({
  playing: state.playing,
  current: state.current,
  history: state.history,
  totalDuration: historyDuration(state),
  playingHistory: historyPlaying(state),
}), dispatch => ({
  togglePlayPauseHistory(playing, playingHistory, history) {
    if (playing && playingHistory) {
      dispatch({
        type: TOGGLE_PLAY_PAUSE,
      });

      return;
    }

    dispatch({
      type: PLAY,
      payload: {
        play: history[0],
        queue: history,
        initialQueue: history,
      },
    });
  },

  togglePlayPauseSong(songIndex, song, current, history) {
    if (current === null || current.songId !== song.songId) {
      dispatch({
        type: PLAY,
        payload: {
          play: history[songIndex],
          queue: history,
          initialQueue: history,
        },
      });

      return;
    }

    dispatch({
      type: TOGGLE_PLAY_PAUSE,
    });
  },
}))(RecentlyPlayed);
