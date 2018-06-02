/**
 * Everything to do with Howler is handled here. it doesn't necessary have
 * *direct* association with Redux store, but knows what sags to call
 */

import { eventChannel, END, delay } from 'redux-saga';
import { select, put, call, fork, take, throttle, takeEvery, takeLatest } from 'redux-saga/effects';
import { Howl } from 'howler';
import random from 'lodash/fp/random';

import { NOTIFICATION_ON_REQUEST } from '@app/redux/constant/notification';
import { PLAY_REQUEST, NEXT_REQUEST, PREVIOUS_REQUEST, SEEK_REQUEST, PLAY_PAUSE_REQUEST, PREVIOUS_THRESHOLD } from '@app/redux/constant/wolfCola';
import { BASE, BASE_S3 } from '@app/config/api';
import api from '@app/util/api';

import { current } from '@app/redux/action/current';
import { queueSet, queueRemove } from '@app/redux/action/queue';
import { duration } from '@app/redux/action/duration';
import { playbackPosition } from '@app/redux/action/playbackPosition';
import { playing } from '@app/redux/action/playing';
import { queueInitial } from '@app/redux/action/queueInitial';
import { queueNextRemove } from '@app/redux/action/queueNext';
import { historyPush, historyPop, historyFront } from '@app/redux/action/history';
import { loading } from '@app/redux/action/loading';


const wolfCola = {
  playingKey: 'current', // `current` | `next` - key to current Howler object inside `wolfCola`
  loadingKey: null, // `current` | `next` - key to loading Howler object inside `wolfCola`
  current: null, // Howler
  next: null, // Howler
  crossfadeInProgress: false, // flag used for crossfade
};


/**
 * helper function given a Howler object and a Howler event name returns
 * a promise that's resolved when the event is fired. once.
 *
 * @param  {Howler} howl
 * @param  {String} eventName
 * @return {Promise}
 */
const promiseifyHowlEvent = (howl, eventName) => new Promise((resolve) => {
  if (howl !== null) {
    howl.once(eventName, (e) => {
      resolve(e);
    });
  }
});


/**
 * helper function given `key` (`current` | `next`) creates a channel that
 * listens to `end` event from Howler
 *
 * `eventChannel`s are used to communicate with external events with Saga
 * they must always return an unsubscribe function
 *
 * @param  {String} key
 * @return {Function} Channel
 */
const howlerEndChannel = key => eventChannel((emitter) => {
  wolfCola[key].once('end', (end) => {
    emitter({ end }); // this will be returned to the `yield`-er
    emitter(END); // terminate the channel
  });

  return () => {};
});


/**
 * helper function given `key` (`current` | `next`) creates a channel that
 * listens to `loaderror` event from Howler
 *
 * @param  {String} key
 * @return {Function} Channel
 */
const howlerLoadErrorChannel = key => eventChannel((emitter) => {
  wolfCola[key].once('loaderror', (loadError) => {
    /* handle song load error */
    wolfCola.crossfadeInProgress = false;
    emitter({ loadError });
    emitter(END);
  });

  return () => {};
});


/**
 * checks for the current track being played is the last one in the queue
 * this behavior is taken from Apple Music
 *
 * @param  {Object} state
 * @return {Boolean}
 */
// eslint-disable-next-line
const playingLastHistory = state => state.history.length === 1 && state.current.track_id === state.history[0].track_id;


/**
 * generator function given `key` creates a channel listener to `end` event
 * destroys Howler object, event listeners and sets `crossfadeInProgress` to false
 *
 * will be forked by `_play`
 *
 * @param {String} key           [description]
 */
