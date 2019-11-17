import React, { useState, useContext } from 'react';
import { string, shape } from 'prop-types';
import sortBy from 'lodash/fp/sortBy';
import reverse from 'lodash/fp/reverse';

import { PLAY_REQUEST, PLAY_PAUSE_REQUEST } from '@app/redux/constant/wolfCola';
import {
  CONTEXT_MENU_ON_REQUEST,
  CONTEXT_TRACK,
  CONTEXT_ALBUM,
  CONTEXT_ARTIST,
} from '@app/redux/constant/contextMenu';
import trackListSame from '@app/util/trackListSame';
import { gql, error } from '@app/util/api';
import time from '@app/util/time';
import { loading } from '@app/redux/action/loading';
import { urlCurrentPlaying } from '@app/redux/action/urlCurrentPlaying';
import store from '@app/redux/store';
import Artist from '@app/component/presentational/Artist';
import { Context } from '@app/component/context/context';
import useEffectDeep from '@app/hook/useEffectDeep';


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

  useEffectDeep(() => {
    store.dispatch(loading(true));

    gql(null, `query Artist($id: String!) {
      artist(id: $id) {
        id
        name
        cover {
          name
        }
        relationships {
          album {
            id
            name
            artist {
              id
              name
            }
            year
            cover {
              name
            }
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
                  year
                  cover {
                    name
                  }
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
          track {
            id
            album {
              id
              name
              year
              cover {
                name
              }
            }
          }
        }
      }
    }`, { id: match.params.id }, (cancel) => {
      requestCancel = cancel;
    }).then(({ data: { artist } }) => {
      store.dispatch(loading(false));

      const trackFlatten = artist.relationships.album.flatMap(album => album.relationships.track);
      const playingAlbum = artist.relationships.album.find(album => trackListSame(queueInitial, album.relationships.track) === true);

      setState(previousState => ({
        ...previousState,
        artist: {
          ...artist,
          relationships: {
            ...artist.relationships,
            album: reverse(sortBy(album => album.year)(artist.relationships.album.map(album => ({
              ...album,
              duration: time(album.relationships.track.reduce((totalDuration, _track) => totalDuration + _track.track.meta.duration, 0), true),
            })))),
          },
        },
        trackFlatten,
        trackCount: trackFlatten.length,
        aristPlaying: trackListSame(queueInitial, trackFlatten),
        albumPlayingId: playingAlbum === undefined ? '' : playingAlbum.id,
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

      setState(previousState => ({
        ...previousState,
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
      const albumIndex = state.artist.relationships.album.findIndex(album => album.id === albumId);

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

      setState(previousState => ({
        ...previousState,
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

    const trackIndex = state.trackFlatten.findIndex(_track => _track.id === trackId);

    store.dispatch({
      type: PLAY_REQUEST,
      payload: {
        play: state.trackFlatten[trackIndex],
        queue: state.trackFlatten,
        queueInitial: state.trackFlatten,
      },
    });

    setState(previousState => ({
      ...previousState,
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
    const albumIndex = state.artist.relationships.album.findIndex(album => album.id === albumId);

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
    const trackIndex = state.trackFlatten.findIndex(_track => _track.id === trackId);

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
