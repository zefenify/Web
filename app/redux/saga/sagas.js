/* eslint no-console: 0 */

import { all } from 'redux-saga/effects';

import { themeBootFromLF, watchToggleTheme } from 'app/redux/saga/theme';

function* rootSaga() {
  yield all([
    themeBootFromLF(),
    watchToggleTheme(),
  ]);
}

module.exports = rootSaga;
