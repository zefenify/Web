/* eslint no-console: off */

import localforage from 'localforage';
import { put, takeEvery } from 'redux-saga/effects';

import { LF_STORE } from '@app/config/localforage';
import { CROSSFADE_REQUEST } from '@app/redux/constant/crossfade';

import { crossfade } from '@app/redux/action/crossfade';

function* crossfadeBootFromLF() {
  try {
    const lfCrossfade = yield localforage.getItem(LF_STORE.CROSSFADE);
    yield put(crossfade(lfCrossfade || 3));
  } catch (crossfadeGetError) {
    console.warn('Unable to boot crossfade from LF', crossfadeGetError);
  }
}

function* _crossfade(action) {
  yield put(crossfade(action.payload));

  try {
    yield localforage.setItem(LF_STORE.CROSSFADE, action.payload);
  } catch (crossfadeSetError) {
    console.warn('Unable to save crossfade from LF', crossfadeSetError);
  }
}

function* crossfadeRequest() {
  yield takeEvery(CROSSFADE_REQUEST, _crossfade);
}

module.exports = {
  crossfadeBootFromLF,
  crossfadeRequest,
};
