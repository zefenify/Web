/* eslint no-console: 0 */

import { all } from 'redux-saga/effects';

import { watchToggleTheme, themeBootFromLF } from 'app/redux/saga/theme';

function* rootSaga() {
  yield all([
    watchToggleTheme(),
    themeBootFromLF(),
  ]);
}

module.exports = rootSaga;
