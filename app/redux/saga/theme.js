/* eslint no-console: off */

import { put, select, takeEvery } from 'redux-saga/effects';

import { getItem, setItem } from '@app/util/mugatu';
import { LOCALSTORAGE } from '@app/config/localStorage';
import { THEME_REQUEST } from '@app/redux/constant/theme';
import { theme } from '@app/redux/action/theme';


export function* themeBootFromLocalStorage() {
  try {
    const localStorageTheme = getItem(LOCALSTORAGE.THEME);
    yield put(theme(localStorageTheme === null ? 'DARK' : localStorageTheme)); // default boot is `DARK`
  } catch (themeGetError) {
    console.warn('Unable to Boot Theme from localStorage', themeGetError);
  }
}


// worker Saga: will perform the async theme task
function* _theme() {
  const state = yield select();
  const nextThemeState = state.theme === 'LIGHT' ? 'DARK' : 'LIGHT';

  yield put(theme(nextThemeState));

  try {
    setItem(LOCALSTORAGE.THEME, nextThemeState);
  } catch (themeSetError) {
    console.warn('Unable to save Theme State to localStorage', themeSetError);
  }
}


// watcher Saga: spawn a new themeAsync task on each `THEME_ASYNC`
export function* themeRequest() {
  yield takeEvery(THEME_REQUEST, _theme);
}
