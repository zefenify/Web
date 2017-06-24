/* eslint no-console: 0 */

import { put, takeEvery } from 'redux-saga/effects';

import { SET_DURATION } from 'app/redux/constant/duration';

import { duration } from 'app/redux/action/duration';

function* setDuration(action) {
  yield put(duration(action.payload));
}

function* watchSetDuration() {
  yield takeEvery(SET_DURATION, setDuration);
}

module.exports = {
  watchSetDuration,
};
