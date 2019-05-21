/* eslint no-console: off */

import { put, takeEvery } from 'redux-saga/effects';

import { getItem, setItem } from '@app/util/mugatu';
import { LOCALSTORAGE } from '@app/config/localStorage';
import { CROSSFADE_REQUEST, CROSSFADE_DEFAULT } from '@app/redux/constant/crossfade';
import { crossfade } from '@app/redux/action/crossfade';


export function* crossfadeBootFromLocalStorage() {
  try {
    const localStorageCrossfade = getItem(LOCALSTORAGE.CROSSFADE);
    yield put(crossfade(localStorageCrossfade === null ? CROSSFADE_DEFAULT : localStorageCrossfade));
  } catch (crossfadeGetError) {
    console.warn('Unable to Boot Crossfade from localStorage', crossfadeGetError);
  }
}


function* _crossfade(action) {
  yield put(crossfade(action.payload));

  try {
    setItem(LOCALSTORAGE.CROSSFADE, action.payload);
  } catch (crossfadeSetError) {
    console.warn('Unable to save Crossfade from localStorage', crossfadeSetError);
  }
}


export function* crossfadeRequest() {
  yield takeEvery(CROSSFADE_REQUEST, _crossfade);
}
