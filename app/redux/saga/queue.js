/* eslint no-console: off */
/* eslint no-underscore-dangle: off */

import { put, select, takeEvery } from 'redux-saga/effects';

import { QUEUE_SET_REQUEST, QUEUE_ADD_REQUEST, QUEUE_REMOVE_REQUEST, QUEUE_CLEAR_REQUEST } from '@app/redux/constant/queue';

import { queueSet, queueAdd, queueRemove, queueClear } from '@app/redux/action/queue';

function* _queueSet(action) {
  yield put(queueSet(action.payload));
}

function* _queueAdd(action) {
  yield put(queueAdd(action.payload));
}

function* _queueRemove(action) {
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
    yield put(queueRemove(songIndex));
  }
}

function* _queueClear() {
  yield put(queueClear());
}

function* queueSetRequest() {
  yield takeEvery(QUEUE_SET_REQUEST, _queueSet);
}

function* queueAddRequest() {
  yield takeEvery(QUEUE_ADD_REQUEST, _queueAdd);
}

function* queueRemoveRequest() {
  yield takeEvery(QUEUE_REMOVE_REQUEST, _queueRemove);
}

function* queueClearRequest() {
  yield takeEvery(QUEUE_CLEAR_REQUEST, _queueClear);
}

module.exports = {
  queueSetRequest,
  queueClearRequest,
  queueAddRequest,
  queueRemoveRequest,
};
