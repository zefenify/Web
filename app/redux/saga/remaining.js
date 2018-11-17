/* eslint no-console: off */

import localforage from 'localforage';
import { put, select, takeEvery } from 'redux-saga/effects';

import { LOCALFORAGE_STORE } from '@app/config/localforage';
import { REMAINING_REQUEST } from '@app/redux/constant/remaining';
import { remaining } from '@app/redux/action/remaining';


function* remainingBootFromLocalforage() {
  try {
    const localforageRemaining = yield localforage.getItem(LOCALFORAGE_STORE.REMAINING);
    // default behavior or remaining is false i.e. end timer is always displayed
    yield put(remaining(localforageRemaining || false));
  } catch (remainingGetError) {
    console.warn('Unable to boot remaining from LF', remainingGetError);
  }
}


function* _remaining() {
  const state = yield select();
  yield put(remaining(!state.remaining));

  try {
    yield localforage.setItem(LOCALFORAGE_STORE.REMAINING, !state.remaining);
  } catch (remainingSetError) {
    console.warn('Unable to save remaining state to LF', remainingSetError);
  }
}


function* remainingRequest() {
  yield takeEvery(REMAINING_REQUEST, _remaining);
}

export default {
  remainingBootFromLocalforage,
  remainingRequest,
};
