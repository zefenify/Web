import { put, takeEvery } from 'redux-saga/effects';

import { SET_CURRENT } from 'app/redux/constant/current';

import { current } from 'app/redux/action/current';

function* setCurrent(action) {
  yield put(current(action.payload));
}

function* watchSetCurrent() {
  yield takeEvery(SET_CURRENT, setCurrent);
}

module.exports = {
  watchSetCurrent,
};
