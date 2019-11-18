/* eslint max-len: off */

import React, {
  useState,
  useContext,
  useEffect,
  useRef,
} from 'react';

import { PLAY_REQUEST, PLAY_PAUSE_REQUEST } from '@app/redux/constant/wolfCola';
import { CONTEXT_MENU_ON_REQUEST, CONTEXT_TRACK } from '@app/redux/constant/contextMenu';
import store from '@app/redux/store';
import { gql, error } from '@app/util/api';
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

    clearTimeout(throttle);
    requestCancel();

    setState(previousState => ({
      ...previousState,
      match: null,
      q,
    }));

    throttle = setTimeout(() => {
      if (q === '' || q.length < 2 || q.length > 16) {
        setState(previousState => ({
          ...previousState,
          match: null,
        }));

        return;
      }

      store.dispatch(loading(true));

      gql(user, `query Search($q: String!) {
        search(q: $q) {
          artist {
            id
            name
            cover {
              name
            }
          }
          album {
            id
            name
            cover {
              name
            }
          }
          playlist {
            id
            name
            cover {
              name
            }
          }
          track {
            id
            name
            featuring {
              id
              name
            }
            album {
              id
              name
              artist {
                id
                name
              }
              cover {
                name
              }
              year
            }
            track {
              name
              meta {
                duration
              }
            }
          }
        }
      }`, { q }, (cancel) => {
        requestCancel = cancel;
      }).then(({ data: { search } }) => {
        store.dispatch(loading(false));

        setState(previousState => ({
          ...previousState,
          match: search,
        }));
      }, error(store));
    }, THROTTLE_TIMEOUT);
  };

  const trackPlayPause = (trackId = 'ZEFENIFY') => {
    if (current !== null && current.id === trackId) {
      store.dispatch({
        type: PLAY_PAUSE_REQUEST,
      });

      return;
    }

    const trackIdIndex = state.match.track.findIndex(_track => _track.id === trackId);

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
