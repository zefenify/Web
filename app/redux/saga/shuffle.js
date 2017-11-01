/* eslint no-console: off */
/* eslint no-underscore-dangle: off */

import localforage from 'localforage';
import { put, select, takeEvery } from 'redux-saga/effects';

import { LF_STORE } from '@app/config/localforage';
import { SHUFFLE_REQUEST } from '@app/redux/constant/shuffle';

import { shuffle } from '@app/redux/action/shuffle';

function* shuffleBootFromLF() {
  try {
    const lfShuffle = yield localforage.getItem(LF_STORE.SHUFFLE);
    yield put(shuffle(lfShuffle === null ? false : lfShuffle));
  } catch (err) {
    console.warn('Unable to boot shuffle from LF', err);
  }
}

function* _shuffle() {
  const state = yield select();
  yield put(shuffle(!state.shuffle));

  try {
    yield localforage.setItem(LF_STORE.SHUFFLE, !state.shuffle);
  } catch (err) {
    console.warn('Unable to save shuffle state to LF', err);
  }
}

function* shuffleRequest() {
  yield takeEvery(SHUFFLE_REQUEST, _shuffle);
}

module.exports = {
  shuffleBootFromLF,
  shuffleRequest,
};
