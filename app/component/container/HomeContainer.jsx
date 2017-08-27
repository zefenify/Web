import React, { Component } from 'react';

import { BASE, FEATURED } from '@app/config/api';
import { PLAY, TOGGLE_PLAY_PAUSE } from '@app/redux/constant/wolfCola';
import store from '@app/redux/store';
import api from '@app/util/api';
import track from '@app/util/track';

import Home from '@app/component/presentational/Home';

class HomeContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      featured: [],
      featuredPlayingId: -1,
    };

    this.playFeatured = this.playFeatured.bind(this);
  }

  componentDidMount() {
    api(FEATURED, (cancel) => {
      this.cancelRequest = cancel;
    }).then((data) => {
      this.setState(() => ({
        featured: data.data.map(featured => Object.assign({}, featured, {
          playlist_cover: data.included.s3[featured.playlist_cover],
        })),
      }));
    }, () => { /* handle fetch error */ });
  }

  componentWillUnmount() {
    this.cancelRequest();
  }

  playFeatured(fid) {
    // trigger _stop_...
    if (this.state.featuredPlayingId === fid) {
      // pausing whatever was playing...
      store.dispatch({
        type: TOGGLE_PLAY_PAUSE,
      });

      // pausing icon...
      this.setState(() => ({
        featuredPlayingId: -1,
      }));

      return;
    }

    this.setState(() => ({
      featuredPlayingId: fid,
    }));

    api(`${BASE}playlist/${fid}`, (cancel) => {
      this.cancelRequest = cancel;
    }).then((data) => {
      // mapping track...
      const playlistTrack = Object.assign({}, data.data, {
        playlist_track: data.data.playlist_track.map(trackId => data.included.track[trackId]),
      });
      const tracks = track(playlistTrack.playlist_track, data.included);

      // playing...
      store.dispatch({
        type: PLAY,
        payload: {
          play: tracks[0],
          queue: tracks,
          initialQueue: tracks,
        },
      });
    }, () => {
      this.setState(() => ({
        featuredPlayingId: -1,
      }));
    });
  }

  render() {
    return (
      <Home
        featured={this.state.featured}
        featuredPlayingId={this.state.featuredPlayingId}
        playFeatured={this.playFeatured}
      />
    );
  }
}

module.exports = HomeContainer;
