import React from 'react';

import store from '@app/redux/store';
import { SET_CONTEXT_MENU_OFF } from '@app/redux/constant/contextMenu';

import DJKhaled from '@app/component/hoc/DJKhaled';
import ContextOverlay from '@app/component/presentational/ContextOverlay';

const closeContextMenu = () => {
  const { contextMenu } = store.getState();

  if (contextMenu === null) {
    return;
  }

  store.dispatch({
    type: SET_CONTEXT_MENU_OFF,
  });
};

const ContextOverlayContainer = () => <ContextOverlay closeContextMenu={closeContextMenu} />;

module.exports = DJKhaled()(ContextOverlayContainer);
