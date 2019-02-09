/* eslint max-len: off */

import React, {
  useState,
  useContext,
  useEffect,
  useRef,
} from 'react';
import cloneDeep from 'lodash/cloneDeep';

import { PLAY_REQUEST, PLAY_PAUSE_REQUEST } from '@app/redux/constant/wolfCola';
import { CONTEXT_MENU_ON_REQUEST, CONTEXT_TRACK } from '@app/redux/constant/contextMenu';
import { SEARCH } from '@app/config/api';
import store from '@app/redux/store';
import track from '@app/util/track';
import api, { error } from '@app/util/api';
import { loading } from '@app/redux/action/loading';
import { urlCurrentPlaying } from '@app/redux/action/urlCurrentPlaying';
import Search from '@app/component/presentational/Search';
import { Context } from '@app/component/context/context';


const THROTTLE_TIMEOUT = 500; // in milliseconds
let requestCancel = () => {};
let throttle = null;


const SearchContainer = () => {
  const inputSearch = useRef(null);
  const { user, current, playing } = useContext(Context);
  const [state, setState] = useState({
    q: '',
    match: null,
  });

  useEffect(() => {
    inputSearch.current.focus();
  }, []);

  const contextMenuTrack = (trackId = 'ZEFENIFY') => {
    const trackIndex = state.match.track.findIndex(_track => _track.track_id === trackId);

    if (trackIndex === -1) {
      return;
    }

    store.dispatch({
      type: CONTEXT_MENU_ON_REQUEST,
      payload: {
        type: CONTEXT_TRACK,
        payload: state.match.track[trackIndex],
      },
    });
  };

  const onChange = (event) => {
    const { target } = event;
    const q = target.value;

    if (q.length > 16) {
      return;
    }

    clearTimeout(throttle);
    requestCancel();

    setState(previousState => ({
      ...previousState,
      match: null,
      q,
    }));

    throttle = setTimeout(() => {
      if (state.q === '' || state.q.length < 2) {
        setState(previousState => ({
          ...previousState,
          match: null,
        }));

        return;
      }

      store.dispatch(loading(true));
      api(`${SEARCH}?q=${q}`, user, (cancel) => {
        requestCancel = cancel;
      }).then(({ data, included }) => {
        store.dispatch(loading(false));
        const match = data;
        match.album = match.album.map(album => Object.assign({}, album, { album_cover: cloneDeep(included.s3[album.album_cover]) }));
        match.artist = match.artist.map(artist => Object.assign({}, artist, { artist_cover: cloneDeep(included.s3[artist.artist_cover]) }));
        match.playlist = match.playlist.map(playlist => Object.assign({}, playlist, { playlist_cover: cloneDeep(included.s3[playlist.playlist_cover]) }));
        match.track = track(match.track, included);

        setState(previousState => ({
          ...previousState,
          match,
        }));
      }, error(store));
    }, THROTTLE_TIMEOUT);
  };

  const trackPlayPause = (trackId = 'ZEFENIFY') => {
    if (current !== null && current.track_id === trackId) {
      store.dispatch({
        type: PLAY_PAUSE_REQUEST,
      });

      return;
    }

    const trackIdIndex = state.match.track.findIndex(_track => _track.track_id === trackId);

    if (trackIdIndex === -1) {
      return;
    }

    store.dispatch({
      type: PLAY_REQUEST,
      payload: {
        play: state.match.track[trackIdIndex],
        queue: state.match.track,
        queueInitial: state.match.track,
      },
    });

    // search is not stored - navigation clears it
    store.dispatch(urlCurrentPlaying(null));
  };

  return (
    <Search
      {...state}
      inputSearchRef={inputSearch}
      current={current}
      playing={playing}
      onChange={onChange}
      trackPlayPause={trackPlayPause}
      contextMenuTrack={contextMenuTrack}
    />
  );
};


export default SearchContainer;