function* howlerEnd(key) {
  const channel = yield call(howlerEndChannel, key);

  // we're only taking a single event i.e. { end }
  yield take(channel);

  // // if we were taking multiple events from the channel we would do
  // try {
  //   while (true) {
  //     const data = yield take(channel);
  //     // process data...
  //   }
  // } finally {
  //   console.log('Channel terminated');
  // }

  wolfCola[wolfCola.playingKey].off();
  wolfCola[wolfCola.playingKey].unload();
  wolfCola[wolfCola.playingKey] = null;
  wolfCola.crossfadeInProgress = false;
  yield put({ type: NEXT_REQUEST });
}


/**
 * generator function given `key` (`current` | `next`) creates a channel listener to `loaderror`
 * event. Sets `loading` to false and sends a notification request for the user
 *
 * will be forked by `_play`
 *
 * @param {String} key
 */
function* howlerLoadError(key) {
  const channel = yield call(howlerLoadErrorChannel, key);

  yield take(channel);
  yield put(loading(false));
  yield put({
    type: NOTIFICATION_ON_REQUEST,
    payload: {
      message: 'Unable to load song. Please try again later',
    },
  });
}


/**
 * returns a generator function that'll use its closure to control whether
 * or not fork request should be accepted or ignored. Easier to test and reason this way?
 *
 * @return {Function} trackerG
 */
const tracker = () => {
  // closure variable used to control `while` should be invoked or not
  let trackerInProgress = false;

  return function* trackerG() {
    // no need to use `cancel` effect, we'll piggy pack on the current fork
    if (trackerInProgress === true) {
      return;
    }

    // there's no need to instantiate another tracker
    trackerInProgress = true;

    while (wolfCola[wolfCola.playingKey] !== null && wolfCola[wolfCola.playingKey].playing()) {
      // current playback progress
      yield put(playbackPosition(wolfCola[wolfCola.playingKey].seek()));

      if (wolfCola.crossfadeInProgress === false) {
        const state = yield select();

        // checking for crossfade threshold...
        if ((state.duration - state.playbackPosition) <= state.crossfade) {
          // sending played, [`track_popularity` and `trend`] will be set
          api(`${BASE}played/${state.current.track_id}`, state.user).then(() => {}, () => {});
          yield put({ type: NEXT_REQUEST });
        }
      }

      yield call(delay, 1000);
    }

    trackerInProgress = false;
  };
};


/**
 * instantiating `tracker` with false. Now `trackerSaga` has an enclosed flag variable
 * to control when to update the playback position
 *
 * will be forked by `_play`
 *
 * @type {Function}
 */
const trackerSaga = tracker();


/**
 * `PLAY_REQUEST` receiver
 *
 * @param {Object} action - redux action { type, payload }
 */
