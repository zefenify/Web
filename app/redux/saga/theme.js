/* eslint no-console: 0 */

import localforage from 'localforage';
import { put, select, takeEvery } from 'redux-saga/effects';

import { LF_STORE } from 'app/config/localforage.js';
import { SET_THEME } from 'app/redux/constant/theme';

import { theme } from 'app/redux/action/theme';

function* themeBootFromLF() {
  try {
    const lfTheme = yield localforage.getItem(LF_STORE.THEME);
    yield put(theme(lfTheme));
  } catch (err) {
    console.warn('Unable to boot theme from LF', err);
  }
}

// worker Saga: will perform the async theme task
function* toggleTheme() {
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
function* watchToggleTheme() {
  yield takeEvery(SET_THEME, toggleTheme);
}

module.exports = {
  watchToggleTheme,
  themeBootFromLF,
};
