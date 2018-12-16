import React, { useState, useEffect, useContext } from 'react';
import { string, shape } from 'prop-types';

import { BASE } from '@app/config/api';
import { CONTEXT_MENU_ON_REQUEST, CONTEXT_TRACK } from '@app/redux/constant/contextMenu';
import { PLAY_REQUEST, PLAY_PAUSE_REQUEST } from '@app/redux/constant/wolfCola';
import trackListSame from '@app/util/trackListSame';
import track from '@app/util/track';
import { human } from '@app/util/time';
import api, { error } from '@app/util/api';
import store from '@app/redux/store';
import { loading } from '@app/redux/action/loading';
import { urlCurrentPlaying } from '@app/redux/action/urlCurrentPlaying';
import Trending from '@app/component/presentational/Trending';
import { Context } from '@app/component/context/context';


let requestCancel = () => {};

const TrendingContainer = ({ match }) => {
  const {
    user,
    current,
    playing,
    queueInitial,
  } = useContext(Context);
  const [state, setState] = useState({
    trending: null,
    duration: {
      hour: 0,
      minute: 0,
      second: 0,
    },
    category: match.params.category || '',
    trendingPlaying: false,
  });

  useEffect(() => {
    setState(Object.assign(state, {
      trending: null,
    }));

    store.dispatch(loading(true));
    api(`${BASE}trending/${match.params.category}`, user, (cancel) => {
      requestCancel = cancel;
    }, match.params.category === 'today')
      .then(({ data, included }) => {
        store.dispatch(loading(false));

        const trending = track(data, included);

        setState(Object.assign(state, {
          trending,
          duration: human(trending.reduce((totalDuration, _track) => totalDuration + _track.track_track.s3_meta.duration, 0), true),
        }));

        if (queueInitial.length === 0 || state.trending.length === 0) {
          setState(Object.assign(state, {
            trendingPlaying: false,
          }));

          return;
        }

        setState(Object.assign(state, {
          trendingPlaying: trackListSame(state.trending, queueInitial),
        }));
      }, error(store));

    return () => {
      store.dispatch(loading(false));
      requestCancel();
    };
  }, [match.params.category]);

  const trendingPlayPause = () => {
    if (state.trending === null || state.trending.length === 0) {
      return;
    }

    // booting playlist...
    if (current === null || state.trendingPlaying === false) {
      store.dispatch({
        type: PLAY_REQUEST,
        payload: {
          play: state.trending[0],
          queue: state.trending,
          queueInitial: state.trending,
        },
      });

      setState(Object.assign(state, {
        trendingPlaying: true,
      }));

      store.dispatch(urlCurrentPlaying(match.url));

      return;
    }

    store.dispatch({
      type: PLAY_PAUSE_REQUEST,
    });
  };

  const trackPlayPause = (trackId = 'ZEFENIFY') => {
    if (current !== null && current.track_id === trackId) {
      store.dispatch({
        type: PLAY_PAUSE_REQUEST,
      });

      return;
    }

    const trackIndex = state.trending.findIndex(_track => _track.track_id === trackId);

    if (trackIndex === -1) {
      return;
    }

    store.dispatch({
      type: PLAY_REQUEST,
      payload: {
        play: state.trending[trackIndex],
        queue: state.trending,
        queueInitial: state.trending,
      },
    });

    setState(Object.assign(state, {
      trendingPlaying: true,
    }));

    store.dispatch(urlCurrentPlaying(match.url));
  };

  const contextMenuTrack = (trackId = 'ZEFENIFY') => {
    if (state.trending === null) {
      return;
    }

    const trackIndex = state.trending.findIndex(_track => _track.track_id === trackId);

    if (trackIndex === -1) {
      return;
    }

    store.dispatch({
      type: CONTEXT_MENU_ON_REQUEST,
      payload: {
        type: CONTEXT_TRACK,
        payload: state.trending[trackIndex],
      },
    });
  };

  return (
    <Trending
      current={current}
      playing={playing}
      category={match.params.category}
      trending={state.trending}
      duration={state.duration}
      trendingPlaying={state.trendingPlaying}
      trendingPlayPause={trendingPlayPause}
      trackPlayPause={trackPlayPause}
      contextMenuTrack={contextMenuTrack}
    />
  );
};

TrendingContainer.propTypes = {
  match: shape({
    url: string,
    params: shape({
      category: string,
    }),
  }).isRequired,
};


export default TrendingContainer;
