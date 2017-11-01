/* eslint no-underscore-dangle: off */

import { put, takeEvery } from 'redux-saga/effects';

import { CURRENT_REQUEST } from '@app/redux/constant/current';

import { current } from '@app/redux/action/current';

function* _current(action) {
  yield put(current(action.payload));
}

function* currentRequest() {
  yield takeEvery(CURRENT_REQUEST, _current);
}

module.exports = {
  currentRequest,
};
