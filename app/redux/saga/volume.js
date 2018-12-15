/* eslint no-console: off */

import { put, takeEvery } from 'redux-saga/effects';
import { Howler } from 'howler';

import { getItem, setItem } from '@app/util/mugatu';
import { LOCALSTORAGE } from '@app/config/localStorage';
import { VOLUME_REQUEST } from '@app/redux/constant/volume';
import { volume } from '@app/redux/action/volume';


export function* volumeBootFromLocalStorage() {
  try {
    const localStorageVolume = getItem(LOCALSTORAGE.VOLUME);
    yield put(volume(localStorageVolume === null ? 1 : localStorageVolume));
    Howler.volume(localStorageVolume === null ? 1 : localStorageVolume);
  } catch (volumeGetError) {
    console.warn('Unable to Boot Volume from localStorage', volumeGetError);
  }
}


function* _volume(action) {
  yield put(volume(action.payload));
  Howler.volume(action.payload);


  try {
    setItem(LOCALSTORAGE.VOLUME, action.payload);
  } catch (volumeSetError) {
    console.warn('Unable to save Volume State to localStorage', volumeSetError);
  }
}


export function* volumeRequest() {
  yield takeEvery(VOLUME_REQUEST, _volume);
}
