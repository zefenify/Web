import React from 'react';
import { connect } from 'react-redux';

import { SET_VOLUME } from '@app/redux/constant/volume';
import { SET_REPEAT } from '@app/redux/constant/repeat';
import { SET_SHUFFLE } from '@app/redux/constant/shuffle';
import { SET_REMAINING } from '@app/redux/constant/remaining';
import { NEXT, PREVIOUS, SEEK, TOGGLE_PLAY_PAUSE } from '@app/redux/constant/wolfCola';

import Control from '@app/component/presentational/Control';

const ControlContainer = props => (<Control {...props} />);

module.exports = connect(state => ({
  current: state.current,
  duration: state.duration,
  playbackPosition: state.playbackPosition,
  playing: state.playing,
  shuffle: state.shuffle,
  repeat: state.repeat,
  volume: state.volume,
  remaining: state.remaining,
}), dispatch => () => ({
  seek(e) {
    dispatch({ type: SEEK, payload: Number.parseInt(e.target.value, 10) });
  },
  togglePlayPause() {
    dispatch({ type: TOGGLE_PLAY_PAUSE });
  },
  next() {
    dispatch({ type: NEXT });
  },
  previous() {
    dispatch({ type: PREVIOUS });
  },
  toggleShuffle() {
    dispatch({ type: SET_SHUFFLE });
  },
  toggleRemaining() {
    dispatch({ type: SET_REMAINING });
  },
  setRepeat() {
    dispatch({ type: SET_REPEAT });
  },
  setVolume(e) {
    dispatch({ type: SET_VOLUME, payload: Number.parseFloat(e.target.value) });
  },
  muteVolume() {
    dispatch({ type: SET_VOLUME, payload: 0 });
  },
  maxVolume() {
    dispatch({ type: SET_VOLUME, payload: 1 });
  },
}))(ControlContainer);
