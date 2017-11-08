import React from 'react';

import store from '@app/redux/store';
import { CONTEXT_MENU_OFF_REQUEST } from '@app/redux/constant/contextMenu';

import DJKhaled from '@app/component/hoc/DJKhaled';
import ContextOverlay from '@app/component/presentational/ContextOverlay';

const closeContextMenu = () => {
  const { contextMenu } = store.getState();

  if (contextMenu === null) {
    return;
  }

  store.dispatch({
    type: CONTEXT_MENU_OFF_REQUEST,
  });
};

const ContextOverlayContainer = () => <ContextOverlay closeContextMenu={closeContextMenu} />;

module.exports = DJKhaled(ContextOverlayContainer);
