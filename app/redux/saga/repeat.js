/* eslint no-console: off */

import { put, select, takeEvery } from 'redux-saga/effects';

import { getItem, setItem } from '@app/util/mugatu';
import { LOCALSTORAGE } from '@app/config/localStorage';
import { REPEAT_REQUEST } from '@app/redux/constant/repeat';
import { repeat } from '@app/redux/action/repeat';


export function* repeatBootFromLocalStorage() {
  try {
    const localStorageRepeat = getItem(LOCALSTORAGE.REPEAT);
    yield put(repeat(localStorageRepeat === null ? 'OFF' : localStorageRepeat));
  } catch (repeatGetError) {
    console.warn('Unable to Boot Repeat from localStorage', repeatGetError);
  }
}


function* _repeat() {
  const state = yield select();
  const nextRepeatModeMapper = { OFF: 'ALL', ALL: 'ONE', ONE: 'OFF' };
  yield put(repeat(nextRepeatModeMapper[state.repeat] || 'OFF'));

  try {
    setItem(LOCALSTORAGE.REPEAT, nextRepeatModeMapper[state.repeat] || 'OFF');
  } catch (repeatSetError) {
    console.warn('Unable to save Repeat State to localStorage', repeatSetError);
  }
}


export function* repeatRequest() {
  yield takeEvery(REPEAT_REQUEST, _repeat);
}
