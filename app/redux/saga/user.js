/* eslint no-console: off */

import localforage from 'localforage';
import { put, takeEvery } from 'redux-saga/effects';

import { LOCALFORAGE_STORE } from '@app/config/localforage';
import { USER_REQUEST } from '@app/redux/constant/user';
import { user } from '@app/redux/action/user';


export function* userBootFromLocalforage() {
  try {
    const localforageUser = yield localforage.getItem(LOCALFORAGE_STORE.USER);
    yield put(user(localforageUser));
  } catch (userGetError) {
    console.warn('Unable to Boot User from Localforage', userGetError);
  }
}


function* _user(action) {
  yield put(user(action.payload));

  try {
    yield localforage.setItem(LOCALFORAGE_STORE.USER, action.payload);
  } catch (userSetError) {
    console.warn('Unable to save User State to Localforage', userSetError);
  }
}


export function* userRequest() {
  yield takeEvery(USER_REQUEST, _user);
}
