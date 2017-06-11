/* eslint no-console: 0 */

import { all } from 'redux-saga/effects';

import { themeBootFromLF, watchToggleTheme } from 'app/redux/saga/theme';
import { volumeBootFromLF, watchSetVolume } from 'app/redux/saga/volume';

function* rootSaga() {
  yield all([
    themeBootFromLF(),
    watchToggleTheme(),
    volumeBootFromLF(),
    watchSetVolume(),
  ]);
}

module.exports = rootSaga;
