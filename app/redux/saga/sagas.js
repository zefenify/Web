/* eslint no-console: off */

import { all } from 'redux-saga/effects';

import { themeBootFromLF, watchToggleTheme } from '@app/redux/saga/theme';
import { volumeBootFromLF, watchSetVolume } from '@app/redux/saga/volume';
import { repeatBootFromLF, watchSetRepeat } from '@app/redux/saga/repeat';
import { shuffleBootFromLF, watchToggleShuffle } from '@app/redux/saga/shuffle';
import { crossfadeBootFromLF, watchSetCrossfade } from '@app/redux/saga/crossfade';
import { watchSetPlaying } from '@app/redux/saga/playing';
import { watchSetDuration } from '@app/redux/saga/duration';
import { watchSetPlaybackPosition } from '@app/redux/saga/playbackPosition';
import { remainingBootFromLF, watchToggleRemaining } from '@app/redux/saga/remaining';
import { watchSetQueueSet, watchSetQueueAdd, watchSetQueueRemove, watchSetQueueClear } from '@app/redux/saga/queue';
import { watchSetCurrent } from '@app/redux/saga/current';
import { userBootFromLF, watchSetUser } from '@app/redux/saga/user';
import { watchPlay, watchPrevious, watchNext, watchSeek, watchTogglePlayPause } from '@app/redux/saga/wolfCola';

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
    watchSetQueueSet(),
    watchSetQueueAdd(),
    watchSetQueueRemove(),
    watchSetQueueClear(),
    watchSetCurrent(),
    watchPlay(),
    watchPrevious(),
    watchNext(),
    watchSeek(),
    watchTogglePlayPause(),
    userBootFromLF(),
    watchSetUser(),
  ]);
}

module.exports = rootSaga;
