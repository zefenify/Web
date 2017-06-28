/* eslint no-console: 0 */

import localforage from 'localforage';
import { put, takeEvery } from 'redux-saga/effects';
import { Howler } from 'howler';

import { LF_STORE } from 'app/config/localforage';
import { SET_VOLUME } from 'app/redux/constant/volume';

import { volume } from 'app/redux/action/volume';

function* volumeBootFromLF() {
  try {
    const lfVolume = yield localforage.getItem(LF_STORE.VOLUME);
    yield put(volume(lfVolume === null ? 1 : lfVolume));
    Howler.volume(lfVolume === null ? 1 : lfVolume);
  } catch (err) {
    console.warn('Unable to boot volume from LF', err);
  }
}

function* setVolume(action) {
  yield put(volume(action.payload));
  Howler.volume(action.payload);

  try {
    yield localforage.setItem(LF_STORE.VOLUME, action.payload);
  } catch (err) {
    console.warn('Unable to save volume state to LF', err);
  }
}

function* watchSetVolume() {
  yield takeEvery(SET_VOLUME, setVolume);
}

module.exports = {
  volumeBootFromLF,
  watchSetVolume,
};
