/* eslint no-console: 0 */

import { put, takeEvery } from 'redux-saga/effects';

import { SET_SONG_ID } from 'app/redux/constant/songId';

import { songId } from 'app/redux/action/songId';

function* setSongId(action) {
  yield put(songId(action.payload));
}

function* watchSetSongId() {
  yield takeEvery(SET_SONG_ID, setSongId);
}

module.exports = {
  watchSetSongId,
};
