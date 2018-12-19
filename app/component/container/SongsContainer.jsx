import React, { useState, useContext } from 'react';
import { shape, string } from 'prop-types';

import { PLAY_REQUEST, PLAY_PAUSE_REQUEST } from '@app/redux/constant/wolfCola';
import { CONTEXT_MENU_ON_REQUEST, CONTEXT_TRACK } from '@app/redux/constant/contextMenu';
import store from '@app/redux/store';
import { urlCurrentPlaying } from '@app/redux/action/urlCurrentPlaying';
import songDuration from '@app/redux/selector/songDuration';
import songPlaying from '@app/redux/selector/songPlaying';
import songTrack from '@app/redux/selector/songTrack';
import Songs from '@app/component/presentational/Songs';
import { Context } from '@app/component/context/context';
import useEffectDeep from '@app/hook/useEffectDeep';


const SongsContainer = ({ match }) => {
  const {
    current,
    playing,
    user,
    song,
    queueInitial,
  } = useContext(Context);
  const [state, setState] = useState({
    song: songTrack({ song }),
    totalDuration: songDuration({ song }),
    songPlaying: songPlaying({ song, queueInitial }),
  });

  useEffectDeep(() => {
    setState(Object.assign(state, {
      song: songTrack({ song }),
      totalDuration: songDuration({ song }),
      songPlaying: songPlaying({ song, queueInitial }),
    }));
  }, [song, queueInitial]);

  const songPlayPause = () => {
    if (state.songPlaying === true) {
      store.dispatch({
        type: PLAY_PAUSE_REQUEST,
      });

      return;
    }

    store.dispatch({
      type: PLAY_REQUEST,
      payload: {
        play: state.song[0],
        queue: state.song,
        queueInitial: state.song,
      },
    });

    store.dispatch(urlCurrentPlaying(match.url));
  };

  const trackPlayPause = (trackId = 'ZEFENIFY') => {
    if (current !== null && current.track_id === trackId) {
      store.dispatch({
        type: PLAY_PAUSE_REQUEST,
      });

      return;
    }

    const trackIndex = state.song.findIndex(_track => _track.track_id === trackId);

    if (trackIndex === -1) {
      return;
    }

    store.dispatch({
      type: PLAY_REQUEST,
      payload: {
        play: state.song[trackIndex],
        queue: state.song,
        queueInitial: state.song,
      },
    });

    setState(Object.assign(state, {
      songPlaying: true,
    }));

    store.dispatch(urlCurrentPlaying(match.url));
  };

  const contextMenuTrack = (trackId = 'ZEFENIFY') => {
    if (state.song === null) {
      return;
    }

    const trackIndex = state.song.findIndex(_track => _track.track_id === trackId);

    if (trackIndex === -1) {
      return;
    }

    store.dispatch({
      type: CONTEXT_MENU_ON_REQUEST,
      payload: {
        type: CONTEXT_TRACK,
        payload: state.song[trackIndex],
      },
    });
  };

  return (
    <Songs
      current={current}
      playing={playing}
      user={user}
      song={state.song}
      totalDuration={state.totalDuration}
      songPlaying={state.songPlaying}
      songPlayPause={songPlayPause}
      trackPlayPause={trackPlayPause}
      contextMenuTrack={contextMenuTrack}
    />
  );
};

SongsContainer.propTypes = {
  match: shape({
    url: string,
  }).isRequired,
};


export default SongsContainer;
