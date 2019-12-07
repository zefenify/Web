import React, { useState, useContext } from 'react';
import { string, shape } from 'prop-types';

import { PLAY_REQUEST, PLAY_PAUSE_REQUEST } from '@app/redux/constant/wolfCola';
import { CONTEXT_MENU_ON_REQUEST, CONTEXT_TRACK, CONTEXT_ALBUM } from '@app/redux/constant/contextMenu';
import trackListSame from '@app/util/trackListSame';
import time from '@app/util/time';
import { gql, error } from '@app/util/api';
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

    gql(user, `query Album($id: String!) {
      album(id: $id) {
        id
        name
        artist {
          id
          name
        }
        cover {
          name
        }
        year
        relationships {
          track {
            id
            name
            featuring {
              id
              name
            }
            album {
              id
              name
              artist {
                id
                name
              }
              cover {
                name
              }
              year
            }
            track {
              name
              meta {
                duration
              }
            }
          }
        }
      }
    }`, { id: match.params.id }, (cancel) => {
      requestCancel = cancel;
    }).then(({ data: { album } }) => {
      store.dispatch(loading(false));

      setState(previousState => ({
        ...previousState,
        album,
        duration: time(album.relationships.track.reduce((totalDuration, _track) => totalDuration + _track.track.meta.duration, 0), true),
        albumPlaying: trackListSame(album.relationships.track, queueInitial),
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

      setState(previousState => ({
        ...previousState,
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
    if (current !== null && current.id === trackId) {
      store.dispatch({
        type: PLAY_PAUSE_REQUEST,
      });

      return;
    }

    const trackIdIndex = state.album.relationships.track.findIndex(_track => _track.id === trackId);

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

    setState(previousState => ({
      ...previousState,
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
    const trackIndex = state.album.relationships.track.findIndex(_track => _track.id === trackId);

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
      albumId={state.album.id}
      title={state.album.name}
      cover={state.album.cover}
      year={state.album.year}
      artist={state.album.artist}
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
