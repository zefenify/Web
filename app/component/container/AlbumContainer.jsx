import React, { useState, useContext } from 'react';
import { string, shape } from 'prop-types';

import { BASE } from '@app/config/api';
import { PLAY_REQUEST, PLAY_PAUSE_REQUEST } from '@app/redux/constant/wolfCola';
import { CONTEXT_MENU_ON_REQUEST, CONTEXT_TRACK, CONTEXT_ALBUM } from '@app/redux/constant/contextMenu';
import trackListSame from '@app/util/trackListSame';
import { human } from '@app/util/time';
import api, { error } from '@app/util/api';
import track from '@app/util/track';
import store from '@app/redux/store';
import { loading } from '@app/redux/action/loading';
import { urlCurrentPlaying } from '@app/redux/action/urlCurrentPlaying';
import Album from '@app/component/presentational/Album';
import { Context } from '@app/component/context/context';
import useEffectDeep from '@app/hook/useEffectDeep';


let requestCancel = () => {};

const AlbumContainer = ({ match }) => {
  const {
    current,
    playing,
    user,
    queueInitial,
  } = useContext(Context);
  const [state, setState] = useState({
    album: null,
    duration: {
      hour: 0,
      minute: 0,
      second: 0,
    },
    albumPlaying: false,
    albumId: match.params.id,
  });

  useEffectDeep(() => {
    store.dispatch(loading(true));

    api(`${BASE}album/${match.params.id}`, user, (cancel) => {
      requestCancel = cancel;
    }).then(({ data, included }) => {
      store.dispatch(loading(false));

      const paramTrackId = match.params.trackId;
      let albumTrackList = [];

      if (paramTrackId === undefined) {
        albumTrackList = data.relationships.track.map(trackId => included.track[trackId]);
      } else {
        albumTrackList = data.relationships.track
          .filter(trackId => paramTrackId === trackId)
          .map(trackId => included.track[trackId]);
      }

      const trackList = track(albumTrackList, included);

      setState(Object.assign(state, {
        album: {
          album_id: data.album_id,
          album_name: data.album_name,
          album_artist: data.album_artist.map(artistId => included.artist[artistId]),
          album_cover: included.s3[data.album_cover],
          album_year: data.album_year,
          relationships: {
            track: trackList,
          },
        },
        duration: human(trackList.reduce((totalDuration, _track) => totalDuration + _track.track_track.s3_meta.duration, 0), true),
      }));

      if (queueInitial.length === 0 || state.album.relationships.track.length === 0) {
        setState(Object.assign(state, {
          albumPlaying: false,
        }));

        return;
      }

      setState(Object.assign(state, {
        albumPlaying: trackListSame(state.album.relationships.track, queueInitial),
      }));
    }, error(store));

    return () => {
      store.dispatch(loading(false));
      requestCancel();
    };
  }, [match.params.id]);

  const albumPlayPause = () => {
    if (state.album === null) {
      return;
    }

    // booting playlist
    if (current === null || state.albumPlaying === false) {
      store.dispatch({
        type: PLAY_REQUEST,
        payload: {
          play: state.album.relationships.track[0],
          queue: state.album.relationships.track,
          queueInitial: state.album.relationships.track,
        },
      });

      setState(Object.assign(state, {
        albumPlaying: true,
      }));

      store.dispatch(urlCurrentPlaying(match.url));
      // resuming / pausing playlist i.e. state.albumPlaying === true
    } else if (current !== null) {
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

    const trackIdIndex = state.album.relationships.track.findIndex(_track => _track.track_id === trackId);

    if (trackIdIndex === -1) {
      return;
    }

    store.dispatch({
      type: PLAY_REQUEST,
      payload: {
        play: state.album.relationships.track[trackIdIndex],
        queue: state.album.relationships.track,
        queueInitial: state.album.relationships.track,
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
        payload: state.album,
      },
    });
  };

  const contextMenuTrack = (trackId = 'ZEFENIFY') => {
    const trackIndex = state.album.relationships.track.findIndex(_track => _track.track_id === trackId);

    if (trackIndex === -1) {
      return;
    }

    store.dispatch({
      type: CONTEXT_MENU_ON_REQUEST,
      payload: {
        type: CONTEXT_TRACK,
        payload: state.album.relationships.track[trackIndex],
      },
    });
  };

  if (state.album === null) {
    return null;
  }

  return (
    <Album
      showArtist={state.albumId !== undefined} // By <ArtistList> rendered in only single album view
      current={current}
      playing={playing}
      albumPlaying={state.albumPlaying}
      duration={state.duration}
      albumId={state.album.album_id}
      title={state.album.album_name}
      cover={state.album.album_cover}
      artist={state.album.album_artist}
      tracks={state.album.relationships.track}
      albumPlayPause={albumPlayPause}
      trackPlayPause={trackPlayPause}
      contextMenuAlbum={contextMenuAlbum}
      contextMenuTrack={contextMenuTrack}
    />
  );
};

AlbumContainer.propTypes = {
  match: shape({
    url: string,
    params: shape({
      id: string,
    }),
  }).isRequired,
};


export default AlbumContainer;
