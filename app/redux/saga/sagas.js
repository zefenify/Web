/* eslint no-console: 0 */

import { all } from 'redux-saga/effects';

import { themeBootFromLF, watchToggleTheme } from 'app/redux/saga/theme';
import { volumeBootFromLF, watchSetVolume } from 'app/redux/saga/volume';
import { repeatBootFromLF, watchSetRepeat } from 'app/redux/saga/repeat';
import { shuffleBootFromLF, watchToggleShuffle } from 'app/redux/saga/shuffle';
import { crossfadeBootFromLF, watchSetCrossfade } from 'app/redux/saga/crossfade';

function* rootSaga() {
  yield all([
    themeBootFromLF(),
    watchToggleTheme(),
    volumeBootFromLF(),
    watchSetVolume(),
    repeatBootFromLF(),
    watchSetRepeat(),
    shuffleBootFromLF(),
    watchToggleShuffle(),
    crossfadeBootFromLF(),
    watchSetCrossfade(),
  ]);
}

module.exports = rootSaga;
