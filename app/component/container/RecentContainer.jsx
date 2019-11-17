import React, { useContext } from 'react';
import { shape, string } from 'prop-types';

import { PLAY_REQUEST, PLAY_PAUSE_REQUEST } from '@app/redux/constant/wolfCola';
import { CONTEXT_MENU_ON_REQUEST, CONTEXT_TRACK } from '@app/redux/constant/contextMenu';
import store from '@app/redux/store';
import tracksDuration from '@app/redux/selector/tracksDuration';
import tracksPlaying from '@app/redux/selector/tracksPlaying';
import { urlCurrentPlaying } from '@app/redux/action/urlCurrentPlaying';
import Recent from '@app/component/presentational/Recent';
import { Context } from '@app/component/context/context';


const RecentContainer = ({ match }) => {
  const {
    playing,
    current,
    history,
    queueInitial,
  } = useContext(Context);

  const historyPlayPause = () => {
    if (tracksPlaying({ queueInitial, tracks: history }) === true) {
      store.dispatch({
        type: PLAY_PAUSE_REQUEST,
      });

      return;
    }

    store.dispatch({
      type: PLAY_REQUEST,
      payload: {
        play: history[0],
        queue: history,
        queueInitial: history,
      },
    });

    store.dispatch(urlCurrentPlaying(match.url));
  };

  const trackPlayPause = (trackId = 'ZEFENIFY') => {
    if (current === null || current.id !== trackId) {
      const trackIndex = history.findIndex(track => track.id === trackId);

      if (trackIndex === -1) {
        return;
      }

      store.dispatch({
        type: PLAY_REQUEST,
        payload: {
          play: history[trackIndex],
          queue: history,
          queueInitial: history,
        },
      });

      store.dispatch(urlCurrentPlaying(match.url));
      return;
    }

    store.dispatch({
      type: PLAY_PAUSE_REQUEST,
    });
  };

  const contextMenuTrack = (trackId = 'ZEFENIFY') => {
    const trackIndex = history.findIndex(track => track.id === trackId);

    if (trackIndex === -1) {
      return;
    }

    store.dispatch({
      type: CONTEXT_MENU_ON_REQUEST,
      payload: {
        type: CONTEXT_TRACK,
        payload: history[trackIndex],
      },
    });
  };

  return (
    <Recent
      playing={playing}
      current={current}
      track={history}
      durationTotal={tracksDuration({ tracks: history })}
      tracksPlaying={tracksPlaying({ queueInitial, tracks: history })}
      tracksPlayPause={historyPlayPause}
      trackPlayPause={trackPlayPause}
      contextMenuTrack={contextMenuTrack}
    />
  );
};

RecentContainer.propTypes = {
  match: shape({
    url: string,
  }).isRequired,
};


export default RecentContainer;
