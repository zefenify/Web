/* eslint max-len: off */

import React, { Component } from 'react';
import { bool, shape } from 'prop-types';
import axios from 'axios';
import cloneDeep from 'lodash/cloneDeep';

import { PLAY, TOGGLE_PLAY_PAUSE } from '@app/redux/constant/wolfCola';
import { SEARCH } from '@app/config/api';
import track from '@app/util/track';

import store from '@app/redux/store';
import { loading } from '@app/redux/action/loading';

import DJKhaled from '@app/component/hoc/DJKhaled';

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
    this.togglePlayPauseSong = this.togglePlayPauseSong.bind(this);
  }

  componentWillUnmount() {
    clearTimeout(throttle);
    source.cancel();
  }

  togglePlayPauseSong(songId) {
    if (this.props.current !== null && this.props.current.track_id === songId) {
      store.dispatch({
        type: TOGGLE_PLAY_PAUSE,
      });

      return;
    }

    const songIdIndex = this.state.matches.track.findIndex(song => song.track_id === songId);

    if (songIdIndex === -1) {
      return;
    }

    store.dispatch({
      type: PLAY,
      payload: {
        play: this.state.matches.track[songIdIndex],
        queue: this.state.matches.track,
        initialQueue: this.state.matches.track,
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
          }, () => {
            store.dispatch(loading(false));
          });
      }, THROTTLE_TIMEOUT);
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
        togglePlayPauseSong={this.togglePlayPauseSong}
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

module.exports = DJKhaled('current', 'playing')(SearchContainer);
