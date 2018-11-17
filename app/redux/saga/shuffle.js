/* eslint no-console: off */

import localforage from 'localforage';
import { put, select, takeEvery } from 'redux-saga/effects';

import { LOCALFORAGE_STORE } from '@app/config/localforage';
import { SHUFFLE_REQUEST } from '@app/redux/constant/shuffle';
import { shuffle } from '@app/redux/action/shuffle';


function* shuffleBootFromLocalforage() {
  try {
    const localforageShuffle = yield localforage.getItem(LOCALFORAGE_STORE.SHUFFLE);
    yield put(shuffle(localforageShuffle === null ? false : localforageShuffle));
  } catch (shuffleGetError) {
    console.warn('Unable to boot shuffle from LF', shuffleGetError);
  }
}


function* _shuffle() {
  const state = yield select();
  yield put(shuffle(!state.shuffle));

  try {
    yield localforage.setItem(LOCALFORAGE_STORE.SHUFFLE, !state.shuffle);
  } catch (shuffleSetError) {
    console.warn('Unable to save shuffle state to LF', shuffleSetError);
  }
}


function* shuffleRequest() {
  yield takeEvery(SHUFFLE_REQUEST, _shuffle);
}


export default {
  shuffleBootFromLocalforage,
  shuffleRequest,
};
