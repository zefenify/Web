/* eslint no-console: off */

import { put, select, takeEvery } from 'redux-saga/effects';

import { getItem, setItem } from '@app/util/mugatu';
import { LOCALSTORAGE } from '@app/config/localStorage';
import { REMAINING_REQUEST } from '@app/redux/constant/remaining';
import { remaining } from '@app/redux/action/remaining';


export function* remainingBootFromLocalStorage() {
  try {
    const localStorageRemaining = getItem(LOCALSTORAGE.REMAINING);
    // default behavior or remaining is false i.e. end timer is always displayed
    yield put(remaining(localStorageRemaining || false));
  } catch (remainingGetError) {
    console.warn('Unable to Boot Remaining from localStorage', remainingGetError);
  }
}


function* _remaining() {
  const state = yield select();
  yield put(remaining(!state.remaining));

  try {
    setItem(LOCALSTORAGE.REMAINING, !state.remaining);
  } catch (remainingSetError) {
    console.warn('Unable to save Remaining State to localStorage', remainingSetError);
  }
}


export function* remainingRequest() {
  yield takeEvery(REMAINING_REQUEST, _remaining);
}
