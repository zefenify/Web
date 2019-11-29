import React, { useState, useContext } from 'react';
import { string, shape } from 'prop-types';
import isEqual from 'react-fast-compare';

import { PLAY_REQUEST, PLAY_PAUSE_REQUEST } from '@app/redux/constant/wolfCola';
import { gql, error } from '@app/util/api';
import store from '@app/redux/store';
import { loading } from '@app/redux/action/loading';
import { urlCurrentPlaying } from '@app/redux/action/urlCurrentPlaying';
import Collection from '@app/component/presentational/Collection';
import { Context } from '@app/component/context/context';
import useEffectDeep from '@app/hook/useEffectDeep';


let requestCancel = () => {};

const CollectionContainer = ({ match }) => {
  const { playing, queueInitial, user } = useContext(Context);
  const [state, setState] = useState({
    collectionName: 'Genre & Moods',
    collection: null,
    collectionId: match.params.id || '', // used for comparison in `getDerivedStateFromProps`
    playlistPlayingId: '',
  });

  useEffectDeep(() => {
    store.dispatch(loading(true));

    setState(previousState => ({
      ...previousState,
      collection: null,
    }));

    if (match.params.id === undefined) {
      gql(user, `query Collections {
        collections {
          id
          name
          cover {
            name
          }
          playlist {
            id
          }
        }
      }`, {}, (cancel) => { requestCancel = cancel; }).then(({ data: { collections } }) => {
        store.dispatch(loading(false));

        setState(previousState => ({
          ...previousState,
          collectionName: 'Genre & Moods',
          collection: collections,
          collectionId: '',
        }));
      }, error(store));

      return () => {
        store.dispatch(loading(false));
        requestCancel();
      };
    }

    gql(user, `query Collection($id: String!) {
      collection(id: $id) {
        id
        name
        playlist {
          id
          description
          cover {
            name
          }
          track {
            id
          }
        }
      }
    }`, { id: match.params.id }, (cancel) => { requestCancel = cancel; }).then(({ data: { collection } }) => {
      store.dispatch(loading(false));

      // checking for playlist restore...
      let playlistPlayingId = '';
      const queueInitialTrackId = queueInitial.map(queueTrack => queueTrack.id);

      collection.playlist.forEach((playlist) => {
        if (isEqual(playlist.track.map(_track => _track.id), queueInitialTrackId) === true) {
          playlistPlayingId = playlist.id;
        }
      });

      setState(previousState => ({
        ...previousState,
        collectionName: collection.name,
        collection,
        collectionId: match.params.id,
        playlistPlayingId,
      }));
    }, error(store));

    return () => {
      store.dispatch(loading(false));
      requestCancel();
    };
  }, [user, match.params.id]);

  const playlistPlay = (playlistId = 'ZEFENIFY') => {
    if (state.playlistPlayingId === playlistId) {
      store.dispatch({
        type: PLAY_PAUSE_REQUEST,
      });

      return () => {};
    }

    store.dispatch(loading(true));
    gql(user, `query Playlist($id: String!) {
      playlist(id: $id) {
        id
        name
        description
        cover {
          name
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
    }`, { id: playlistId }, (cancel) => { requestCancel = cancel; }).then(({ data: { playlist } }) => {
      store.dispatch(loading(false));
      store.dispatch({
        type: PLAY_REQUEST,
        payload: {
          play: playlist.track[0],
          queue: playlist.track,
          queueInitial: playlist.track,
        },
      });

      setState(previousState => ({
        ...previousState,
        playlistPlayingId: playlistId,
      }));

      store.dispatch(urlCurrentPlaying(`/playlist/${playlistId}`));
    }, error(store));

    return () => {
      store.dispatch(loading(false));
      requestCancel();
    };
  };

  return (
    <Collection
      playing={playing}
      collectionName={state.collectionName}
      collectionId={state.collectionId}
      collection={state.collection}
      playlistPlayingId={state.playlistPlayingId}
      playlistPlay={playlistPlay}
    />
  );
};

CollectionContainer.propTypes = {
  match: shape({
    url: string,
    params: shape({
      id: string,
    }),
  }).isRequired,
};


export default CollectionContainer;
