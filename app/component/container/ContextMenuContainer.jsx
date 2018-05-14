import React from 'react';
import { withRouter } from 'react-router';

import store from '@app/redux/store';
import { CONTEXT_MENU_OFF_REQUEST } from '@app/redux/constant/contextMenu';
import { SONG_SAVE_REQUEST, SONG_REMOVE_REQUEST } from '@app/redux/constant/song';
import { queueNextAdd, queueNextRemove } from '@app/redux/action/queueNext';

import ContextMenu from '@app/component/presentational/ContextMenu';
import { withContext } from '@app/component/context/context';

const contextMenuClose = () => {
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

const _queueNextAdd = (track) => {
  store.dispatch(queueNextAdd(track));
};

const _queueNextRemove = (queueNextIndex) => {
  store.dispatch(queueNextRemove(queueNextIndex));
};

const ContextMenuContainer = props => (<ContextMenu
  {...props}
  contextMenuClose={contextMenuClose}
  songSave={songSave}
  songRemove={songRemove}
  queueNextAdd={_queueNextAdd}
  queueNextRemove={_queueNextRemove}
/>);

module.exports = withRouter(withContext('contextMenu', 'user', 'song', 'queueNext')(ContextMenuContainer));
