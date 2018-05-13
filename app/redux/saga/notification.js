/* global document */
/* eslint no-console: off */

import { delay } from 'redux-saga';
import { call, put, takeLatest } from 'redux-saga/effects';

import { NOTIFICATION_DURATION, NOTIFICATION_ON_REQUEST, NOTIFICATION_OFF_REQUEST } from '@app/redux/constant/notification';
import { notification } from '@app/redux/action/notification';

function* _notificationOn(action) {
  yield put(notification(action.payload));
  yield call(delay, 500); // that's for the DOM rendering to complete

  const NotificationContainer = document.querySelector('#notification-container');
  NotificationContainer.classList.add('notification-active');

  yield call(delay, NOTIFICATION_DURATION);
  yield put({ type: NOTIFICATION_OFF_REQUEST });
}

function* _notificationOff() {
  const NotificationContainer = document.querySelector('#notification-container');
  NotificationContainer.classList.remove('notification-active');

  yield call(delay, 500);
  yield put(notification(null));
}

function* notificationOnRequest() {
  yield takeLatest(NOTIFICATION_ON_REQUEST, _notificationOn);
}

function* notificationOffRequest() {
  yield takeLatest(NOTIFICATION_OFF_REQUEST, _notificationOff);
}

module.exports = {
  notificationOnRequest,
  notificationOffRequest,
};
