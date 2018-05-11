/* eslint max-len: off */

import React, { Component } from 'react';
import { bool, shape } from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';

import { PLAY_REQUEST, PLAY_PAUSE_REQUEST } from '@app/redux/constant/wolfCola';
import { CONTEXT_MENU_ON_REQUEST, CONTEXT_TRACK } from '@app/redux/constant/contextMenu';
import { SEARCH } from '@app/config/api';
import track from '@app/util/track';

import store from '@app/redux/store';
import api, { error } from '@app/util/api';
import { loading } from '@app/redux/action/loading';
import { urlCurrentPlaying } from '@app/redux/action/urlCurrentPlaying';

import Search from '@app/component/presentational/Search';
import { withContext } from '@app/component/context/context';

const THROTTLE_TIMEOUT = 500; // in milliseconds
let cancelRequest = () => {};
let throttle = null;

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
    cancelRequest();
    store.dispatch(loading(false));
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

    // search is not stored - navigation clears it
    store.dispatch(urlCurrentPlaying(null));
  }

  handleChange(e) {
    const q = e.target.value;

    if (q.length > 16) {
      return;
    }

    clearTimeout(throttle);
    cancelRequest();

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

        store.dispatch(loading(true));
        api(`${SEARCH}?q=${q}`, this.props.user, (cancel) => {
          cancelRequest = cancel;
        }).then((data) => {
          store.dispatch(loading(false));
          const matches = data.data;
          matches.album = matches.album.map(album => Object.assign({}, album, { album_cover: cloneDeep(data.included.s3[album.album_cover]) }));
          matches.artist = matches.artist.map(artist => Object.assign({}, artist, { artist_cover: cloneDeep(data.included.s3[artist.artist_cover]) }));
          matches.playlist = matches.playlist.map(playlist => Object.assign({}, playlist, { playlist_cover: cloneDeep(data.included.s3[playlist.playlist_cover]) }));
          matches.track = track(matches.track, data.included);

          this.setState(() => ({ matches }));
        }, error(store));
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
  user: shape({}),
};

SearchContainer.defaultProps = {
  playing: false,
  current: null,
  user: null,
};

module.exports = withContext('user', 'current', 'playing')(SearchContainer);
