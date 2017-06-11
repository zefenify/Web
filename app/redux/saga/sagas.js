/* eslint no-console: 0 */

import { all } from 'redux-saga/effects';

import { themeBootFromLF, watchToggleTheme } from 'app/redux/saga/theme';
import { volumeBootFromLF, watchSetVolume } from 'app/redux/saga/volume';
import { repeatBootFromLF, watchSetRepeat } from 'app/redux/saga/repeat';

function* rootSaga() {
  yield all([
    themeBootFromLF(),
    watchToggleTheme(),
    volumeBootFromLF(),
    watchSetVolume(),
    repeatBootFromLF(),
    watchSetRepeat(),
  ]);
}

module.exports = rootSaga;
