/* eslint no-console: 0 */

import localforage from 'localforage';
import { put, takeEvery } from 'redux-saga/effects';

import { LF_STORE } from '@app/config/localforage';
import { SET_USER } from '@app/redux/constant/user';

import { user } from '@app/redux/action/user';

function* userBootFromLF() {
  try {
    const lfUser = yield localforage.getItem(LF_STORE.USER);
    yield put(user(lfUser));
  } catch (err) {
    console.warn('Unable to boot user from LF', err);
  }
}

function* setUser(action) {
  yield put(user(action.payload));

  try {
    yield localforage.setItem(LF_STORE.USER, action.payload);
  } catch (err) {
    console.warn('Unable to save user state to LF', err);
  }
}

function* watchSetUser() {
  yield takeEvery(SET_USER, setUser);
}

module.exports = {
  userBootFromLF,
  watchSetUser,
};
