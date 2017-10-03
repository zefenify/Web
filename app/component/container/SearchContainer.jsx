import React, { Component } from 'react';
import { bool, shape } from 'prop-types';
import axios from 'axios';
import qs from 'qs';

import { PLAY, TOGGLE_PLAY_PAUSE } from '@app/redux/constant/wolfCola';
import { SEARCH } from '@app/config/api';

import store from '@app/redux/store';
import { loading } from '@app/redux/action/loading';

import DJKhaled from '@app/component/hoc/DJKhaled';

import Search from '@app/component/presentational/Search';

const THROTTLE_TIMEOUT = 500;
let throttle = null;
let CancelToken = axios.CancelToken;
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
    if (this.props.current !== null && this.props.current.songId === songId) {
      store.dispatch({
        type: TOGGLE_PLAY_PAUSE,
      });

      return;
    }

    const songIdIndex = this.state.matches.songs.findIndex(song => song.songId === songId);

    if (songIdIndex === -1) {
      return;
    }

    store.dispatch({
      type: PLAY,
      payload: {
        play: this.state.matches.songs[songIdIndex],
        queue: this.state.matches.songs,
        initialQueue: this.state.matches.songs,
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
        if (this.state.q === '') {
          this.setState(() => ({
            matches: null,
          }));

          return;
        }

        // recreating tokens...
        CancelToken = axios.CancelToken;
        source = CancelToken.source();

        store.dispatch(loading(true));

        axios
          .post(SEARCH, qs.stringify({ q: this.state.q }), { cancelToken: source.token })
          .then((data) => {
            store.dispatch(loading(false));

            this.setState(() => ({
              matches: data.data,
            }));
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
