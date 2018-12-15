import { all } from 'redux-saga/effects';

import { themeBootFromLocalStorage, themeRequest } from '@app/redux/saga/theme';
import { volumeBootFromLocalStorage, volumeRequest } from '@app/redux/saga/volume';
import { repeatBootFromLocalStorage, repeatRequest } from '@app/redux/saga/repeat';
import { shuffleBootFromLocalStorage, shuffleRequest } from '@app/redux/saga/shuffle';
import { crossfadeBootFromLocalStorage, crossfadeRequest } from '@app/redux/saga/crossfade';
import { remainingBootFromLocalStorage, remainingRequest } from '@app/redux/saga/remaining';
import { userBootFromLocalStorage, userRequest } from '@app/redux/saga/user';
import {
  playRequest,
  previousRequest,
  nextRequest,
  seekRequest,
  playPauseRequest,
} from '@app/redux/saga/wolfCola';
import { contextMenuOnRequest, contextMenuOffRequest } from '@app/redux/saga/contextMenu';
import {
  songBoot,
  songBootRequest,
  songSaveRequest,
  songRemoveRequest,
} from '@app/redux/saga/song';
import { notificationOnRequest, notificationOffRequest } from '@app/redux/saga/notification';


function* rootSaga() {
  yield crossfadeBootFromLocalStorage();
  yield volumeBootFromLocalStorage();
  yield shuffleBootFromLocalStorage();
  yield repeatBootFromLocalStorage();
  yield remainingBootFromLocalStorage();
  yield userBootFromLocalStorage();
  yield themeBootFromLocalStorage();

  yield all([
    themeRequest(),
    volumeRequest(),
    repeatRequest(),
    shuffleRequest(),
    crossfadeRequest(),
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


export default rootSaga;
