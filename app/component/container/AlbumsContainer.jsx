import React, { useState, useEffect, useContext } from 'react';

import { CONTEXT_MENU_ON_REQUEST, CONTEXT_TRACK, CONTEXT_ALBUM } from '@app/redux/constant/contextMenu';
import { PLAY_REQUEST, PLAY_PAUSE_REQUEST } from '@app/redux/constant/wolfCola';
import store from '@app/redux/store';
import { urlCurrentPlaying } from '@app/redux/action/urlCurrentPlaying';
import Albums from '@app/component/presentational/Albums';
import albumBuild from '@app/redux/selector/albumBuild';
import { Context } from '@app/component/context/context';


const AlbumsContainer = ({ match }) => {
  const {
    user,
    song,
    playing,
    current,
    queueInitial,
  } = useContext(Context);
  const [state, setState] = useState(albumBuild({
    song,
    user,
    queueInitial,
    match,
  }));

  useEffect(() => {
    setState(Object.assign(state, albumBuild({
      song,
      user,
      queueInitial,
      match,
    })));
  }, [song, user, queueInitial, match]);

  const albumPlayPause = (albumId = 'ZEFENIFY') => {
    // `albumPlayingId` will only be set in album list view
    // ergo when this condition is met, we already have a playing album state
    if (albumId === state.albumPlayingId) {
      store.dispatch({
        type: PLAY_PAUSE_REQUEST,
      });

      return;
    }

    // we in album view and *this* album is being toggled via top play / pause
    if (albumId === match.params.id && current !== null && state.albumPlaying === true) {
      store.dispatch({
        type: PLAY_PAUSE_REQUEST,
      });

      return;
    }

    const albumIndex = state.album.findIndex(album => album.album_id === albumId);

    if (albumIndex === -1) {
      return;
    }

    store.dispatch({
      type: PLAY_REQUEST,
      payload: {
        play: state.album[albumIndex].relationships.track[0],
        queue: state.album[albumIndex].relationships.track,
        queueInitial: state.album[albumIndex].relationships.track,
      },
    });

    setState(Object.assign(state, {
      albumPlayingId: albumId,
    }));

    store.dispatch(urlCurrentPlaying(`${match.url}/${albumId}`));
  };

  const trackPlayPause = (trackId = 'ZEFENIFY') => {
    if (current !== null && current.track_id === trackId) {
      store.dispatch({
        type: PLAY_PAUSE_REQUEST,
      });

      return;
    }

    const trackIdIndex = state.album[0].relationships.track.findIndex(track => track.track_id === trackId);

    if (trackIdIndex === -1) {
      return;
    }

    store.dispatch({
      type: PLAY_REQUEST,
      payload: {
        play: state.album[0].relationships.track[trackIdIndex],
        queue: state.album[0].relationships.track,
        queueInitial: state.album[0].relationships.track,
      },
    });

    setState(Object.assign(state, {
      albumPlaying: true,
    }));

    store.dispatch(urlCurrentPlaying(match.url));
  };

  const contextMenuAlbum = () => {
    store.dispatch({
      type: CONTEXT_MENU_ON_REQUEST,
      payload: {
        type: CONTEXT_ALBUM,
        payload: state.album[0],
      },
    });
  };

  const contextMenuTrack = (trackId = 'ZEFENIFY') => {
    const trackIndex = state.album[0].relationships.track.findIndex(track => track.track_id === trackId);

    if (trackIndex === -1) {
      return;
    }

    store.dispatch({
      type: CONTEXT_MENU_ON_REQUEST,
      payload: {
        type: CONTEXT_TRACK,
        payload: state.album[0].relationships.track[trackIndex],
      },
    });
  };

  return (
    <Albums
      user={user}
      playing={playing}
      current={current}
      albumPlayPause={albumPlayPause}
      trackPlayPause={trackPlayPause}
      contextMenuAlbum={contextMenuAlbum}
      contextMenuTrack={contextMenuTrack}
      albumId={match.params.id}
      {...state}
    />
  );
};


export default AlbumsContainer;
