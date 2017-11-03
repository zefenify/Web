import React from 'react';
import { connect } from 'react-redux';

import { PLAY_REQUEST, PLAY_PAUSE_REQUEST } from '@app/redux/constant/wolfCola';
import { CONTEXT_MENU_ON_REQUEST, CONTEXT_SONG } from '@app/redux/constant/contextMenu';

import songDuration from '@app/redux/selector/songDuration';
import songPlaying from '@app/redux/selector/songPlaying';
import songTrack from '@app/redux/selector/songTrack';

import Songs from '@app/component/presentational/Songs';

const YourSongs = props => (<Songs {...props} />);

module.exports = connect(state => ({
  current: state.current,
  playing: state.playing,
  user: state.user,
  songs: songTrack(state),
  totalDuration: songDuration(state),
  playingSongs: songPlaying(state),
}), dispatch => ({
  togglePlayPauseSongs(playingSongs, songs) {
    if (playingSongs === true) {
      dispatch({
        type: PLAY_PAUSE_REQUEST,
      });

      return;
    }

    dispatch({
      type: PLAY_REQUEST,
      payload: {
        play: songs[0],
        queue: songs,
        queueInitial: songs,
      },
    });
  },

  togglePlayPauseSong(songIndex, song, current, songs) {
    if (current === null || current.track_id !== song.track_id) {
      dispatch({
        type: PLAY_REQUEST,
        payload: {
          play: songs[songIndex],
          queue: songs,
          queueInitial: songs,
        },
      });

      return;
    }

    dispatch({
      type: PLAY_PAUSE_REQUEST,
    });
  },

  contextMenuSong(songId, songs) {
    const songIndex = songs.findIndex(song => song.track_id === songId);

    if (songIndex === -1) {
      return;
    }

    dispatch({
      type: CONTEXT_MENU_ON_REQUEST,
      payload: {
        type: CONTEXT_SONG,
        payload: songs[songIndex],
      },
    });
  },
}))(YourSongs);
