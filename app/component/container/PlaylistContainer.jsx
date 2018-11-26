import React, { useState, useEffect, useContext } from 'react';
import { string, shape } from 'prop-types';

import { BASE } from '@app/config/api';
import { PLAY_REQUEST, PLAY_PAUSE_REQUEST } from '@app/redux/constant/wolfCola';
import { CONTEXT_MENU_ON_REQUEST, CONTEXT_TRACK, CONTEXT_PLAYLIST } from '@app/redux/constant/contextMenu';
import trackListSame from '@app/util/trackListSame';
import { human } from '@app/util/time';
import api, { error } from '@app/util/api';
import track from '@app/util/track';
import store from '@app/redux/store';
import { urlCurrentPlaying } from '@app/redux/action/urlCurrentPlaying';
import { loading } from '@app/redux/action/loading';
import HeaderTracks from '@app/component/presentational/HeaderTracks';
import { Context } from '@app/component/context/context';


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

  useEffect(() => {
    store.dispatch(loading(true));

    api(`${BASE}playlist/${match.params.id}`, user, (cancel) => {
      requestCancel = cancel;
    }).then(({ data, included }) => {
      store.dispatch(loading(false));
      // mapping track...
      const playlistTrack = Object.assign({}, data, {
        playlist_track: data.playlist_track.map(trackId => included.track[trackId]),
      });

      const trackList = track(playlistTrack.playlist_track, included);

      setState(Object.assign(state, {
        featured: Object.assign({}, data, {
          playlist_cover: included.s3[data.playlist_cover],
          playlist_track: trackList,
        }),
        duration: human(trackList.reduce((totalDuration, _track) => totalDuration + _track.track_track.s3_meta.duration, 0), true),
      }));

      if (queueInitial.length === 0 || state.featured.playlist_track.length === 0) {
        setState(Object.assign(state, {
          playingFeatured: false,
        }));

        return;
      }

      setState(Object.assign(state, {
        playingFeatured: trackListSame(state.featured.playlist_track, queueInitial),
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
          play: state.featured.playlist_track[0],
          queue: state.featured.playlist_track,
          queueInitial: state.featured.playlist_track,
        },
      });

      setState(Object.assign(state, {
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

  const trackPlayPause = (trackId) => {
    if (current !== null && current.track_id === trackId) {
      store.dispatch({
        type: PLAY_PAUSE_REQUEST,
      });

      return;
    }

    const trackIdIndex = state.featured.playlist_track.findIndex(_track => _track.track_id === trackId);

    if (trackIdIndex === -1) {
      return;
    }

    store.dispatch({
      type: PLAY_REQUEST,
      payload: {
        play: state.featured.playlist_track[trackIdIndex],
        queue: state.featured.playlist_track,
        queueInitial: state.featured.playlist_track,
      },
    });

    setState(Object.assign(state, {
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
    const trackIndex = state.featured.playlist_track.findIndex(_track => _track.track_id === trackId);

    if (trackIndex === -1) {
      return;
    }

    store.dispatch({
      type: CONTEXT_MENU_ON_REQUEST,
      payload: {
        type: CONTEXT_TRACK,
        payload: state.featured.playlist_track[trackIndex],
      },
    });
  };

  if (state.featured === null) {
    return null;
  }

  return (
    <HeaderTracks
      type={match.params.type}
      current={current}
      playing={playing}
      tracksPlaying={playing && state.playingFeatured}
      duration={state.duration}
      tracksPlayPause={tracksPlayPause}
      trackPlayPause={trackPlayPause}
      title={state.featured.playlist_name}
      description={state.featured.playlist_description}
      cover={state.featured.playlist_cover}
      tracks={state.featured.playlist_track}
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
