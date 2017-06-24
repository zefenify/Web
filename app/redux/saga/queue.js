/* eslint no-console: 0 */

import { put, select, takeEvery } from 'redux-saga/effects';

import { SET_QUEUE_SET, SET_QUEUE_ADD, SET_QUEUE_REMOVE, SET_QUEUE_CLEAR } from 'app/redux/constant/queue';

import { queueSet, queueAdd, queueRemove, queueClear } from 'app/redux/action/queue';

function* setQueueSet(action) {
  yield put(queueSet(action.payload));
}

function* watchSetQueueSet() {
  yield takeEvery(SET_QUEUE_SET, setQueueSet);
}

function* setQueueAdd(action) {
  yield put(queueAdd(action.payload));
}

function* watchSetQueueAdd() {
  yield takeEvery(SET_QUEUE_ADD, setQueueAdd);
}

function* setQueueRemove(action) {
  const { queue } = yield select();
  let songIndex = -1;
  const l = queue.length;

  for (let i = 0; i < l; i += 1) {
    if (queue[i].songId === action.payload.songId) {
      songIndex = i;
      break;
    }
  }

  if (songIndex > -1) {
    yield put(queueRemove({ index: songIndex }));
  }
}

function* watchSetQueueRemove() {
  yield takeEvery(SET_QUEUE_REMOVE, setQueueRemove);
}

function* setQueueClear() {
  yield put(queueClear());
}

function* watchSetQueueClear() {
  yield takeEvery(SET_QUEUE_CLEAR, setQueueClear);
}

module.exports = {
  watchSetQueueSet,
  watchSetQueueAdd,
  watchSetQueueRemove,
  watchSetQueueClear,
};
