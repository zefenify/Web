/* global window */

import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';

import theme from '@app/redux/reducer/theme';
import volume from '@app/redux/reducer/volume';
import repeat from '@app/redux/reducer/repeat';
import shuffle from '@app/redux/reducer/shuffle';
import crossfade from '@app/redux/reducer/crossfade';
import playing from '@app/redux/reducer/playing';
import duration from '@app/redux/reducer/duration';
import playbackPosition from '@app/redux/reducer/playbackPosition';
import remaining from '@app/redux/reducer/remaining';
import queue from '@app/redux/reducer/queue';
import current from '@app/redux/reducer/current';
import queueInitial from '@app/redux/reducer/queueInitial';
import history from '@app/redux/reducer/history';
import loading from '@app/redux/reducer/loading';
import user from '@app/redux/reducer/user';
import contextMenu from '@app/redux/reducer/contextMenu';
import song from '@app/redux/reducer/song';

import rootSaga from '@app/redux/saga/sagas';

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
    queue,
    current,
    queueInitial,
    history,
    loading,
    user,
    contextMenu,
    song,
  }),
  {
    theme: 'dark',
    volume: 1,
    queue: [],
    queueInitial: [], // queue of songs to be played [used on repeat `ALL` and queue is empty]
    history: [], // where played songs will are pushed [repeat `ONE` will only push once]
    song: null,
    // playlist: [],
    crossfade: 0,
    duration: 0,
    playbackPosition: 0,
    remaining: false,
    // artworkFull: false,
    playing: false,
    shuffle: false,
    repeat: 'OFF',
    current: null, // current song object, *not* the Howler object
    contextMenu: null, // context item to be rendered on `<ContextMenu />`
    // online: false,
    loading: false,
    user: null,
  },
  window.devToolsExtension
    ? compose(applyMiddleware(sagaMiddleware), window.devToolsExtension())
    : applyMiddleware(sagaMiddleware),
);

sagaMiddleware.run(rootSaga);

module.exports = store;
