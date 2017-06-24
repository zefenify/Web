/* eslint no-console: 0 */

/**
 * Everything to do with Howler is handled here. it doesn't necessary have
 * *direct* association with Redux store, but knows what sags to call
 */

import { eventChannel, END, delay } from 'redux-saga';
import { select, throttle, put, call, fork, take, takeLatest } from 'redux-saga/effects';
import { Howl } from 'howler';
import findIndex from 'lodash/fp/findIndex';

import { PLAY, SEEK } from 'app/redux/constant/wolfCola';

import { current } from 'app/redux/action/current';
import { queueSet, queueRemove } from 'app/redux/action/queue';
import { duration } from 'app/redux/action/duration';
import { playbackPosition } from 'app/redux/action/playbackPosition';
import { playing } from 'app/redux/action/playing';
import { songId } from 'app/redux/action/songId';

const wolfCola = {
  playingKey: 'current',
  current: null,
  next: null,
  crossfadeInProgress: false,
};

const promiseifyHowlEvent = (howl, eventName) => new Promise((resolve) => {
  if (howl !== null) {
    howl.once(eventName, (e) => {
      resolve(e);
    });
  }
});

function* play(action) {
  const state = yield select();

  yield put(queueSet(action.payload.queue));
  // eslint-disable-next-line
  yield put(queueRemove(findIndex(song => song.songId === action.payload.play.songId)(action.payload.queue)));
  yield put(current(action.payload.play));
  yield put(songId(action.payload.play.songId));

  // checking for crossfade and initializing
  if (wolfCola.crossfadeInProgress === false && state.crossfade > 0 && state.playing === true) {
    if (wolfCola.current !== null) {
      wolfCola.crossfadeInProgress = true;
      wolfCola.current.fade(1, 0, (state.crossfade * 1000));
      wolfCola.current.once('fade', () => {
        wolfCola.current.unload();
        wolfCola.current = null;
        wolfCola.crossfadeInProgress = false;
      });
    } else if (wolfCola.next !== null) {
      wolfCola.crossfadeInProgress = true;
      wolfCola.next.fade(1, 0, (state.crossfade * 1000));
      wolfCola.next.once('fade', () => {
        wolfCola.next.unload();
        wolfCola.next = null;
        wolfCola.crossfadeInProgress = false;
      });
    }
  } else if (state.playing === true) {
    if (wolfCola.current !== null) {
      wolfCola.current.unload();
      wolfCola.current = null;
    } else if (wolfCola.next !== null) {
      wolfCola.next.unload();
      wolfCola.next = null;
    }
  }

  if (wolfCola.current === null && wolfCola.next === null) {
    wolfCola.playingKey = 'current';
  } else {
    wolfCola.playingKey = wolfCola.current === null ? 'current' : 'next';
  }

  wolfCola[wolfCola.playingKey] = new Howl({
    src: [action.payload.play.songId],
    html5: true,
    autoplay: true,
  });

  wolfCola[wolfCola.playingKey].once('loaderror', () => {
    wolfCola.crossfadeInProgress = false;
    console.warn('loaderror, ላሽ ላሽ');
  });

  yield promiseifyHowlEvent(wolfCola[wolfCola.playingKey], 'load');
  yield put(duration(wolfCola[wolfCola.playingKey].duration()));
  yield put(playing(wolfCola[wolfCola.playingKey].playing()));

  // CHANNELS...CHANNELS EVERYWHERE!
  yield fork(function* howlerEnd() {
    const howlerEndChannel = () => eventChannel((emitter) => {
      wolfCola[wolfCola.playingKey].once('end', (end) => {
        emitter({ end });
        emitter(END);
      });

      return () => {};
    });

    const channel = yield call(howlerEndChannel);
    yield take(channel);
    wolfCola[wolfCola.playingKey].unload();
    wolfCola[wolfCola.playingKey] = null;
    wolfCola.crossfadeInProgress = false;
    yield put(playing(false));
    yield put(duration(0));
    yield put(playbackPosition(0));
  });

  while (wolfCola[wolfCola.playingKey] !== null && wolfCola[wolfCola.playingKey].playing()) {
    yield put(playbackPosition(wolfCola[wolfCola.playingKey].seek()));

    if (wolfCola.crossfadeInProgress === false) {
      const stateCheck = yield select();

      if ((stateCheck.duration - stateCheck.playbackPosition) <= stateCheck.crossfade) {
        wolfCola.crossfadeInProgress = true;
        wolfCola[wolfCola.playingKey].fade(1, 0, (stateCheck.crossfade * 1000));
      }
    }

    yield call(delay, 1000);
  }
}

function* seek(action) {
  yield put(playbackPosition(action.payload));

  if (wolfCola[wolfCola.playingKey] !== null) {
    wolfCola[wolfCola.playingKey].seek(action.payload);
  }
}

function* watchPlay() {
  yield takeLatest(PLAY, play);
}

function* watchSeek() {
  yield throttle(250, SEEK, seek);
}

module.exports = {
  watchPlay,
  watchSeek,
};
