import React, { useState, useContext } from 'react';
import { string, shape } from 'prop-types';

import { PLAY_REQUEST, PLAY_PAUSE_REQUEST } from '@app/redux/constant/wolfCola';
import { CONTEXT_MENU_ON_REQUEST, CONTEXT_TRACK, CONTEXT_PLAYLIST } from '@app/redux/constant/contextMenu';
import trackListSame from '@app/util/trackListSame';
import time from '@app/util/time';
import { gql, error } from '@app/util/api';
import store from '@app/redux/store';
import { urlCurrentPlaying } from '@app/redux/action/urlCurrentPlaying';
import { loading } from '@app/redux/action/loading';
import PlaylistTrack from '@app/component/presentational/PlaylistTrack';
import { Context } from '@app/component/context/context';
import useEffectDeep from '@app/hook/useEffectDeep';


let requestCancel = () => {};

const PlaylistContainer = ({ match }) => {
  const {
    current,
    playing,
    user,
    queueInitial,
  } = useContext(Context);
  const [state, setState] = useState({
    featured: null,
    duration: {
      hour: 0,
      minute: 0,
      second: 0,
    },
    playingFeatured: false,
    playlistId: match.params.id || '',
  });

  useEffectDeep(() => {
    store.dispatch(loading(true));

    gql(user, `query Playlist($id: String!) {
      playlist(id: $id) {
        id
        name
        description
        cover {
          name
        }
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
    }`, { id: match.params.id }, (cancel) => {
      requestCancel = cancel;
    }).then(({ data: { playlist } }) => {
      store.dispatch(loading(false));

      const duration = time(playlist.track.reduce((totalDuration, _track) => totalDuration + _track.track.meta.duration, 0), true);

      setState(previousState => ({
        ...previousState,
        featured: playlist,
        duration,
        playingFeatured: trackListSame(playlist.track, queueInitial),
      }));
    }, error(store));

    return () => {
      requestCancel();
    };
  }, [user, match.params.id]);

  const tracksPlayPause = () => {
    if (state.featured === null) {
      return;
    }

    // booting playlist
    if (current === null || state.playingFeatured === false) {
      store.dispatch({
        type: PLAY_REQUEST,
        payload: {
          play: state.featured.track[0],
          queue: state.featured.track,
          queueInitial: state.featured.track,
        },
      });

      setState(previousState => ({
        ...previousState,
        playingFeatured: true,
      }));

      store.dispatch(urlCurrentPlaying(match.url));
      // resuming / pausing playlist
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

    const trackIdIndex = state.featured.track.findIndex(_track => _track.id === trackId);

    if (trackIdIndex === -1) {
      return;
    }

    store.dispatch({
      type: PLAY_REQUEST,
      payload: {
        play: state.featured.track[trackIdIndex],
        queue: state.featured.track,
        queueInitial: state.featured.track,
      },
    });

    setState(previousState => ({
      ...previousState,
      playingFeatured: true,
    }));

    store.dispatch(urlCurrentPlaying(match.url));
  };

  const contextMenuPlaylist = () => {
    store.dispatch({
      type: CONTEXT_MENU_ON_REQUEST,
      payload: {
        type: CONTEXT_PLAYLIST,
        payload: state.featured,
      },
    });
  };

  const contextMenuTrack = (trackId = 'ZEFENIFY') => {
    const trackIndex = state.featured.track.findIndex(_track => _track.id === trackId);

    if (trackIndex === -1) {
      return;
    }

    store.dispatch({
      type: CONTEXT_MENU_ON_REQUEST,
      payload: {
        type: CONTEXT_TRACK,
        payload: state.featured.track[trackIndex],
      },
    });
  };

  if (state.featured === null) {
    return null;
  }

  return (
    <PlaylistTrack
      type={match.params.type}
      current={current}
      playing={playing}
      tracksPlaying={playing && state.playingFeatured}
      duration={state.duration}
      tracksPlayPause={tracksPlayPause}
      trackPlayPause={trackPlayPause}
      title={state.featured.name}
      description={state.featured.description}
      cover={state.featured.cover}
      tracks={state.featured.track}
      contextMenuPlaylist={contextMenuPlaylist}
      contextMenuTrack={contextMenuTrack}
    />
  );
};


PlaylistContainer.propTypes = {
  match: shape({
    url: string,
    params: shape({
      id: string,
    }),
  }).isRequired,
};


export default PlaylistContainer;
