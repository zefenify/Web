/* eslint no-console: off */

import { put, select, takeEvery } from 'redux-saga/effects';

import { getItem, setItem } from '@app/util/mugatu';
import { LOCALSTORAGE } from '@app/config/localStorage';
import { SHUFFLE_REQUEST } from '@app/redux/constant/shuffle';
import { shuffle } from '@app/redux/action/shuffle';


export function* shuffleBootFromLocalStorage() {
  try {
    const localStorageShuffle = getItem(LOCALSTORAGE.SHUFFLE);
    yield put(shuffle(localStorageShuffle === null ? false : localStorageShuffle));
  } catch (shuffleGetError) {
    console.warn('Unable to Boot Shuffle from localStorage', shuffleGetError);
  }
}


function* _shuffle() {
  const state = yield select();
  yield put(shuffle(!state.shuffle));

  try {
    setItem(LOCALSTORAGE.SHUFFLE, !state.shuffle);
  } catch (shuffleSetError) {
    console.warn('Unable to save Shuffle State to localStorage', shuffleSetError);
  }
}


export function* shuffleRequest() {
  yield takeEvery(SHUFFLE_REQUEST, _shuffle);
}
