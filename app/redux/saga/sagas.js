/* eslint no-console: 0 */

import { all } from 'redux-saga/effects';

import { themeBootFromLF, watchToggleTheme } from 'app/redux/saga/theme';
import { volumeBootFromLF, watchSetVolume } from 'app/redux/saga/volume';
import { repeatBootFromLF, watchSetRepeat } from 'app/redux/saga/repeat';
import { shuffleBootFromLF, watchToggleShuffle } from 'app/redux/saga/shuffle';
import { crossfadeBootFromLF, watchSetCrossfade } from 'app/redux/saga/crossfade';
import { watchSetPlaying } from 'app/redux/saga/playing';
import { watchSetDuration } from 'app/redux/saga/duration';
import { watchSetPlaybackPosition } from 'app/redux/saga/playbackPosition';
import { remainingBootFromLF, watchToggleRemaining } from 'app/redux/saga/remaining';
import { watchSetSongId } from 'app/redux/saga/songId';
import { watchSetQueueSet, watchSetQueueAdd, watchSetQueueRemove, watchSetQueueClear } from 'app/redux/saga/queue';

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
    watchSetPlaying(),
    watchSetDuration(),
    watchSetPlaybackPosition(),
    remainingBootFromLF(),
    watchToggleRemaining(),
    watchSetSongId(),
    watchSetQueueSet(),
    watchSetQueueAdd(),
    watchSetQueueRemove(),
    watchSetQueueClear(),
  ]);
}

module.exports = rootSaga;
