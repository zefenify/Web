// Congratulations!? you played yourself
// DJ K...

import React from 'react';
import { connect } from 'react-redux';

import { PLAY_REQUEST, PLAY_PAUSE_REQUEST } from '@app/redux/constant/wolfCola';
import { CONTEXT_MENU_ON_REQUEST, CONTEXT_SONG } from '@app/redux/constant/contextMenu';

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
  togglePlayPauseHistory(playingHistory, history) {
    if (playingHistory === true) {
      dispatch({
        type: PLAY_PAUSE_REQUEST,
      });

      return;
    }

    dispatch({
      type: PLAY_REQUEST,
      payload: {
        play: history[0],
        queue: history,
        queueInitial: history,
      },
    });
  },

  togglePlayPauseSong(songIndex, song, current, history) {
    if (current === null || current.track_id !== song.track_id) {
      dispatch({
        type: PLAY_REQUEST,
        payload: {
          play: history[songIndex],
          queue: history,
          queueInitial: history,
        },
      });

      return;
    }

    dispatch({
      type: PLAY_PAUSE_REQUEST,
    });
  },

  contextMenuSong(songId, history) {
    const songIndex = history.findIndex(song => song.track_id === songId);

    if (songIndex === -1) {
      return;
    }

    dispatch({
      type: CONTEXT_MENU_ON_REQUEST,
      payload: {
        type: CONTEXT_SONG,
        payload: history[songIndex],
      },
    });
  },
}))(RecentlyPlayed);
