import React, { useState, useContext } from 'react';
import { string, shape } from 'prop-types';
import isEqual from 'react-fast-compare';

import { BASE } from '@app/config/api';
import { PLAY_REQUEST, PLAY_PAUSE_REQUEST } from '@app/redux/constant/wolfCola';
import api, { error } from '@app/util/api';
import track from '@app/util/track';
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
      api(`${BASE}collection`, user, (cancel) => {
        requestCancel = cancel;
      }).then(({ data, included }) => {
        store.dispatch(loading(false));

        const collection = data.map(_collection => Object.assign({}, _collection, {
          collection_cover: included.s3[_collection.collection_cover],
          collection_playlist: _collection.collection_playlist.map(playlistId => Object.assign({}, included.playlist[playlistId], {
            playlist_cover: included.s3[included.playlist[playlistId].playlist_cover],
          })),
        }));

        setState(previousState => ({
          ...previousState,
          collectionName: 'Genre & Moods',
          collection,
          collectionId: '',
        }));
      }, error(store));

      return () => {
        store.dispatch(loading(false));
        requestCancel();
      };
    }

    api(`${BASE}collection/${match.params.id}`, user, (cancel) => {
      requestCancel = cancel;
    }).then(({ data, included }) => {
      store.dispatch(loading(false));

      const collection = Object.assign({}, data, {
        collection_cover: included.s3[data.collection_cover],
        collection_playlist: data.collection_playlist.map(playlistId => Object.assign({}, included.playlist[playlistId], {
          playlist_cover: included.s3[included.playlist[playlistId].playlist_cover],
        })),
      });

      // checking for playlist restore...
      let playlistPlayingId = '';
      const queueInitialTrackId = queueInitial.map(queueTrack => queueTrack.track_id);

      collection.collection_playlist.forEach((playlist) => {
        if (isEqual(playlist.playlist_track, queueInitialTrackId) === true) {
          playlistPlayingId = playlist.playlist_id;
        }
      });

      setState(previousState => ({
        ...previousState,
        collectionName: data.collection_name,
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

      return;
    }

    api(`${BASE}playlist/${playlistId}`, user, (cancel) => {
      requestCancel = cancel;
    }).then(({ data, included }) => {
      // mapping track...
      const playlistTrack = Object.assign({}, data, {
        playlist_track: data.playlist_track.map(trackId => included.track[trackId]),
      });

      const trackList = track(playlistTrack.playlist_track, included);

      setState(previousState => ({
        ...previousState,
        playlistPlayingId: playlistId,
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

      store.dispatch(urlCurrentPlaying(`/playlist/${playlistId}`));
    }, error(store));
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
