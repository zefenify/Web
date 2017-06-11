/**
 * ### ACTIONS ###
 * PLAY
 * PAUSE
 * NEXT
 * PREVIOUS
 * STOP
 * SEEK
 * PROGRESS
 * REMAINING
 * SHUFFLE
 * CROSSFADE
 * REPEAT
 * LIKE
 * UNLIKE
 * ARTWORK_FULL
 * THEME
 * SEARCH
 * LOADING
 * ONLINE
 * SAVE
 * REMOVE
 * CREATE_PLAYLIST
 * UPDATE_PLAYLIST
 * DELETE_PLAYLIST
 * ADD_TO_PLAYLIST
 * REMOVE_FROM_PLAYLIST
 *
 * ### STATE ###
 * {
 *   theme: 'light | dark',
 *   queue: [],
 *   history: [],
 *   match: [],
 *   saved: [],
 *   playlist: [],
 *   crossfade: 0, // MAX: 12
 *   remaining: Boolean, // false -> song length, true -> -remaining
 *   artworkFull: Boolean,
 *   playing: Boolean,
 *   shuffle: Boolean,
 *   repeat: 'OFF|ONE|ALL',
 *   current: null | Object, // state update 1 second interval, reselect at bay
 *   online: Boolean, // even tho adding offline capability is possible, I will *NOT* do that
 *   loading: Boolean,
 * }
 */

/* global window */
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';

import theme from 'app/redux/reducer/theme';
import volume from 'app/redux/reducer/volume';
import repeat from 'app/redux/reducer/repeat';
import shuffle from 'app/redux/reducer/shuffle';
import rootSaga from 'app/redux/saga/sagas';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  combineReducers({ theme, volume, repeat, shuffle }),
  {
    theme: 'dark',
    volume: 1,
    // queue: [],
    // history: [],
    // match: [],
    // saved: [],
    // playlist: [],
    // crossfade: 0,
    // remaining: false,
    // artworkFull: false,
    // playing: false,
    shuffle: false,
    repeat: 'OFF',
    // current: null,
    // online: false,
    // loading: false,
  },
  window.devToolsExtension
    ? compose(applyMiddleware(sagaMiddleware), window.devToolsExtension())
    : applyMiddleware(sagaMiddleware),
);

sagaMiddleware.run(rootSaga);

module.exports = store;
