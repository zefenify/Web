/* global window */
/* eslint max-len: off */

// production
// import {
//   createStore,
//   combineReducers,
//   applyMiddleware,
// } from 'redux';

// development
import {
  createStore,
  combineReducers,
  applyMiddleware,
  compose,
} from 'redux';
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
import current from '@app/redux/reducer/current';
import queue from '@app/redux/reducer/queue';
import queueNext from '@app/redux/reducer/queueNext';
import queueInitial from '@app/redux/reducer/queueInitial';
import history from '@app/redux/reducer/history';
import loading from '@app/redux/reducer/loading';
import user from '@app/redux/reducer/user';
import contextMenu from '@app/redux/reducer/contextMenu';
import song from '@app/redux/reducer/song';
import notification from '@app/redux/reducer/notification';
import urlCurrentPlaying from '@app/redux/reducer/urlCurrentPlaying';
import rootSaga from '@app/redux/saga/index';


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
    current,
    queue,
    queueNext,
    queueInitial,
    history,
    loading,
    user,
    contextMenu,
    song,
    notification,
    urlCurrentPlaying,
  }),
  {
    theme: 'DARK',
    volume: 1,
    queue: [],
    queueNext: [], // queue of tracks that have been requested to be played next
    queueInitial: [], // queue of tracks to be played [used on repeat `ALL` and queue is empty]
    history: [], // where played tracks will are pushed [repeat `ONE` will only push once]
    song: null, // saved tracks { data, included }
    // playlist: [],
    crossfade: 0, // in seconds
    duration: 0, // current playing track duration in seconds
    playbackPosition: 0, // current playing track playback position in seconds
    remaining: false,
    // artworkFull: false,
    playing: false,
    shuffle: false,
    repeat: 'OFF',
    current: null, // current track object, *not* the Howler object
    contextMenu: null, // context item to be rendered on `<ContextMenu />`
    // online: false,
    loading: true,
    user: null,
    notification: null,
    urlCurrentPlaying: null,
  },
  // applyMiddleware(sagaMiddleware), // production
  window.__REDUX_DEVTOOLS_EXTENSION__ ? compose(applyMiddleware(sagaMiddleware), window.__REDUX_DEVTOOLS_EXTENSION__()) : applyMiddleware(sagaMiddleware), // development
);


sagaMiddleware.run(rootSaga);


export default store;
