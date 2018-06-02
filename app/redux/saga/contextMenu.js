/* global document */
/* eslint no-console: off */

import { delay } from 'redux-saga';
import { call, put, select, takeEvery } from 'redux-saga/effects';

import { CONTEXT_MENU_ON_REQUEST, CONTEXT_MENU_OFF_REQUEST } from '@app/redux/constant/contextMenu';
import { contextMenuOn, contextMenuOff } from '@app/redux/action/contextMenu';

function* _contextMenuOn(action) {
  const state = yield select();

  // this is not suppose to happen - only one context at at time
  if (state.contextMenu !== null) {
    console.warn('double context triggered, ANC');
    return;
  }

  yield put(contextMenuOn(action.payload));

  // brining it in...
  const ContextMenuContainer = document.querySelector('#context-menu-container');
  ContextMenuContainer.classList.add('context-menu-active');

  // wolf cola leaving the stage...
  const WolfColaContainer = document.querySelector('#wolf-cola-container');
  WolfColaContainer.classList.add('context-menu-active');

  // overly will be over wolf-cola-container i.e. click outside triggers close...
  const ContextOverlayContainer = document.querySelector('#context-overlay-container');
  ContextOverlayContainer.style.zIndex = 100;
}

function* _contextMenuOff() {
  const WolfColaContainer = document.querySelector('#wolf-cola-container');
  WolfColaContainer.classList.remove('context-menu-active');

  const ContextMenuContainer = document.querySelector('#context-menu-container');
  ContextMenuContainer.classList.remove('context-menu-active');

  const ContextOverlayContainer = document.querySelector('#context-overlay-container');
  ContextOverlayContainer.style.zIndex = 98;

  yield call(delay, 256);
  yield put(contextMenuOff(null));
}

function* contextMenuOnRequest() {
  yield takeEvery(CONTEXT_MENU_ON_REQUEST, _contextMenuOn);
}

function* contextMenuOffRequest() {
  yield takeEvery(CONTEXT_MENU_OFF_REQUEST, _contextMenuOff);
}

module.exports = {
  contextMenuOnRequest,
  contextMenuOffRequest,
};
