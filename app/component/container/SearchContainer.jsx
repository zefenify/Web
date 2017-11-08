/* eslint max-len: off */

import React, { Component } from 'react';
import { bool, shape } from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';
import cloneDeep from 'lodash/cloneDeep';

import { NOTIFICATION_ON_REQUEST } from '@app/redux/constant/notification';
import { PLAY_REQUEST, PLAY_PAUSE_REQUEST } from '@app/redux/constant/wolfCola';
import { CONTEXT_MENU_ON_REQUEST, CONTEXT_TRACK } from '@app/redux/constant/contextMenu';
import { SEARCH } from '@app/config/api';
import track from '@app/util/track';

import store from '@app/redux/store';
import { loading } from '@app/redux/action/loading';

import Search from '@app/component/presentational/Search';

const THROTTLE_TIMEOUT = 500;
let throttle = null;
let { CancelToken } = axios;
let source = CancelToken.source();

class SearchContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      q: '',
      matches: null,
    };

    this.handleChange = this.handleChange.bind(this);
    this.trackPlayPause = this.trackPlayPause.bind(this);
    this.contextMenuTrack = this.contextMenuTrack.bind(this);
  }

  componentWillUnmount() {
    clearTimeout(throttle);
    store.dispatch(loading(true));
    source.cancel();
  }

  trackPlayPause(trackId) {
    if (this.props.current !== null && this.props.current.track_id === trackId) {
      store.dispatch({
        type: PLAY_PAUSE_REQUEST,
      });

      return;
    }

    const trackIdIndex = this.state.matches.track.findIndex(t => t.track_id === trackId);

    if (trackIdIndex === -1) {
      return;
    }

    store.dispatch({
      type: PLAY_REQUEST,
      payload: {
        play: this.state.matches.track[trackIdIndex],
        queue: this.state.matches.track,
        queueInitial: this.state.matches.track,
      },
    });
  }

  handleChange(e) {
    const q = e.target.value;

    if (q.length > 16) {
      return;
    }

    clearTimeout(throttle);
    source.cancel();

    this.setState(() => ({
      matches: null,
    }));

    this.setState(() => ({ q }), () => {
      throttle = setTimeout(() => {
        if (this.state.q === '' || this.state.q.length < 2) {
          this.setState(() => ({
            matches: null,
          }));

          return;
        }

        // recreating token...
        // eslint-disable-next-line
        CancelToken = axios.CancelToken;
        source = CancelToken.source();

        store.dispatch(loading(true));
        axios
          .get(SEARCH, { params: { q: this.state.q } }, { cancelToken: source.token })
          .then((data) => {
            store.dispatch(loading(false));
            const matches = data.data.data;
            matches.album = matches.album.map(album => Object.assign({}, album, { album_cover: cloneDeep(data.data.included.s3[album.album_cover]) }));
            matches.artist = matches.artist.map(artist => Object.assign({}, artist, { artist_cover: cloneDeep(data.data.included.s3[artist.artist_cover]) }));
            matches.playlist = matches.playlist.map(playlist => Object.assign({}, playlist, { playlist_cover: cloneDeep(data.data.included.s3[playlist.playlist_cover]) }));
            matches.track = track(matches.track, data.data.included);

            this.setState(() => ({ matches }));
          }, (err) => {
            store.dispatch(loading(false));

            if (err.message === 'Network Error') {
              store.dispatch({
                type: NOTIFICATION_ON_REQUEST,
                payload: {
                  message: 'No Internet connection. Please try again later',
                },
              });

              return;
            }

            store.dispatch({
              type: NOTIFICATION_ON_REQUEST,
              payload: {
                message: 'ይቅርታ, unable to fetch results',
              },
            });
          });
      }, THROTTLE_TIMEOUT);
    });
  }

  contextMenuTrack(trackId) {
    const trackIndex = this.state.matches.track.findIndex(t => t.track_id === trackId);

    if (trackIndex === -1) {
      return;
    }

    store.dispatch({
      type: CONTEXT_MENU_ON_REQUEST,
      payload: {
        type: CONTEXT_TRACK,
        payload: this.state.matches.track[trackIndex],
      },
    });
  }

  render() {
    return (
      <Search
        q={this.state.q}
        matches={this.state.matches}
        current={this.props.current}
        playing={this.props.playing}
        handleChange={this.handleChange}
        trackPlayPause={this.trackPlayPause}
        contextMenuTrack={this.contextMenuTrack}
      />
    );
  }
}

SearchContainer.propTypes = {
  playing: bool,
  current: shape({}),
};

SearchContainer.defaultProps = {
  playing: false,
  current: null,
};

module.exports = connect(state => ({
  current: state.current,
  playing: state.playing,
}))(SearchContainer);
