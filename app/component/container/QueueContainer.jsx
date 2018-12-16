import React, { useContext } from 'react';
import { shape, string } from 'prop-types';

import { PLAY_REQUEST, PLAY_PAUSE_REQUEST } from '@app/redux/constant/wolfCola';
import { CONTEXT_MENU_ON_REQUEST, CONTEXT_TRACK } from '@app/redux/constant/contextMenu';
import store from '@app/redux/store';
import tracksDuration from '@app/redux/selector/tracksDuration';
import { urlCurrentPlaying } from '@app/redux/action/urlCurrentPlaying';
import Queue from '@app/component/presentational/Queue';
import { Context } from '@app/component/context/context';


const QueueContainer = ({ match }) => {
  const {
    playing,
    current,
    queueNext,
    queueInitial,
  } = useContext(Context);

  const queueNextPlay = () => {
    store.dispatch({
      type: PLAY_REQUEST,
      payload: {
        play: queueNext[0],
        queue: queueNext,
        queueInitial,
      },
    });

    store.dispatch(urlCurrentPlaying(match.url));
  };

  const trackPlayPause = (trackId = 'ZEFENIFY') => {
    if (current === null || current.track_id !== trackId) {
      const trackIndex = queueNext.findIndex(track => track.track_id === trackId);

      if (trackIndex === -1) {
        return;
      }

      store.dispatch({
        type: PLAY_REQUEST,
        payload: {
          play: queueNext[trackIndex],
          queue: queueNext,
          queueInitial,
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
    const trackIndex = queueNext.findIndex(track => track.track_id === trackId);

    if (trackIndex === -1) {
      return;
    }

    store.dispatch({
      type: CONTEXT_MENU_ON_REQUEST,
      payload: {
        type: CONTEXT_TRACK,
        payload: queueNext[trackIndex],
      },
    });
  };

  return (
    <Queue
      playing={playing}
      current={current}
      queueNext={queueNext}
      durationTotal={tracksDuration({ tracks: queueNext })}
      queueNextPlay={queueNextPlay}
      trackPlayPause={trackPlayPause}
      contextMenuTrack={contextMenuTrack}
    />
  );
};


QueueContainer.propTypes = {
  match: shape({
    url: string,
  }).isRequired,
};


export default QueueContainer;
