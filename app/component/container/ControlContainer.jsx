import React from 'react';
import { connect } from 'react-redux';

import { VOLUME_REQUEST } from '@app/redux/constant/volume';
import { REPEAT_REQUEST } from '@app/redux/constant/repeat';
import { SHUFFLE_REQUEST } from '@app/redux/constant/shuffle';
import { REMAINING_REQUEST } from '@app/redux/constant/remaining';
import { NEXT_REQUEST, PREVIOUS_REQUEST, SEEK_REQUEST, PLAY_PAUSE_REQUEST } from '@app/redux/constant/wolfCola';

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
    dispatch({ type: SEEK_REQUEST, payload: Number.parseInt(e.target.value, 10) });
  },
  togglePlayPause() {
    dispatch({ type: PLAY_PAUSE_REQUEST });
  },
  next() {
    dispatch({ type: NEXT_REQUEST });
  },
  previous() {
    dispatch({ type: PREVIOUS_REQUEST });
  },
  toggleShuffle() {
    dispatch({ type: SHUFFLE_REQUEST });
  },
  toggleRemaining() {
    dispatch({ type: REMAINING_REQUEST });
  },
  setRepeat() {
    dispatch({ type: REPEAT_REQUEST });
  },
  setVolume(e) {
    dispatch({ type: VOLUME_REQUEST, payload: Number.parseFloat(e.target.value) });
  },
  muteVolume() {
    dispatch({ type: VOLUME_REQUEST, payload: 0 });
  },
  maxVolume() {
    dispatch({ type: VOLUME_REQUEST, payload: 1 });
  },
}))(ControlContainer);
