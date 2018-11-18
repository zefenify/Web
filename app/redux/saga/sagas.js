import { all } from 'redux-saga/effects';

import { themeBootFromLocalforage, themeRequest } from '@app/redux/saga/theme';
import { volumeBootFromLocalforage, volumeRequest } from '@app/redux/saga/volume';
import { repeatBootFromLocalforage, repeatRequest } from '@app/redux/saga/repeat';
import { shuffleBootFromLocalforage, shuffleRequest } from '@app/redux/saga/shuffle';
import { crossfadeBootFromLocalforage, crossfadeRequest } from '@app/redux/saga/crossfade';
import { remainingBootFromLocalforage, remainingRequest } from '@app/redux/saga/remaining';
import { userBootFromLocalforage, userRequest } from '@app/redux/saga/user';
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
  yield crossfadeBootFromLocalforage();
  yield volumeBootFromLocalforage();
  yield shuffleBootFromLocalforage();
  yield repeatBootFromLocalforage();
  yield remainingBootFromLocalforage();
  yield userBootFromLocalforage();

  yield all([
    themeBootFromLocalforage(),
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
