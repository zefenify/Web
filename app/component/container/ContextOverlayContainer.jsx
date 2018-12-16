import React from 'react';

import { CONTEXT_MENU_OFF_REQUEST } from '@app/redux/constant/contextMenu';
import store from '@app/redux/store';
import ContextOverlay from '@app/component/presentational/ContextOverlay';


const contextMenuClose = () => {
  const { contextMenu } = store.getState();

  if (contextMenu === null) {
    return;
  }

  store.dispatch({
    type: CONTEXT_MENU_OFF_REQUEST,
  });
};


const ContextOverlayContainer = () => <ContextOverlay contextMenuClose={contextMenuClose} />;


export default ContextOverlayContainer;
