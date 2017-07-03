/* eslint no-console: 0 */

import localforage from 'localforage';
import { put, takeEvery } from 'redux-saga/effects';

import { LF_STORE } from '@app/config/localforage';
import { SET_CROSSFADE } from '@app/redux/constant/crossfade';

import { crossfade } from '@app/redux/action/crossfade';

function* crossfadeBootFromLF() {
  try {
    const lfCrossfade = yield localforage.getItem(LF_STORE.CROSSFADE);
    yield put(crossfade(lfCrossfade || 0));
  } catch (err) {
    console.warn('Unable to boot crossfade from LF', err);
  }
}

function* setCrossfade(action) {
  yield put(crossfade(action.payload));

  try {
    yield localforage.setItem(LF_STORE.CROSSFADE, action.payload);
  } catch (err) {
    console.warn('Unable to save crossfade from LF', err);
  }
}

function* watchSetCrossfade() {
  yield takeEvery(SET_CROSSFADE, setCrossfade);
}

module.exports = {
  crossfadeBootFromLF,
  watchSetCrossfade,
};
