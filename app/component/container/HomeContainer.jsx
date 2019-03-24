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

      const featured = data.map(featuredPlaylist => ({
        ...featuredPlaylist,
        playlist_cover: included.s3[featuredPlaylist.playlist_cover],
      }));
      const { queueInitial } = store.getState();
      const queueInitialTrackId = queueInitial.map(queueTrack => queueTrack.track_id);
      let featuredPlayingId = '';
      featured.forEach((featuredPlaylist) => {
        // NOTE:
        // not using `trackSameList` because we're going to be comparing `track_id`
        // of each feature playlist...
        if (isEqual(featuredPlaylist.playlist_track, queueInitialTrackId) === true) {
          featuredPlayingId = featuredPlaylist.playlist_id;
        }
      });

      setState(previousState => ({
        ...previousState,
        featured,
        featuredPlayingId,
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
