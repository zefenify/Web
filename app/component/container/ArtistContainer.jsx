import React, { useState, useEffect, useContext } from 'react';
import { string, shape } from 'prop-types';
import flatten from 'lodash/flatten';
import cloneDeep from 'lodash/cloneDeep';
import sortBy from 'lodash/sortBy';
import reverse from 'lodash/reverse';
import uniqBy from 'lodash/uniqBy';

import { BASE } from '@app/config/api';
import { PLAY_REQUEST, PLAY_PAUSE_REQUEST } from '@app/redux/constant/wolfCola';
import {
  CONTEXT_MENU_ON_REQUEST,
  CONTEXT_TRACK,
  CONTEXT_ALBUM,
  CONTEXT_ARTIST,
} from '@app/redux/constant/contextMenu';
import trackListSame from '@app/util/trackListSame';
import api, { error } from '@app/util/api';
import track from '@app/util/track';
import { human } from '@app/util/time';
import { loading } from '@app/redux/action/loading';
import { urlCurrentPlaying } from '@app/redux/action/urlCurrentPlaying';
import store from '@app/redux/store';
import Artist from '@app/component/presentational/Artist';
import { Context } from '@app/component/context/context';


let requestCancel = null;

const ArtistContainer = ({ match }) => {
  const {
    current,
    playing,
    user,
    queueInitial,
  } = useContext(Context);
  const [state, setState] = useState({
    artist: null,
    trackCount: 0,
    trackFlatten: [], // all tracks in artist album flattened
    albumPlayingId: '', // controls queue set on album play
    aristPlaying: false, // checks the current queueInitial is filled with artists track [flat]
  });

  useEffect(() => {
    store.dispatch(loading(true));

    api(`${BASE}artist/${match.params.id}`, user, (cancel) => {
      requestCancel = cancel;
    }).then(({ data, included }) => {
      store.dispatch(loading(false));

      // sorting by `album.album_year` [ascending order] -> reversing
      const albumList = reverse(sortBy(data.relationships.album.map((albumId) => {
        const album = cloneDeep(included.album[albumId]);
        album.album_artist = album.album_artist.map(artistId => included.artist[artistId]);
        album.relationships.track = track(album.relationships.track.map(trackId => included.track[trackId]), included);
        album.album_cover = included.s3[album.album_cover];
        album.duration = human(album.relationships.track.reduce((totalDuration, _track) => totalDuration + _track.track_track.s3_meta.duration, 0), true);

        return album;
      }), album => album.album_year));

      const trackList = uniqBy(track(data.relationships.track.map(trackId => included.track[trackId]), included), _track => _track.track_album.album_id);
      const trackFlatten = flatten(albumList.map(album => album.relationships.track));

      let albumPlayingId = '';
      albumList.forEach((album) => {
        if (trackListSame(queueInitial, album.relationships.track) === true) {
          albumPlayingId = album.album_id;
        }
      });

      setState(Object.assign(state, {
        artist: Object.assign({}, data, {
          artist_cover: included.s3[data.artist_cover],
          relationships: {
            album: albumList,
            track: trackList,
          },
        }),
        trackFlatten,
        trackCount: trackFlatten.length,
        aristPlaying: trackListSame(queueInitial, trackFlatten),
        albumPlayingId,
      }));
    }, error(store));

    return () => {
      store.dispatch(loading(false));
      requestCancel();
    };
  }, [user, match.params.id]);

  const artistPlayPause = () => {
    if (state.artist === null || state.trackFlatten.length === 0) {
      return;
    }

    // booting playlist...
    if (current === null || state.aristPlaying === false) {
      store.dispatch({
        type: PLAY_REQUEST,
        payload: {
          play: state.trackFlatten[0],
          queue: state.trackFlatten,
          queueInitial: state.trackFlatten,
        },
      });

      setState(Object.assign(state, {
        albumPlayingId: '',
        aristPlaying: true,
      }));

      store.dispatch(urlCurrentPlaying(match.url));
      // resuming / pausing playlist i.e. state.aristPlaying === true
    } else if (current !== null) {
      store.dispatch({
        type: PLAY_PAUSE_REQUEST,
      });
    }
  };

  const albumPlayPause = (albumId = 'ZEFENIFY') => {
    if (current === null || state.albumPlayingId !== albumId) {
      const albumIndex = state.artist.relationships.album.findIndex(album => album.album_id === albumId);

      if (albumIndex === -1) {
        return;
      }

      store.dispatch({
        type: PLAY_REQUEST,
        payload: {
          play: state.artist.relationships.album[albumIndex].relationships.track[0],
          queue: state.artist.relationships.album[albumIndex].relationships.track,
          queueInitial: state.artist.relationships.album[albumIndex].relationships.track,
        },
      });

      setState(Object.assign(state, {
        albumPlayingId: albumId,
        aristPlaying: trackListSame(state.artist.relationships.album[albumIndex].relationships.track, state.trackFlatten),
      }));

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

    const trackIndex = state.trackFlatten.findIndex(_track => _track.track_id === trackId);

    store.dispatch({
      type: PLAY_REQUEST,
      payload: {
        play: state.trackFlatten[trackIndex],
        queue: state.trackFlatten,
        queueInitial: state.trackFlatten,
      },
    });

    setState(Object.assign(state, {
      albumPlayingId: '',
      aristPlaying: true,
    }));

    store.dispatch(urlCurrentPlaying(match.url));
  };

  const contextMenuArtist = () => {
    store.dispatch({
      type: CONTEXT_MENU_ON_REQUEST,
      payload: {
        type: CONTEXT_ARTIST,
        payload: state.artist,
      },
    });
  };

  const contextMenuAlbum = (albumId = 'ZEFENIFY') => {
    const albumIndex = state.artist.relationships.album.findIndex(album => album.album_id === albumId);

    if (albumIndex === -1) {
      return;
    }

    store.dispatch({
      type: CONTEXT_MENU_ON_REQUEST,
      payload: {
        type: CONTEXT_ALBUM,
        payload: state.artist.relationships.album[albumIndex],
      },
    });
  };

  const contextMenuTrack = (trackId = 'ZEFENIFY') => {
    const trackIndex = state.trackFlatten.findIndex(_track => _track.track_id === trackId);

    if (trackIndex === -1) {
      return;
    }

    store.dispatch({
      type: CONTEXT_MENU_ON_REQUEST,
      payload: {
        type: CONTEXT_TRACK,
        payload: state.trackFlatten[trackIndex],
      },
    });
  };

  if (state.artist === null) {
    return null;
  }

  return (
    <Artist
      artist={state.artist}
      current={current}
      playing={playing}
      trackCount={state.trackCount}
      albumPlayingId={state.albumPlayingId}
      aristPlaying={state.aristPlaying}
      artistPlayPause={artistPlayPause}
      trackPlayPause={trackPlayPause}
      albumPlayPause={albumPlayPause}
      contextMenuArtist={contextMenuArtist}
      contextMenuAlbum={contextMenuAlbum}
      contextMenuTrack={contextMenuTrack}
    />
  );
};

ArtistContainer.propTypes = {
  match: shape({
    url: string,
    params: shape({
      id: string,
    }),
  }).isRequired,
};


export default ArtistContainer;
