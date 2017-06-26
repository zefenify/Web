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

// Howler `load` event will be yielded - so if it's never loaded
const promiseifyHowlEvent = (howl, eventName) => new Promise((resolve) => {
  if (howl !== null) {
    howl.once(eventName, (e) => {
      resolve(e);
    });
  }
});

// Emitter - we have PUT in the `end` callback
// 1. clearing if there's no _next_
// 2. passing playing key to the song that's fading in
const howlerEndChannel = key => eventChannel((emitter) => {
  wolfCola[key].once('end', (end) => {
    emitter({ end });
    emitter(END);
  });

  return () => {};
});

// Channel - listens to end either passes key to next or clears state to "no play"
function* howlerEnd(key) {
  const channel = yield call(howlerEndChannel, key);

  // we're only taking a single event i.e. { end }
  // there's no need to clear on `finally | END` as all will be cleared _here_
  yield take(channel);
  wolfCola[wolfCola.playingKey].off();
  wolfCola[wolfCola.playingKey].unload();
  wolfCola[wolfCola.playingKey] = null;
  wolfCola.crossfadeInProgress = false;

  // nothing is playing _next_
  // setting to "no play" sate - duration, playback, playing, current, songId
  if (wolfCola[wolfCola.playingKey === 'current' ? 'next' : 'current'] === null) {
    yield put(duration(0));
    yield put(playbackPosition(0));
    yield put(playing(false));
    yield put(current(null));
    yield put(songId(null));
  } else {
    // passing the key to the fading-in-ing song creating a _recursive generator_
    // the whole condition continues as if nothing happened
    wolfCola.playingKey = wolfCola.playingKey === 'current' ? 'next' : 'current';
  }
}

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
        wolfCola.current.off();
        wolfCola.current.unload();
        wolfCola.current = null;
        wolfCola.crossfadeInProgress = false;
      });
    }

    if (wolfCola.next !== null) {
      wolfCola.crossfadeInProgress = true;
      wolfCola.next.fade(1, 0, (state.crossfade * 1000));
      wolfCola.next.once('fade', () => {
        wolfCola.next.off();
        wolfCola.next.unload();
        wolfCola.next = null;
        wolfCola.crossfadeInProgress = false;
      });
    }
  } else if (wolfCola.crossfadeInProgress === true && state.playing === true) { // play triggered while crossfade in progress
    if (wolfCola.current !== null) {
      wolfCola.current.off();
      wolfCola.current.unload();
      wolfCola.current = null;
    }

    if (wolfCola.next !== null) {
      wolfCola.next.off();
      wolfCola.next.unload();
      wolfCola.next = null;
    }

    wolfCola.crossfadeInProgress = false;
  }

  // picking `playingKey`...
  if (wolfCola.current === null && wolfCola.next === null) {
    wolfCola.playingKey = 'current';
  } else {
    wolfCola.playingKey = wolfCola.current === null ? 'current' : 'next';
  }

  // playing the song - each song will have a Single Howler object that'll be
  // destroyed after each playback - loading all songs (i.e. queue can be costly - I think)
  // single Howler music approach:
  // - single song ID whenever it's called
  // - light [no preparation until asked]
  wolfCola[wolfCola.playingKey] = new Howl({
    src: [action.payload.play.songId],
    html5: true,
    autoplay: true,
  });

  // ethio-telecom
  wolfCola[wolfCola.playingKey].once('loaderror', () => {
    wolfCola.crossfadeInProgress = false;
    console.warn('Current song [loaderror], ላሽ ላሽ');
  });

  // if load doesn't resolve Wolf-Cola won't start
  yield promiseifyHowlEvent(wolfCola[wolfCola.playingKey], 'load');
  // music loaded, setting duration
  yield put(duration(wolfCola[wolfCola.playingKey].duration()));
  // setting playing - USING Howler object [autoplay]
  yield put(playing(wolfCola[wolfCola.playingKey].playing()));
  // fork for `end` lister [with channel]
  yield fork(howlerEnd, wolfCola.playingKey);

  // tracker...
  while (wolfCola[wolfCola.playingKey] !== null && wolfCola[wolfCola.playingKey].playing()) {
    // current playback progress
    yield put(playbackPosition(wolfCola[wolfCola.playingKey].seek()));

    if (wolfCola.crossfadeInProgress === false) {
      const stateCheck = yield select();

      // checking for crossfade threshold
      if ((stateCheck.duration - stateCheck.playbackPosition) <= stateCheck.crossfade) {
        // blocking further crossfade checks by turning on progress...
        wolfCola.crossfadeInProgress = true;
        // fading out the current song...
        wolfCola[wolfCola.playingKey].fade(1, 0, (stateCheck.crossfade * 1000));

        // [REPEAT: ONE]
        if (stateCheck.repeat === 'ONE') {
          const nextPlay = wolfCola.playingKey === 'current' ? 'next' : 'current';

          // playing next track on the next `object` of wolfCola...
          wolfCola[nextPlay] = new Howl({
            src: [stateCheck.current.songId],
            html5: true,
            autoplay: true,
          });

          // ethio-telecom
          wolfCola[nextPlay].once('loaderror', () => {
            wolfCola.crossfadeInProgress = false;
            console.warn('Next song [loaderror], ላሽ ላሽ');
          });

          yield promiseifyHowlEvent(wolfCola[nextPlay], 'load');
          yield put(duration(wolfCola[nextPlay].duration()));
          yield put(playing(wolfCola[nextPlay].playing()));
          wolfCola[nextPlay].fade(0, 1, (state.crossfade * 1000));
          yield fork(howlerEnd, nextPlay);
        }
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
