/* eslint no-console: off */
/* eslint no-underscore-dangle: off */

import { put, takeEvery } from 'redux-saga/effects';

import { PLAYBACK_POSITION_REQUEST } from '@app/redux/constant/playbackPosition';

import { playbackPosition } from '@app/redux/action/playbackPosition';

function* _playbackPosition(action) {
  yield put(playbackPosition(action.payload));
}

function* playbackPositionRequest() {
  yield takeEvery(PLAYBACK_POSITION_REQUEST, _playbackPosition);
}

module.exports = {
  playbackPositionRequest,
};
