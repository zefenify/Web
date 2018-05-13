/* eslint no-console: off */

import localforage from 'localforage';
import { put, select, takeEvery } from 'redux-saga/effects';

import { LF_STORE } from '@app/config/localforage';
import { REMAINING_REQUEST } from '@app/redux/constant/remaining';

import { remaining } from '@app/redux/action/remaining';

function* remainingBootFromLF() {
  try {
    const lfRemaining = yield localforage.getItem(LF_STORE.REMAINING);
    yield put(remaining(lfRemaining || false));
  } catch (remainingGetError) {
    console.warn('Unable to boot remaining from LF', remainingGetError);
  }
}

function* _remaining() {
  const state = yield select();
  yield put(remaining(!state.remaining));

  try {
    yield localforage.setItem(LF_STORE.REMAINING, !state.remaining);
  } catch (remainingSetError) {
    console.warn('Unable to save remaining state to LF', remainingSetError);
  }
}

function* remainingRequest() {
  yield takeEvery(REMAINING_REQUEST, _remaining);
}

module.exports = {
  remainingBootFromLF,
  remainingRequest,
};
