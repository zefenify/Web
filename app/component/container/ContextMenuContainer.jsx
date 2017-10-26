import React from 'react';

import store from '@app/redux/store';
import { SET_CONTEXT_MENU_OFF } from '@app/redux/constant/contextMenu';

import DJKhaled from '@app/component/hoc/DJKhaled';
import ContextMenu from '@app/component/presentational/ContextMenu';

const closeContextMenu = () => {
  const { contextMenu } = store.getState();

  if (contextMenu === null) {
    return;
  }

  store.dispatch({
    type: SET_CONTEXT_MENU_OFF,
  });
};

const ContextMenuContainer = () => <ContextMenu closeContextMenu={closeContextMenu} />;

module.exports = DJKhaled()(ContextMenuContainer);
