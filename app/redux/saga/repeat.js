/* eslint no-console: 0 */

import localforage from 'localforage';
import { put, select, takeEvery } from 'redux-saga/effects';

import { LF_STORE } from '@app/config/localforage';
import { SET_REPEAT } from '@app/redux/constant/repeat';

import { repeat } from '@app/redux/action/repeat';

function* repeatBootFromLF() {
  try {
    const lfRepeat = yield localforage.getItem(LF_STORE.REPEAT);
    yield put(repeat(lfRepeat === null ? 'OFF' : lfRepeat));
  } catch (err) {
    console.warn('Unable to boot repeat from LF', err);
  }
}

function* setNextRepeatMode() {
  const state = yield select();
  const nextRepeatModeMapper = { OFF: 'ALL', ALL: 'ONE', ONE: 'OFF' };
  yield put(repeat(nextRepeatModeMapper[state.repeat] || 'OFF'));

  try {
    yield localforage.setItem(LF_STORE.REPEAT, nextRepeatModeMapper[state.repeat] || 'OFF');
  } catch (err) {
    console.warn('Unable to save repeat state to LF', err);
  }
}

function* watchSetRepeat() {
  yield takeEvery(SET_REPEAT, setNextRepeatMode);
}

module.exports = {
  repeatBootFromLF,
  watchSetRepeat,
};
