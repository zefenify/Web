import React from 'react';
import { withRouter } from 'react-router';

import store from '@app/redux/store';
import { CONTEXT_MENU_OFF_REQUEST } from '@app/redux/constant/contextMenu';
import { SONG_SAVE_REQUEST, SONG_REMOVE_REQUEST } from '@app/redux/constant/song';

import ContextMenu from '@app/component/presentational/ContextMenu';
import { withContext } from '@app/component/context/context';

const closeContextMenu = () => {
  const { contextMenu } = store.getState();

  if (contextMenu === null) {
    return;
  }

  store.dispatch({
    type: CONTEXT_MENU_OFF_REQUEST,
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

module.exports = withRouter(withContext('contextMenu', 'user', 'song')(ContextMenuContainer));
