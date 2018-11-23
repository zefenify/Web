import React, { useState, useEffect, useContext } from 'react';
import isEqual from 'react-fast-compare';

import { BASE } from '@app/config/api';
import { PLAY_REQUEST, PLAY_PAUSE_REQUEST } from '@app/redux/constant/wolfCola';
import track from '@app/util/track';
import api, { error } from '@app/util/api';
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

    api(`${BASE}featured`, user, (cancel) => {
      requestCancel = cancel;
    }).then(({ data, included }) => {
      store.dispatch(loading(false));

      setState(Object.assign(state, {
        featured: data.map(featured => Object.assign({}, featured, {
          playlist_cover: included.s3[featured.playlist_cover],
        })),
      }));

      const { queueInitial } = store.getState();
      const queueInitialTrackId = queueInitial.map(queueTrack => queueTrack.track_id);
      let featuredPlayingId = '';

      state.featured.forEach((featured) => {
        // NOTE:
        // not using `trackSameList` because we're going to be comparing `track_id` of each feature playlist...
        if (isEqual(featured.playlist_track, queueInitialTrackId) === true) {
          featuredPlayingId = featured.playlist_id;
        }
      });

      setState(Object.assign(state, {
        featuredPlayingId,
      }));
    }, error(store));

    return () => {
      store.dispatch(loading(false));
      requestCancel();
    };
  }, []);

  const featuredPlay = (featuredId) => {
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
      const tracks = track(playlistTrack.playlist_track, included);

      setState(Object.assign(state, {
        featuredPlayingId: featuredId,
      }));

      // playing...
      store.dispatch({
        type: PLAY_REQUEST,
        payload: {
          play: tracks[0],
          queue: tracks,
          queueInitial: tracks,
        },
      });

      store.dispatch(urlCurrentPlaying(`/playlist/${featuredId}`));
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
