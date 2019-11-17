import React, { useState, useEffect, useContext } from 'react';
import isEqual from 'react-fast-compare';

import { BASE } from '@app/config/api';
import { PLAY_REQUEST, PLAY_PAUSE_REQUEST } from '@app/redux/constant/wolfCola';
import track from '@app/util/track';
import api, { gql, error } from '@app/util/api';
import store from '@app/redux/store';
import { loading } from '@app/redux/action/loading';
import { urlCurrentPlaying } from '@app/redux/action/urlCurrentPlaying';
import { Context } from '@app/component/context/context';
import Home from '@app/component/presentational/Home';


let requestCancel = () => {};

const HomeContainer = () => {
  const { user, playing } = useContext(Context);
  const [state, setState] = useState({
    featured: [],
    featuredPlayingId: '',
  });

  useEffect(() => {
    store.dispatch(loading(true));

    gql(user, `query Featured {
      featured {
        id
        name
        description
        cover {
          name
        }
        track {
          id
        }
      }
    }`, {}, (cancel) => {
      requestCancel = cancel;
    }).then(({ data: { featured } }) => {
      store.dispatch(loading(false));

      const { queueInitial } = store.getState();
      const queueInitialTrackId = queueInitial.map(queueTrack => queueTrack.track_id);
      const featuredPlaying = featured.find(featuredPlaylist => isEqual(featuredPlaylist.track, queueInitialTrackId));

      setState(previousState => ({
        ...previousState,
        featured,
        featuredPlayingId: featuredPlaying === undefined ? '' : featuredPlaying.id,
      }));
    }, error(store));

    return () => {
      store.dispatch(loading(false));
      requestCancel();
    };
  }, []);

  const featuredPlay = (featuredId = 'ZEFENIFY') => {
    // trigger _stop_...
    if (state.featuredPlayingId === featuredId) {
      // pausing whatever was playing...
      store.dispatch({
        type: PLAY_PAUSE_REQUEST,
      });

      return;
    }

    api(`${BASE}playlist/${featuredId}`, user, (cancel) => {
      requestCancel = cancel;
    }).then(({ data, included }) => {
      // mapping track...
      const playlistTrack = Object.assign({}, data, {
        playlist_track: data.playlist_track.map(trackId => included.track[trackId]),
      });
      const trackList = track(playlistTrack.playlist_track, included);

      setState(previousState => ({
        ...previousState,
        featuredPlayingId: featuredId,
      }));

      // playing...
      store.dispatch({
        type: PLAY_REQUEST,
        payload: {
          play: trackList[0],
          queue: trackList,
          queueInitial: trackList,
        },
      });

      store.dispatch(urlCurrentPlaying(`/featured/${featuredId}`));
    }, error(store));
  };

  return (
    <Home
      playing={playing}
      featured={state.featured}
      featuredPlayingId={state.featuredPlayingId}
      featuredPlay={featuredPlay}
    />
  );
};


export default HomeContainer;
