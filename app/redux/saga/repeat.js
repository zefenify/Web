/* eslint no-console: off */

import localforage from 'localforage';
import { put, select, takeEvery } from 'redux-saga/effects';

import { LF_STORE } from '@app/config/localforage';
import { REPEAT_REQUEST } from '@app/redux/constant/repeat';

import { repeat } from '@app/redux/action/repeat';

function* repeatBootFromLF() {
  try {
    const lfRepeat = yield localforage.getItem(LF_STORE.REPEAT);
    yield put(repeat(lfRepeat === null ? 'OFF' : lfRepeat));
  } catch (repeatGetError) {
    console.warn('Unable to boot repeat from LF', repeatGetError);
  }
}

function* _repeat() {
  const state = yield select();
  const nextRepeatModeMapper = { OFF: 'ALL', ALL: 'ONE', ONE: 'OFF' };
  yield put(repeat(nextRepeatModeMapper[state.repeat] || 'OFF'));

  try {
    yield localforage.setItem(LF_STORE.REPEAT, nextRepeatModeMapper[state.repeat] || 'OFF');
  } catch (repeatSetError) {
    console.warn('Unable to save repeat state to LF', repeatSetError);
  }
}

function* repeatRequest() {
  yield takeEvery(REPEAT_REQUEST, _repeat);
}

module.exports = {
  repeatBootFromLF,
  repeatRequest,
};
