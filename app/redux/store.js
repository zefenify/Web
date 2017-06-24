/* global window */
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';

import theme from 'app/redux/reducer/theme';
import volume from 'app/redux/reducer/volume';
import repeat from 'app/redux/reducer/repeat';
import shuffle from 'app/redux/reducer/shuffle';
import crossfade from 'app/redux/reducer/crossfade';
import playing from 'app/redux/reducer/playing';
import duration from 'app/redux/reducer/duration';
import playbackPosition from 'app/redux/reducer/playbackPosition';
import remaining from 'app/redux/reducer/remaining';
import songId from 'app/redux/reducer/songId';
import queue from 'app/redux/reducer/queue';
import current from 'app/redux/reducer/current';

import rootSaga from 'app/redux/saga/sagas';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  combineReducers({
    theme,
    volume,
    repeat,
    shuffle,
    crossfade,
    playing,
    duration,
    playbackPosition,
    remaining,
    songId,
    queue,
    current,
  }),
  {
    theme: 'dark',
    volume: 1,
    queue: [],
    // history: [],
    // match: [],
    // saved: [],
    // playlist: [],
    crossfade: 0,
    duration: 0,
    playbackPosition: 0,
    remaining: false,
    songId: null,
    // artworkFull: false,
    playing: false,
    shuffle: false,
    repeat: 'OFF',
    current: null, // current song object, *not* the Howler object
    // online: false,
    // loading: false,
  },
  window.devToolsExtension
    ? compose(applyMiddleware(sagaMiddleware), window.devToolsExtension())
    : applyMiddleware(sagaMiddleware),
);

sagaMiddleware.run(rootSaga);

module.exports = store;
