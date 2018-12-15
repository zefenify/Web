/* eslint no-console: off */

import { put, takeEvery } from 'redux-saga/effects';

import { getItem, setItem } from '@app/util/mugatu';
import { LOCALSTORAGE } from '@app/config/localStorage';
import { USER_REQUEST } from '@app/redux/constant/user';
import { user } from '@app/redux/action/user';


export function* userBootFromLocalStorage() {
  try {
    const localStorageUser = getItem(LOCALSTORAGE.USER);
    yield put(user(localStorageUser));
  } catch (userGetError) {
    console.warn('Unable to Boot User from localStorage', userGetError);
  }
}


function* _user(action) {
  yield put(user(action.payload));

  try {
    setItem(LOCALSTORAGE.USER, action.payload);
  } catch (userSetError) {
    console.warn('Unable to save User State to localStorage', userSetError);
  }
}


export function* userRequest() {
  yield takeEvery(USER_REQUEST, _user);
}
