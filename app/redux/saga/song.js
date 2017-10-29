import { put, select, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import notie from 'notie';

import { BASE, HEADER } from '@app/config/api';
import { SET_SONG_SAVE, SET_SONG_REMOVE } from '@app/redux/constant/song';

import { song } from '@app/redux/action/song';
import { loading } from '@app/redux/action/loading';

function* bootSong() {
  const { user } = yield select();

  // no user, clearing song state...
  if (user === null) {
    yield put(song(null));
    return;
  }

  try {
    yield put(loading(true));

    const response = yield axios.get(`${BASE}songs`, {
      headers: {
        [HEADER]: user === null ? undefined : user.jwt,
      },
    });

    yield put(loading(false));
    yield put(song(response.data));
  } catch (err) {
    yield put(loading(false));
    yield put(song(null));

    if (err.message === 'Network Error') {
      notie.alert({
        type: 'error',
        text: 'ጭራሽ ጭጭ - Network',
        time: 5,
      });

      return;
    }

    notie.alert({
      type: 'error',
      text: 'ይቅርታ, Unable to fetch Your Library',
      time: 5,
    });
  }
}

function* setSongSave(action) {
  const state = yield select();

  if (state.song === null) {
    return;
  }

  const savedTrackIds = state.song.data.song_track;
  const trackId = action.payload.track_id;

  // track already saved, aborting...
  if (savedTrackIds.includes(trackId) === true) {
    return;
  }

  try {
    yield put(loading(true));

    const response = yield axios.patch(`${BASE}songs`, {
      song_track: savedTrackIds.concat(trackId),
    }, {
      headers: {
        [HEADER]: state.user === null ? undefined : state.user.jwt,
      },
    });

    yield put(loading(false));
    yield put(song(response.data));
  } catch (err) {
    yield put(loading(false));

    if (err.message === 'Network Error') {
      notie.alert({
        type: 'error',
        text: 'ጭራሽ ጭጭ - Network',
        time: 5,
      });

      return;
    }

    notie.alert({
      type: 'error',
      text: 'ይቅርታ, Unable to save song to Your Library',
      time: 5,
    });
  }
}

function* setSongRemove(action) {
  const state = yield select();

  if (state.song === null) {
    return;
  }

  const savedTrackIds = state.song.data.song_track;
  const trackId = action.payload.track_id;

  // track not saved, aborting...
  if (savedTrackIds.includes(trackId) === false) {
    return;
  }

  try {
    yield put(loading(true));

    const response = yield axios.patch(`${BASE}songs`, {
      song_track: [
        ...savedTrackIds.slice(0, savedTrackIds.indexOf(trackId)),
        ...savedTrackIds.slice(savedTrackIds.indexOf(trackId) + 1),
      ],
    }, {
      headers: {
        [HEADER]: state.user === null ? undefined : state.user.jwt,
      },
    });

    yield put(loading(false));
    yield put(song(response.data));
  } catch (err) {
    yield put(loading(false));

    if (err.message === 'Network Error') {
      notie.alert({
        type: 'error',
        text: 'ጭራሽ ጭጭ - Network',
        time: 5,
      });

      return;
    }

    notie.alert({
      type: 'error',
      text: 'ይቅርታ, Unable to remove song from Your Library',
      time: 5,
    });
  }
}

function* watchSetSongSave() {
  yield takeEvery(SET_SONG_SAVE, setSongSave);
}

function* watchSetSongRemove() {
  yield takeEvery(SET_SONG_REMOVE, setSongRemove);
}

module.exports = {
  bootSong,
  watchSetSongSave,
  watchSetSongRemove,
};
