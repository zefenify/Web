/* global document */
/* eslint no-console: off */
/* eslint no-underscore-dangle: off */

import localforage from 'localforage';
import { put, select, takeEvery } from 'redux-saga/effects';

import { LF_STORE } from '@app/config/localforage';
import { THEME_REQUEST } from '@app/redux/constant/theme';

import { theme } from '@app/redux/action/theme';

function* themeBootFromLF() {
  try {
    const lfTheme = yield localforage.getItem(LF_STORE.THEME);
    yield put(theme(lfTheme === null ? 'dark' : lfTheme));
    const WolfColaContainer = document.querySelector('#wolf-cola-container');
    WolfColaContainer.classList.remove('booting');
  } catch (err) {
    console.warn('Unable to boot theme from LF', err);
  }
}

// worker Saga: will perform the async theme task
function* _theme() {
  const state = yield select();
  const nextThemeState = state.theme === 'light' ? 'dark' : 'light';

  yield put(theme(nextThemeState));

  try {
    yield localforage.setItem(LF_STORE.THEME, nextThemeState);
  } catch (err) {
    console.warn('Unable to save theme state to LF', err);
  }
}

// watcher Saga: spawn a new themeAsync task on each `THEME_ASYNC`
function* themeRequest() {
  yield takeEvery(THEME_REQUEST, _theme);
}

module.exports = {
  themeBootFromLF,
  themeRequest,
};
