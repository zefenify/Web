/* eslint no-console: off */

import localforage from 'localforage';
import { put, takeEvery } from 'redux-saga/effects';

import { LOCALFORAGE_STORE } from '@app/config/localforage';
import { CROSSFADE_REQUEST, CROSSFADE_DEFAULT } from '@app/redux/constant/crossfade';
import { crossfade } from '@app/redux/action/crossfade';


function* crossfadeBootFromLocalforage() {
  try {
    const localforageCrossfade = yield localforage.getItem(LOCALFORAGE_STORE.CROSSFADE);
    yield put(crossfade(localforageCrossfade || CROSSFADE_DEFAULT));
  } catch (crossfadeGetError) {
    console.warn('Unable to boot crossfade from LF', crossfadeGetError);
  }
}


function* _crossfade(action) {
  yield put(crossfade(action.payload));

  try {
    yield localforage.setItem(LOCALFORAGE_STORE.CROSSFADE, action.payload);
  } catch (crossfadeSetError) {
    console.warn('Unable to save crossfade from LF', crossfadeSetError);
  }
}


function* crossfadeRequest() {
  yield takeEvery(CROSSFADE_REQUEST, _crossfade);
}


export default {
  crossfadeBootFromLocalforage,
  crossfadeRequest,
};