function* _play(action) {
  /**
   * this condition is required to prevent playing multiple songs at the same time
   * when `play` is dispatched while a song is loading
   *
   * the loading instance @ `loadingKey` will be killed
   */
  if (wolfCola.loadingKey !== null && wolfCola[wolfCola.loadingKey] !== null) {
    wolfCola[wolfCola.loadingKey].off();
    wolfCola[wolfCola.loadingKey].unload();
    wolfCola.loadingKey = null;
  }

  const state = yield select();
  const { payload } = action;

  // resetting `queueInitial` for use on repeat `ALL`
  yield put(queueInitial(payload.queueInitial));
  yield put(queueSet(payload.queue));

  /**
   * if `shuffle` is set to true, we'll remove the requested song from the queue
   * so every song in the queue is played once before the repeating a song
   *
   * @param  {Boolean} state.shuffle
   */
  if (state.shuffle === true) {
    // eslint-disable-next-line
    yield put(queueRemove(payload.queue.findIndex(song => song.track_id === payload.play.track_id)));
  }

  // setting `play` payload to current
  yield put(current(payload.play));

  /**
   * `crossfade` is set to off ergo there will not be an instance where
   * two Howler objects playing at the same time i.e. fading
   *
   * destroying any Howler object before instantiating `payload.play`...
   *
   * @param  {Number} state.crossfade
   */
  if (state.crossfade === 0) {
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

    /**
     * checking for crossfade progress and initializing. `state.crossfade` > 0 here
     * there's no need for a channel here as `fade` event will be fired which will be
     * used to destroy the crossfade-ed Howler object
     */
  } else if (wolfCola.crossfadeInProgress === false && state.playing === true) {
    if (wolfCola.current !== null) {
      wolfCola.crossfadeInProgress = true;
      wolfCola.current.fade(1, 0, (state.crossfade * 1000));
      // firing `off` and clearing `howlerEnd` fork - avoiding double NEXT #3
      wolfCola.current.off();
      // on fade completion we'll clear the faded song
      wolfCola.current.once('fade', () => {
        if (wolfCola.current !== null) {
          wolfCola.current.unload();
          wolfCola.current = null;
          wolfCola.crossfadeInProgress = false;
        }
      });
    }

    if (wolfCola.next !== null) {
      wolfCola.crossfadeInProgress = true;
      wolfCola.next.fade(1, 0, (state.crossfade * 1000));
      wolfCola.next.off();
      wolfCola.next.once('fade', () => {
        if (wolfCola.next !== null) {
          wolfCola.next.unload();
          wolfCola.next = null;
          wolfCola.crossfadeInProgress = false;
        }
      });
    }

    /**
     * play requested while crossfade is in progress. Rule here is to terminate
     * the fading song and reset the `crossfadeInProgress` flag
     */
  } else if (wolfCola.crossfadeInProgress === true && state.playing === true) {
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

  // resetting to avoid the quick jump when next song is started
  yield put(playbackPosition(0));

  // picking `playingKey`...
  if (wolfCola.current === null && wolfCola.next === null) {
    wolfCola.playingKey = 'current';
  } else {
    wolfCola.playingKey = wolfCola.current === null ? 'current' : 'next';
  }

  yield put(loading(true));

  /**
   * playing the song - each song will have a Single Howler object that'll be
   * destroyed after each playback - loading all songs (i.e. queue can be costly - I think)
   *
   * single Howler music approach:
   * - single song ID whenever it's called
   * - light [no preparation until asked]
   */
  wolfCola[wolfCola.playingKey] = new Howl({
    src: [`${BASE_S3}${payload.play.track_track.s3_name}`],
    html5: true,
    autoplay: true,
    format: ['mp3'],
  });

  /**
   * when a second `Howl` key is requested, the key `loadingKey` will be used
   * to destroy the previous `Howl` that hasn't finished initializing / loading
   */
  wolfCola.loadingKey = wolfCola.playingKey;

  /**
   * ethio-telecom
   * forking a channel listener for `loaderror` that's responsible for cleanup
   */
  yield fork(howlerLoadError, wolfCola.playingKey);

  // if load doesn't resolve Wolf-Cola won't start
  yield promiseifyHowlEvent(wolfCola[wolfCola.playingKey], 'load');

  /**
   * God bless EthioTele
   * `load` event has been fired, resetting `loadingKey` to `null`
   */
  wolfCola.loadingKey = null;

  // music loaded
  yield put(loading(false));

  // music loaded, setting duration
  // eslint-disable-next-line
  yield put(duration(Number.isFinite(wolfCola[wolfCola.playingKey].duration()) ? wolfCola[wolfCola.playingKey].duration() : payload.play.track_track.s3_meta.duration));

  // setting playing - USING Howler object [autoplay]
  yield put(playing(wolfCola[wolfCola.playingKey].playing()));

  // fork for `end` lister [with channel]
  yield fork(howlerEnd, wolfCola.playingKey);

  // fork for playback position
  yield fork(trackerSaga);
}


/**
 * sets playback position to payload and seeks current Howler object
 *
 * @param {Object} action - redux action { type, payload }
 */
function* _seek(action) {
  // delaying by 64ms to avoid too quick seek operations. An equivalent of an inside throttle effect
  yield call(delay, 64);
  const { payload } = action;
  yield put(playbackPosition(payload));

  if (wolfCola[wolfCola.playingKey] !== null) {
    wolfCola[wolfCola.playingKey].seek(payload);
  }
}


/**
 * will request `PLAY_REQUEST` according to the rules
 * +
 * updates `history` accordingly by pushing an entry (or rearranging the history)
 * +
 * checks for `queueNext` contents
 * NOTE:
 * direct play requests does not affect `queueNext` list
 */
function* _next() {
  const state = yield select();

  // nothing playing - halting...
  if (state.playing === false) {
    return;
  }

  if (state.queueNext.length > 0) {
    const play = Object.assign({}, state.queueNext[0]);

    // POP-ing entry from `queueNext`...
    yield put(queueNextRemove(0));

    /**
     * `payload.queue` is checked as `_play` operates on `store.queue`
     * if `shuffle` is turned on. If gone unchecked, `-1` can be triggered on
     * findIndex of `_play` where it removes entry from `queue` when shuffle is turned on
     */
    yield put({
      type: PLAY_REQUEST,
      payload: {
        play,
        queue: state.shuffle === true ? [play, ...state.queue] : state.queue,
        queueInitial: state.queueInitial,
      },
    });

    return;
  }

  // repeat one whatever was playing...
  if (state.repeat === 'ONE') {
    yield put({
      type: PLAY_REQUEST,
      payload: {
        play: state.current,
        queue: state.queue,
        queueInitial: state.queueInitial,
      },
    });

    return;
  }

  // end of music - no music left; setting "no music" state...
  if (state.queue.length === 0 && state.repeat === 'OFF') {
    yield put(duration(0));
    yield put(playbackPosition(0));
    yield put(playing(false));
    yield put(current(null));

    return;
  }

  // PUSH-ing song to history...
  if (state.current !== null) {
    const historyIndex = state.history.findIndex(song => song.track_id === state.current.track_id);

    /**
     * if song that is playing is in history, the behavior here (taken from Apple Music) is to
     * bring the entry to the top of the history list rather than add a duplicate entry
     */
    if (historyIndex === -1) {
      yield put(historyPush(state.current));
    } else {
      yield put(historyFront(historyIndex));
    }
  }

  /**
   * this is where `queueInitial` is used
   * after playing through the entire queue, if repeat is set to `ALL`
   * `queueInitial` will be used to reset the queue
   */
  if (state.queue.length === 0 && state.repeat === 'ALL') {
    const nextPlayIndex = state.shuffle ? random(0)(state.queueInitial.length - 1) : 0;

    yield put({
      type: PLAY_REQUEST,
      payload: {
        play: state.queueInitial[nextPlayIndex],
        queue: state.queueInitial,
        queueInitial: state.queueInitial,
      },
    });

    return;
  }

  /**
   * repeat is `OFF | ALL`, there are items in queue; picking next item according to shuffle...
   *
   * note here that `play` on the `payload` is taken from `queue`
   */
  if (state.shuffle === true) {
    const nextPlayIndex = random(0)(state.queue.length - 1);

    yield put({
      type: PLAY_REQUEST,
      payload: {
        play: state.queue[nextPlayIndex],
        queue: state.queue,
        queueInitial: state.queueInitial,
      },
    });

    return;
  }

  /**
   * shuffle is `OFF` and there are songs in the queue
   * `_play` will be requested with the next song from the queue
   */
  let nextPlayIndex = state.queueInitial.findIndex(song => song.track_id === state.current.track_id) + 1;

  // the current song that's being played is the last song in the queue
  if (nextPlayIndex === state.queueInitial.length) {
    if (state.repeat === 'ALL') {
      nextPlayIndex = 0;
    } else {
      // killing...
      // crossroading will not be applied here as there's nothing to crossfade-to
      wolfCola[wolfCola.playingKey].off();
      wolfCola[wolfCola.playingKey].unload();
      wolfCola[wolfCola.playingKey] = null;
      wolfCola.crossfadeInProgress = false;

      // yield my beer...
      yield put(duration(0));
      yield put(playbackPosition(0));
      yield put(playing(false));
      yield put(current(null));

      return;
    }
  }

  yield put({
    type: PLAY_REQUEST,
    payload: {
      play: state.queueInitial[nextPlayIndex],
      queue: state.queueInitial,
      queueInitial: state.queueInitial,
    },
  });
}


/**
 * will request `PLAY_REQUEST` according to the rules
 * +
 * it'll POP an entry from `history`
 */
function* _previous() {
  const state = yield select();

  // nothing playing - halting...
  if (state.playing === false) {
    return;
  }

  /**
   * another behavior taken from Apple Music
   * `previous` is requested within `PREVIOUS_THRESHOLD` threshold current song is restarted
   */
  if (state.repeat === 'ONE' || (state.playbackPosition > PREVIOUS_THRESHOLD && state.crossfade > state.playbackPosition)) {
    yield put({
      type: PLAY_REQUEST,
      payload: {
        play: state.current,
        queue: state.queue,
        queueInitial: state.queueInitial,
      },
    });

    return;
  }

  /**
   * there are no songs in the history || current song that's currently being played
   * is the same as the last item in history queue
   */
  if (state.history.length === 0 || playingLastHistory(state)) {
    wolfCola[wolfCola.playingKey].off();
    wolfCola[wolfCola.playingKey].unload();
    wolfCola[wolfCola.playingKey] = null;

    yield put(duration(0));
    yield put(playbackPosition(0));
    yield put(playing(false));
    yield put(current(null));

    return;
  }

  const historyIndex = state.history.findIndex(song => song.track_id === state.history[0].track_id);

  /**
   * `previous` request POPs a song from history entry
   * this behavior is taken from Apple Music - constant previous will eventually halt the player
   */
  if (historyIndex !== -1) {
    yield put(historyPop(historyIndex));
  }

  /**
   * witchcraft!
   *
   * `previous` command does not affect `queueInitial` list
   */
  yield put({
    type: PLAY_REQUEST,
    payload: {
      play: state.history[0],
      queue: state.shuffle === true ? [state.history[0], ...state.queue] : [...state.queueInitial],
      queueInitial: state.queueInitial,
    },
  });
}


/**
 * reads state and toggles active Howler object play state
 */
function* _playPause() {
  const state = yield select();

  // nothing to pause play here, halting...
  if (state.current === null) {
    return;
  }

  // pausing...
  if (state.playing === true) {
    if (wolfCola.current !== null) {
      wolfCola.current.pause();
    }

    if (wolfCola.next !== null) {
      wolfCola.next.pause();
    }

    yield put(playing(false));

    return;
  }

  // playing...
  if (wolfCola.current !== null) {
    wolfCola.current.play();
  }

  if (wolfCola.next !== null) {
    wolfCola.next.play();
  }

  yield put(playing(wolfCola[wolfCola.playingKey].playing()));

  /**
   * this is needed here as a pause will effectively `pause` the tracker
   * tho it does *not* create another watcher as it triggers a resume
   */
  yield fork(trackerSaga);
}


function* playRequest() {
  yield throttle(1000, PLAY_REQUEST, _play);
}


function* seekRequest() {
  yield takeLatest(SEEK_REQUEST, _seek);
}


function* nextRequest() {
  yield throttle(1000, NEXT_REQUEST, _next);
}


function* previousRequest() {
  yield throttle(1000, PREVIOUS_REQUEST, _previous);
}


function* playPauseRequest() {
  yield takeEvery(PLAY_PAUSE_REQUEST, _playPause);
}


module.exports = {
  playRequest,
  previousRequest,
  nextRequest,
  seekRequest,
  playPauseRequest,
};
