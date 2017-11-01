/* eslint no-console: off */
/* eslint no-underscore-dangle: off */

import { put, takeEvery } from 'redux-saga/effects';

import { PLAYING_REQUEST } from '@app/redux/constant/playing';

import { playing } from '@app/redux/action/playing';

function* _playing(action) {
  yield put(playing(action.payload));
}

function* playingRequest() {
  yield takeEvery(PLAYING_REQUEST, _playing);
}

module.exports = {
  playingRequest,
};
