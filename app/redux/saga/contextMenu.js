/* global document */
/* eslint no-console: off */

import { put, select, takeEvery } from 'redux-saga/effects';

import { SET_CONTEXT_MENU_ON, SET_CONTEXT_MENU_OFF } from '@app/redux/constant/contextMenu';
import { contextMenuOn, contextMenuOff } from '@app/redux/action/contextMenu';

function* setContextMenuOn(action) {
  const state = yield select();

  // this is not suppose to happen - only one context at at time
  if (state.contextMenu !== null) {
    console.warn('double context triggered, ANC');
    return;
  }

  yield put(contextMenuOn(action.payload));

  // brining it in...
  const ContextMenuContainer = document.querySelector('#context-menu-container');
  ContextMenuContainer.style.transform = 'translateX(0px)';

  // overly will be over wolf-cola-container i.e. click outside triggers close...
  const ContextOverlayContainer = document.querySelector('#context-overlay-container');
  ContextOverlayContainer.style.zIndex = 100;

  // wolf cola leaving the stage...
  const WolfColaContainer = document.querySelector('#wolf-cola-container');
  WolfColaContainer.style.filter = 'blur(4px)';
  WolfColaContainer.style.transform = 'scale(0.92)';
}

function* setContextMenuOff() {
  yield put(contextMenuOff(null));

  const ContextMenuContainer = document.querySelector('#context-menu-container');
  ContextMenuContainer.style.transform = 'translateX(264px)';

  const ContextOverlayContainer = document.querySelector('#context-overlay-container');
  ContextOverlayContainer.style.zIndex = 98;

  const WolfColaContainer = document.querySelector('#wolf-cola-container');
  WolfColaContainer.style.filter = 'blur(0px)';
  WolfColaContainer.style.transform = 'scale(1)';
}

function* watchContextMenuOn() {
  yield takeEvery(SET_CONTEXT_MENU_ON, setContextMenuOn);
}

function* watchContextMenuOff() {
  yield takeEvery(SET_CONTEXT_MENU_OFF, setContextMenuOff);
}

module.exports = {
  watchContextMenuOn,
  watchContextMenuOff,
};
