/* global document */
/* eslint no-console: off */

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
  } catch (themeGetError) {
    console.warn('Unable to boot theme from LF', themeGetError);
  }
}

// worker Saga: will perform the async theme task
function* _theme() {
  const state = yield select();
  const nextThemeState = state.theme === 'light' ? 'dark' : 'light';

  yield put(theme(nextThemeState));

  try {
    yield localforage.setItem(LF_STORE.THEME, nextThemeState);
  } catch (themeSetError) {
    console.warn('Unable to save theme state to LF', themeSetError);
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
