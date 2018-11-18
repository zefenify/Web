/* global document */
/* eslint no-console: off */

import localforage from 'localforage';
import { put, select, takeEvery } from 'redux-saga/effects';

import { LOCALFORAGE_STORE } from '@app/config/localforage';
import { THEME_REQUEST } from '@app/redux/constant/theme';
import { theme } from '@app/redux/action/theme';


export function* themeBootFromLocalforage() {
  try {
    const localforageTheme = yield localforage.getItem(LOCALFORAGE_STORE.THEME);
    yield put(theme(localforageTheme === null ? 'DARK' : localforageTheme)); // default boot is `DARK`
    const WolfColaContainer = document.querySelector('#wolf-cola-container');
    if (WolfColaContainer !== null) {
      WolfColaContainer.classList.remove('booting');
    }
  } catch (themeGetError) {
    console.warn('Unable to Boot Theme from Localforage', themeGetError);
  }
}


// worker Saga: will perform the async theme task
function* _theme() {
  const state = yield select();
  const nextThemeState = state.theme === 'LIGHT' ? 'DARK' : 'LIGHT';

  yield put(theme(nextThemeState));

  try {
    yield localforage.setItem(LOCALFORAGE_STORE.THEME, nextThemeState);
  } catch (themeSetError) {
    console.warn('Unable to save Theme State to Localforage', themeSetError);
  }
}


// watcher Saga: spawn a new themeAsync task on each `THEME_ASYNC`
export function* themeRequest() {
  yield takeEvery(THEME_REQUEST, _theme);
}
