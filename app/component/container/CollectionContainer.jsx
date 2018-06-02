import React, { Component } from 'react';
import { bool, string, shape, arrayOf } from 'prop-types';
import isEqual from 'react-fast-compare';

import { BASE } from '@app/config/api';
import { PLAY_REQUEST, PLAY_PAUSE_REQUEST } from '@app/redux/constant/wolfCola';
import { loading } from '@app/redux/action/loading';
import store from '@app/redux/store';
import api, { error } from '@app/util/api';
import track from '@app/util/track';
import { urlCurrentPlaying } from '@app/redux/action/urlCurrentPlaying';

import Collection from '@app/component/presentational/Collection';
import { withContext } from '@app/component/context/context';

class CollectionContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collectionName: 'Genre & Moods',
      collection: null,
      collectionId: props.match.params.id, // used for comparison in `getDerivedStateFromProps`
      playlistPlayingId: '',
    };

    this.build = this.build.bind(this);
    this.playlistPlay = this.playlistPlay.bind(this);
  }

  componentDidMount() {
    this.build();
  }

  componentDidUpdate(previousProps, previousState) {
    if (previousState.collectionId !== this.state.collectionId) {
      this.build();
    }
  }

  componentWillUnmount() {
    store.dispatch(loading(false));
    this.cancelRequest();
  }

  playlistPlay(playlistId) {
    if (this.state.playlistPlayingId === playlistId) {
      store.dispatch({
        type: PLAY_PAUSE_REQUEST,
      });

      return;
    }

    api(`${BASE}playlist/${playlistId}`, this.props.user, (cancel) => {
      this.cancelRequest = cancel;
    }).then((data) => {
      // mapping track...
      const playlistTrack = Object.assign({}, data.data, {
        playlist_track: data.data.playlist_track.map(trackId => data.included.track[trackId]),
      });

      const tracks = track(playlistTrack.playlist_track, data.included);

      this.setState(() => ({
        playlistPlayingId: playlistId,
      }));

      // playing...
      store.dispatch({
        type: PLAY_REQUEST,
        payload: {
          play: tracks[0],
          queue: tracks,
          queueInitial: tracks,
        },
      });

      store.dispatch(urlCurrentPlaying(`/playlist/${playlistId}`));
    }, error(store));
  }

  build() {
    store.dispatch(loading(true));

    // resetting view...
    this.setState(() => ({
      collection: null,
    }));

    if (this.props.match.params.id === undefined) {
      api(`${BASE}collection`, this.props.user, (cancel) => {
        this.cancelRequest = cancel;
      }).then((data) => {
        store.dispatch(loading(false));

        const collection = data.data.map(c => Object.assign({}, c, {
          collection_cover: data.included.s3[c.collection_cover],
          collection_playlist: c.collection_playlist.map(playlistId => Object.assign({}, data.included.playlist[playlistId], {
            playlist_cover: data.included.s3[data.included.playlist[playlistId].playlist_cover],
          })),
        }));

        this.setState(() => ({
          collectionName: 'Genre & Moods',
          collection,
        }));
      }, error(store));

      return;
    }

    api(`${BASE}collection/${this.props.match.params.id}`, this.props.user, (cancel) => {
      this.cancelRequest = cancel;
    }).then((data) => {
      store.dispatch(loading(false));

      const collection = Object.assign({}, data.data, {
        collection_cover: data.included.s3[data.data.collection_cover],
        collection_playlist: data.data.collection_playlist.map(playlistId => Object.assign({}, data.included.playlist[playlistId], {
          playlist_cover: data.included.s3[data.included.playlist[playlistId].playlist_cover],
        })),
      });

      // checking for playlist restore...
      let playlistPlayingId = '';
      const queueInitialTrackId = this.props.queueInitial.map(queueTrack => queueTrack.track_id);

      collection.collection_playlist.forEach((playlist) => {
        if (isEqual(playlist.playlist_track, queueInitialTrackId) === true) {
          playlistPlayingId = playlist.playlist_id;
        }
      });

      this.setState(() => ({
        collectionName: data.data.collection_name,
        collection,
        playlistPlayingId,
      }));
    }, error(store));
  }

  render() {
    return (
      <Collection
        playing={this.props.playing}
        collectionName={this.state.collectionName}
        collectionId={this.state.collectionId}
        collection={this.state.collection}
        playlistPlayingId={this.state.playlistPlayingId}
        playlistPlay={this.playlistPlay}
      />
    );
  }
}

CollectionContainer.getDerivedStateFromProps = (nextProps, previousState) => {
  if (nextProps.match.params.id === previousState.collectionId) {
    return null;
  }

  return {
    collection: null,
    collectionId: nextProps.match.params.id,
  };
};

CollectionContainer.propTypes = {
  playing: bool,
  queueInitial: arrayOf(shape({})),
  match: shape({
    url: string,
    params: shape({
      id: string,
    }),
  }),
  user: shape({}),
};

CollectionContainer.defaultProps = {
  playing: false,
  queueInitial: [],
  match: {
    params: {
      id: '',
    },
  },
  user: null,
};

module.exports = withContext('playing', 'queueInitial', 'user')(CollectionContainer);
