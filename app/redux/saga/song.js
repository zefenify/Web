import { put, select, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import notie from 'notie';

import { BASE, HEADER } from '@app/config/api';
import { SONG_SAVE_REQUEST, SONG_REMOVE_REQUEST, SONG_BOOT_REQUEST } from '@app/redux/constant/song';

import { song } from '@app/redux/action/song';
import { loading } from '@app/redux/action/loading';

function* songBoot() {
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

function* songSave(action) {
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
      song_track: [trackId, ...savedTrackIds],
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

function* songRemove(action) {
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

function* songSaveRequest() {
  yield takeEvery(SONG_SAVE_REQUEST, songSave);
}

function* songRemoveRequest() {
  yield takeEvery(SONG_REMOVE_REQUEST, songRemove);
}

function* songBootRequest() {
  yield takeEvery(SONG_BOOT_REQUEST, songBoot);
}

module.exports = {
  songBoot,
  songSaveRequest,
  songRemoveRequest,
  songBootRequest,
};
