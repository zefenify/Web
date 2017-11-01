import React from 'react';
import { withRouter } from 'react-router';

import store from '@app/redux/store';
import { SET_CONTEXT_MENU_OFF } from '@app/redux/constant/contextMenu';
import { SONG_SAVE_REQUEST, SONG_REMOVE_REQUEST } from '@app/redux/constant/song';

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
    type: SONG_SAVE_REQUEST,
    payload: track,
  });
};

const songRemove = (track) => {
  store.dispatch({
    type: SONG_REMOVE_REQUEST,
    payload: track,
  });
};

const ContextMenuContainer = props => (<ContextMenu
  {...props}
  closeContextMenu={closeContextMenu}
  songSave={songSave}
  songRemove={songRemove}
/>);

// NOTE:
// `history` prop comes from React Router not state
// clash-alaregem
// to prevent future name collision TODO: rename `history` state entry
module.exports = withRouter(DJKhaled('contextMenu', 'user', 'song')(ContextMenuContainer));
