import React from 'react';
import { connect } from 'react-redux';

import { PLAY, TOGGLE_PLAY_PAUSE } from '@app/redux/constant/wolfCola';
import { SET_CONTEXT_MENU_ON, CONTEXT_SONG } from '@app/redux/constant/contextMenu';

import songDuration from '@app/redux/selector/songDuration';
import songPlaying from '@app/redux/selector/songPlaying';
import songTrack from '@app/redux/selector/songTrack';

import DJKhaled from '@app/component/hoc/DJKhaled';

import Songs from '@app/component/presentational/Songs';

const YourSongs = props => (<Songs {...props} />);

module.exports = connect(state => ({
  songs: songTrack(state),
  totalDuration: songDuration(state),
  playingSongs: songPlaying(state),
}), dispatch => ({
  togglePlayPauseSongs(playingSongs, songs) {
    if (playingSongs === true) {
      dispatch({
        type: TOGGLE_PLAY_PAUSE,
      });

      return;
    }

    dispatch({
      type: PLAY,
      payload: {
        play: songs[0],
        queue: songs,
        initialQueue: songs,
      },
    });
  },

  togglePlayPauseSong(songIndex, song, current, songs) {
    if (current === null || current.track_id !== song.track_id) {
      dispatch({
        type: PLAY,
        payload: {
          play: songs[songIndex],
          queue: songs,
          initialQueue: songs,
        },
      });

      return;
    }

    dispatch({
      type: TOGGLE_PLAY_PAUSE,
    });
  },

  contextMenuSong(songId, songs) {
    const songIndex = songs.findIndex(song => song.track_id === songId);

    if (songIndex === -1) {
      return;
    }

    dispatch({
      type: SET_CONTEXT_MENU_ON,
      payload: {
        type: CONTEXT_SONG,
        payload: songs[songIndex],
      },
    });
  },
}))(DJKhaled('current', 'playing', 'user')(YourSongs));
