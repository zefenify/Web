import React, { useState, useContext } from 'react';

import { VOLUME_REQUEST } from '@app/redux/constant/volume';
import { REPEAT_REQUEST } from '@app/redux/constant/repeat';
import { SHUFFLE_REQUEST } from '@app/redux/constant/shuffle';
import { REMAINING_REQUEST } from '@app/redux/constant/remaining';
import {
  NEXT_REQUEST,
  PREVIOUS_REQUEST,
  SEEK_REQUEST,
  PLAY_PAUSE_REQUEST,
} from '@app/redux/constant/wolfCola';
import { SONG_SAVE_REQUEST, SONG_REMOVE_REQUEST } from '@app/redux/constant/song';
import store from '@app/redux/store';
import Control from '@app/component/presentational/Control';
import { Context } from '@app/component/context/context';
import useEffectDeep from '@app/hook/useEffectDeep';


const dispatches = {
  seek(event) {
    store.dispatch({
      type: SEEK_REQUEST,
      payload: Number.parseInt(event.target.value, 10),
    });
  },

  togglePlayPause() {
    store.dispatch({
      type: PLAY_PAUSE_REQUEST,
    });
  },

  next() {
    store.dispatch({
      type: NEXT_REQUEST,
    });
  },

  previous() {
    store.dispatch({
      type: PREVIOUS_REQUEST,
    });
  },

  toggleShuffle() {
    store.dispatch({
      type: SHUFFLE_REQUEST,
    });
  },

  toggleRemaining() {
    store.dispatch({
      type: REMAINING_REQUEST,
    });
  },

  setRepeat() {
    store.dispatch({
      type: REPEAT_REQUEST,
    });
  },

  setVolume(event) {
    store.dispatch({
      type: VOLUME_REQUEST,
      payload: Number.parseFloat(event.target.value),
    });
  },

  muteVolume() {
    store.dispatch({
      type: VOLUME_REQUEST,
      payload: 0,
    });
  },

  maxVolume() {
    store.dispatch({
      type: VOLUME_REQUEST,
      payload: 1,
    });
  },
};


const ControlContainer = () => {
  const {
    current,
    duration,
    playbackPosition,
    playing,
    shuffle,
    repeat,
    volume,
    remaining,
    urlCurrentPlaying,
    queueNext,
    song,
    user,
  } = useContext(Context);
  const [state, setState] = useState({
    liked: false,
  });

  useEffectDeep(() => {
    if (song === null || current === null) {
      setState(previousState => ({
        ...previousState,
        like: false,
      }));

      return;
    }

    setState(previousState => ({
      ...previousState,
      like: Object.keys(song.included.track).includes(current.track_id),
    }));
  }, [song, current]);

  const likeTrackToggle = () => {
    const { like } = state;

    // optimistic update
    setState(previousState => ({
      ...previousState,
      like: !like,
    }));

    store.dispatch({
      type: like === true ? SONG_REMOVE_REQUEST : SONG_SAVE_REQUEST,
      payload: current,
    });
  };

  return (
    <Control
      user={user}
      queueNext={queueNext}
      current={current}
      duration={duration}
      playbackPosition={playbackPosition}
      playing={playing}
      shuffle={shuffle}
      repeat={repeat}
      volume={volume}
      remaining={remaining}
      urlCurrentPlaying={urlCurrentPlaying}
      likeTrackToggle={likeTrackToggle}
      {...state}
      {...dispatches}
    />
  );
};


export default ControlContainer;
