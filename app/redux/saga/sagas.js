import { all } from 'redux-saga/effects';

import { themeBootFromLF, themeRequest } from '@app/redux/saga/theme';
import { volumeBootFromLF, volumeRequest } from '@app/redux/saga/volume';
import { repeatBootFromLF, repeatRequest } from '@app/redux/saga/repeat';
import { shuffleBootFromLF, shuffleRequest } from '@app/redux/saga/shuffle';
import { crossfadeBootFromLF, crossfadeRequest } from '@app/redux/saga/crossfade';
import { remainingBootFromLF, remainingRequest } from '@app/redux/saga/remaining';
import { userBootFromLF, userRequest } from '@app/redux/saga/user';
import { playRequest, previousRequest, nextRequest, seekRequest, playPauseRequest } from '@app/redux/saga/wolfCola';
import { contextMenuOnRequest, contextMenuOffRequest } from '@app/redux/saga/contextMenu';
import { songBoot, songBootRequest, songSaveRequest, songRemoveRequest } from '@app/redux/saga/song';
import { notificationOnRequest, notificationOffRequest } from '@app/redux/saga/notification';

function* rootSaga() {
  yield userBootFromLF();

  yield all([
    themeBootFromLF(),
    themeRequest(),
    volumeBootFromLF(),
    volumeRequest(),
    repeatBootFromLF(),
    repeatRequest(),
    shuffleBootFromLF(),
    shuffleRequest(),
    crossfadeBootFromLF(),
    crossfadeRequest(),
    remainingBootFromLF(),
    remainingRequest(),
    playRequest(),
    previousRequest(),
    nextRequest(),
    seekRequest(),
    playPauseRequest(),
    userRequest(),
    contextMenuOnRequest(),
    contextMenuOffRequest(),
    songBoot(),
    songBootRequest(),
    songSaveRequest(),
    songRemoveRequest(),
    notificationOnRequest(),
    notificationOffRequest(),
  ]);
}

module.exports = rootSaga;
