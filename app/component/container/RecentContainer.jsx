// Congratulations!? you played yourself
// DJ K...

import React from 'react';
import { connect } from 'react-redux';

import { PLAY, TOGGLE_PLAY_PAUSE } from '@app/redux/constant/wolfCola';
import { SET_CONTEXT_MENU_ON, CONTEXT_SONG } from '@app/redux/constant/contextMenu';

import historyDuration from '@app/redux/selector/historyDuration';
import historyPlaying from '@app/redux/selector/historyPlaying';

import DJKhaled from '@app/component/hoc/DJKhaled';

import Recent from '@app/component/presentational/Recent';

const RecentlyPlayed = props => (<Recent {...props} />);

module.exports = connect(state => ({
  history: state.history,
  totalDuration: historyDuration(state),
  playingHistory: historyPlaying(state),
}), dispatch => ({
  togglePlayPauseHistory(playingHistory, history) {
    if (playingHistory === true) {
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
    if (current === null || current.track_id !== song.track_id) {
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

  contextMenuSong(songId, history) {
    const songIndex = history.findIndex(song => song.track_id === songId);

    if (songIndex === -1) {
      return;
    }

    dispatch({
      type: SET_CONTEXT_MENU_ON,
      payload: {
        type: CONTEXT_SONG,
        payload: history[songIndex],
      },
    });
  },
}))(DJKhaled('playing', 'current')(RecentlyPlayed));
