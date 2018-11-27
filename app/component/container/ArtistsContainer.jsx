import React, { useState, useEffect, useContext } from 'react';
import flatten from 'lodash/flatten';

import { PLAY_REQUEST, PLAY_PAUSE_REQUEST } from '@app/redux/constant/wolfCola';
import {
  CONTEXT_MENU_ON_REQUEST,
  CONTEXT_TRACK,
  CONTEXT_ALBUM,
  CONTEXT_ARTIST,
} from '@app/redux/constant/contextMenu';
import store from '@app/redux/store';
import artistBuild from '@app/redux/selector/artistBuild';
import { urlCurrentPlaying } from '@app/redux/action/urlCurrentPlaying';
import { Context } from '@app/component/context/context';
import Artists from '@app/component/presentational/Artists';


const ArtistsContainer = ({ match }) => {
  const {
    song,
    user,
    current,
    playing,
    queueInitial,
  } = useContext(Context);
  const [state, setState] = useState({
    artist: [],
    artistPlayingId: '',
    albumPlayingId: '',
    duration: {
      hour: 0,
      minute: 0,
      second: 0,
    },
  });

  useEffect(() => {
    setState(Object.assign(state, artistBuild({
      song,
      user,
      current,
      playing,
      queueInitial,
      match,
    })));

    // TODO:
    // remove selector logic as it's no longer needed
  }, [song, user, current, playing, queueInitial, match]);

  /**
   * given an artist id, it'll build the payload for `PLAY_REQUEST`
   *
   * @param  {String} artistId
   */
  const artistPlayPause = (artistId = 'ZEFENIFY') => {
    if (state.artist.length === 0) {
      return;
    }

    const artistIndex = state.artist.findIndex(artist => artist.artist_id === artistId);

    if (artistIndex === -1) {
      return;
    }

    const tracksFlatten = flatten(state.artist[artistIndex].relationships.album.map(album => album.relationships.track));

    if (current === null || state.artistPlayingId !== artistId) {
      store.dispatch({
        type: PLAY_REQUEST,
        payload: {
          play: tracksFlatten[0],
          queue: tracksFlatten,
          queueInitial: tracksFlatten,
        },
      });

      store.dispatch(urlCurrentPlaying(match.params.id === undefined ? `${match.url}/${artistId}` : match.url));

      return;
    }

    store.dispatch({
      type: PLAY_PAUSE_REQUEST,
    });

    setState(Object.assign(state, {
      artistPlayingId: artistId,
      albumPlayingId: '',
    }));
  };

  const albumPlayPause = (albumId = 'ZEFENIFY') => {
    if (current === null || state.albumPlayingId !== albumId) {
      const artistIndex = state.artist.findIndex(artist => artist.artist_id === match.params.id);

      if (artistIndex === -1) {
        return;
      }

      const albumIndex = state.artist[artistIndex].relationships.album.findIndex(album => album.album_id === albumId);

      if (albumIndex === -1) {
        return;
      }

      store.dispatch({
        type: PLAY_REQUEST,
        payload: {
          play: state.artist[artistIndex].relationships.album[albumIndex].relationships.track[0],
          queue: state.artist[artistIndex].relationships.album[albumIndex].relationships.track,
          queueInitial: state.artist[artistIndex].relationships.album[albumIndex].relationships.track,
        },
      });

      store.dispatch(urlCurrentPlaying(match.url));

      return;
    }

    if (state.albumPlayingId === albumId) {
      store.dispatch({
        type: PLAY_PAUSE_REQUEST,
      });
    }
  };

  const trackPlayPause = (trackId = 'ZEFENIFY') => {
    if (current !== null && current.track_id === trackId) {
      store.dispatch({
        type: PLAY_PAUSE_REQUEST,
      });

      return;
    }

    let track = null;
    const trackListFlatten = [];

    state.artist.forEach((artist) => {
      artist.relationships.album.forEach((album) => {
        trackListFlatten.push(...album.relationships.track);

        album.relationships.track.forEach((_track) => {
          if (_track.track_id === trackId) {
            track = _track;
          }
        });
      });
    });

    if (track === null) {
      return;
    }

    store.dispatch({
      type: PLAY_REQUEST,
      payload: {
        play: track,
        queue: trackListFlatten,
        queueInitial: trackListFlatten,
      },
    });

    store.dispatch(urlCurrentPlaying(match.url));
  };

  const contextMenuArtist = () => {
    const artistIndex = state.artist.findIndex(artist => artist.artist_id === match.params.id);

    if (artistIndex === -1) {
      return;
    }

    store.dispatch({
      type: CONTEXT_MENU_ON_REQUEST,
      payload: {
        type: CONTEXT_ARTIST,
        payload: state.artist[artistIndex],
      },
    });
  };

  const contextMenuAlbum = (albumId = 'ZEFENIFY') => {
    const artistIndex = state.artist.findIndex(artist => artist.artist_id === match.params.id);

    if (artistIndex === -1) {
      return;
    }

    const albumIndex = state.artist[artistIndex].relationships.album.findIndex(album => album.album_id === albumId);

    if (albumIndex === -1) {
      return;
    }

    store.dispatch({
      type: CONTEXT_MENU_ON_REQUEST,
      payload: {
        type: CONTEXT_ALBUM,
        payload: state.artist[artistIndex].relationships.album[albumIndex],
      },
    });
  };

  const contextMenuTrack = (trackId = 'ZEFENIFY') => {
    let track = null;

    state.artist.forEach((artist) => {
      artist.relationships.album.forEach((album) => {
        album.relationships.track.forEach((_track) => {
          if (_track.track_id === trackId) {
            track = _track;
          }
        });
      });
    });

    if (track === null) {
      return;
    }

    store.dispatch({
      type: CONTEXT_MENU_ON_REQUEST,
      payload: {
        type: CONTEXT_TRACK,
        payload: track,
      },
    });
  };

  if (state.artist === null) {
    return null;
  }

  return (
    <Artists
      artistPlayPause={artistPlayPause}
      albumPlayPause={albumPlayPause}
      trackPlayPause={trackPlayPause}
      contextMenuArtist={contextMenuArtist}
      contextMenuAlbum={contextMenuAlbum}
      contextMenuTrack={contextMenuTrack}
      current={current}
      playing={playing}
      user={user}
      artistId={match.params.id}
      {...state}
    />
  );
};


export default ArtistsContainer;
