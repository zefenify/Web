/* eslint no-console: off */
/* eslint no-underscore-dangle: off */

import { put, takeEvery } from 'redux-saga/effects';

import { DURATION_REQUEST } from '@app/redux/constant/duration';

import { duration } from '@app/redux/action/duration';

function* _duration(action) {
  yield put(duration(action.payload));
}

function* durationRequest() {
  yield takeEvery(DURATION_REQUEST, _duration);
}

module.exports = {
  durationRequest,
};
