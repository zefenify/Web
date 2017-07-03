/* eslint no-console: 0 */

import { put, takeEvery } from 'redux-saga/effects';

import { SET_PLAYBACK_POSITION } from '@app/redux/constant/playbackPosition';

import { playbackPosition } from '@app/redux/action/playbackPosition';

function* setPlaybackPosition(action) {
  yield put(playbackPosition(action.payload));
}

function* watchSetPlaybackPosition() {
  yield takeEvery(SET_PLAYBACK_POSITION, setPlaybackPosition);
}

module.exports = {
  watchSetPlaybackPosition,
};
