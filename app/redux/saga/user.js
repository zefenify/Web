/* global document */
/* eslint no-console: 0 */

import localforage from 'localforage';
import { put, takeEvery } from 'redux-saga/effects';

import { LF_STORE } from '@app/config/localforage';
import { SET_USER } from '@app/redux/constant/user';

import { user } from '@app/redux/action/user';

function* userBootFromLF() {
  try {
    const lfUser = yield localforage.getItem(LF_STORE.USER);

    // booting Facebook SDK...
    if (lfUser === null) {
      (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) { return; }
        js = d.createElement(s); js.id = id;
        js.src = '//connect.facebook.net/en_US/sdk.js';
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    }

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
