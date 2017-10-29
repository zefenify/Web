import React from 'react';
import { withRouter } from 'react-router';

import store from '@app/redux/store';
import { SET_CONTEXT_MENU_OFF } from '@app/redux/constant/contextMenu';
import { SET_SONG_SAVE, SET_SONG_REMOVE } from '@app/redux/constant/song';

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

const songSave = (track) => {
  store.dispatch({
    type: SET_SONG_SAVE,
    payload: track,
  });
};

const songRemove = (track) => {
  store.dispatch({
    type: SET_SONG_REMOVE,
    payload: track,
  });
};

const ContextMenuContainer = props => (<ContextMenu
  {...props}
  closeContextMenu={closeContextMenu}
  songSave={songSave}
  songRemove={songRemove}
/>);

module.exports = withRouter(DJKhaled('contextMenu', 'user', 'song')(ContextMenuContainer));
