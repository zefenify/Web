import React from 'react';

import { VOLUME_REQUEST } from '@app/redux/constant/volume';
import { REPEAT_REQUEST } from '@app/redux/constant/repeat';
import { SHUFFLE_REQUEST } from '@app/redux/constant/shuffle';
import { REMAINING_REQUEST } from '@app/redux/constant/remaining';
import { NEXT_REQUEST, PREVIOUS_REQUEST, SEEK_REQUEST, PLAY_PAUSE_REQUEST } from '@app/redux/constant/wolfCola';

import Control from '@app/component/presentational/Control';
import store from '@app/redux/store';
import { withContext } from '@app/component/context/context';

const dispatches = {
  seek(e) {
    store.dispatch({ type: SEEK_REQUEST, payload: Number.parseInt(e.target.value, 10) });
  },
  togglePlayPause() {
    store.dispatch({ type: PLAY_PAUSE_REQUEST });
  },
  next() {
    store.dispatch({ type: NEXT_REQUEST });
  },
  previous() {
    store.dispatch({ type: PREVIOUS_REQUEST });
  },
  toggleShuffle() {
    store.dispatch({ type: SHUFFLE_REQUEST });
  },
  toggleRemaining() {
    store.dispatch({ type: REMAINING_REQUEST });
  },
  setRepeat() {
    store.dispatch({ type: REPEAT_REQUEST });
  },
  setVolume(e) {
    store.dispatch({ type: VOLUME_REQUEST, payload: Number.parseFloat(e.target.value) });
  },
  muteVolume() {
    store.dispatch({ type: VOLUME_REQUEST, payload: 0 });
  },
  maxVolume() {
    store.dispatch({ type: VOLUME_REQUEST, payload: 1 });
  },
};

const ControlContainer = props => (<Control {...props} {...dispatches} />);

module.exports = withContext('current', 'duration', 'playbackPosition', 'playing', 'shuffle', 'repeat', 'volume', 'remaining', 'urlCurrentPlaying')(ControlContainer);
