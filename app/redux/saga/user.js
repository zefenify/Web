/* global window, document */
/* eslint no-console: off */

import localforage from 'localforage';
import { put, takeEvery } from 'redux-saga/effects';

import { LF_STORE } from '@app/config/localforage';
import { USER_REQUEST } from '@app/redux/constant/user';

import { user } from '@app/redux/action/user';

function* userBootFromLF() {
  try {
    const lfUser = yield localforage.getItem(LF_STORE.USER);

    // booting Facebook SDK...
    if (lfUser === null && window.FB === undefined) {
      (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) { return; }
        js = d.createElement(s); js.id = id;
        js.src = '//connect.facebook.net/en_US/sdk.js';
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    }

    yield put(user(lfUser));
  } catch (userGetError) {
    console.warn('Unable to boot user from LF', userGetError);
  }
}

function* _user(action) {
  yield put(user(action.payload));

  try {
    yield localforage.setItem(LF_STORE.USER, action.payload);
  } catch (userSetError) {
    console.warn('Unable to save user state to LF', userSetError);
  }
}

function* userRequest() {
  yield takeEvery(USER_REQUEST, _user);
}

module.exports = {
  userBootFromLF,
  userRequest,
};
