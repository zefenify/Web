/* eslint no-console: off */

import localforage from 'localforage';
import { put, takeEvery } from 'redux-saga/effects';
import { Howler } from 'howler';

import { LF_STORE } from '@app/config/localforage';
import { VOLUME_REQUEST } from '@app/redux/constant/volume';

import { volume } from '@app/redux/action/volume';

function* volumeBootFromLF() {
  try {
    const lfVolume = yield localforage.getItem(LF_STORE.VOLUME);
    yield put(volume(lfVolume === null ? 1 : lfVolume));
    Howler.volume(lfVolume === null ? 1 : lfVolume);
  } catch (volumeGetError) {
    console.warn('Unable to boot volume from LF', volumeGetError);
  }
}

function* _volume(action) {
  yield put(volume(action.payload));
  Howler.volume(action.payload);

  try {
    yield localforage.setItem(LF_STORE.VOLUME, action.payload);
  } catch (volumeSetError) {
    console.warn('Unable to save volume state to LF', volumeSetError);
  }
}

function* volumeRequest() {
  yield takeEvery(VOLUME_REQUEST, _volume);
}

module.exports = {
  volumeBootFromLF,
  volumeRequest,
};
