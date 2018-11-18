/* eslint no-console: off */

import localforage from 'localforage';
import { put, takeEvery } from 'redux-saga/effects';
import { Howler } from 'howler';

import { LOCALFORAGE_STORE } from '@app/config/localforage';
import { VOLUME_REQUEST } from '@app/redux/constant/volume';
import { volume } from '@app/redux/action/volume';


export function* volumeBootFromLocalforage() {
  try {
    const localforageVolume = yield localforage.getItem(LOCALFORAGE_STORE.VOLUME);
    yield put(volume(localforageVolume === null ? 1 : localforageVolume));
    Howler.volume(localforageVolume === null ? 1 : localforageVolume);
  } catch (volumeGetError) {
    console.warn('Unable to Boot Volume from Localforage', volumeGetError);
  }
}


function* _volume(action) {
  yield put(volume(action.payload));
  Howler.volume(action.payload);

  try {
    yield localforage.setItem(LOCALFORAGE_STORE.VOLUME, action.payload);
  } catch (volumeSetError) {
    console.warn('Unable to save Volume State to Localforage', volumeSetError);
  }
}


export function* volumeRequest() {
  yield takeEvery(VOLUME_REQUEST, _volume);
}
