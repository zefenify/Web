import React, { Component } from 'react';
import { bool } from 'prop-types';
import isEqual from 'lodash/isEqual';
import { connect } from 'react-redux';

import { BASE, FEATURED } from '@app/config/api';
import { NOTIFICATION_ON_REQUEST } from '@app/redux/constant/notification';
import { PLAY_REQUEST, PLAY_PAUSE_REQUEST } from '@app/redux/constant/wolfCola';
import { loading } from '@app/redux/action/loading';
import store from '@app/redux/store';
import api from '@app/util/api';
import track from '@app/util/track';

import Home from '@app/component/presentational/Home';

class HomeContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      featured: [],
      featuredPlayingId: '',
    };

    this.playFeatured = this.playFeatured.bind(this);
  }

  componentDidMount() {
    store.dispatch(loading(true));
    api(FEATURED, undefined, (cancel) => {
      this.cancelRequest = cancel;
    }).then((data) => {
      store.dispatch(loading(false));
      this.setState(() => ({
        featured: data.data.map(featured => Object.assign({}, featured, {
          playlist_cover: data.included.s3[featured.playlist_cover],
        })),
      }), () => {
        // restoring `featuredPlayingId`...
        const { queueInitial } = store.getState();
        const queueInitialTrackId = queueInitial.map(queueTrack => queueTrack.track_id);
        let featuredPlayingId = '';

        this.state.featured.forEach((featured) => {
          if (isEqual(featured.playlist_track, queueInitialTrackId) === true) {
            featuredPlayingId = featured.playlist_id;
          }
        });

        this.setState(() => ({ featuredPlayingId }));
      });
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
          message: 'ይቅርታ, unable to fetch Featured Playlist',
        },
      });
    });
  }

  componentWillUnmount() {
    store.dispatch(loading(false));
    this.cancelRequest();
  }

  playFeatured(fid) {
    // trigger _stop_...
    if (this.state.featuredPlayingId === fid) {
      // pausing whatever was playing...
      store.dispatch({
        type: PLAY_PAUSE_REQUEST,
      });

      // pausing icon...
      this.setState(() => ({
        featuredPlayingId: fid,
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
        type: PLAY_REQUEST,
        payload: {
          play: tracks[0],
          queue: tracks,
          queueInitial: tracks,
        },
      });
    }, () => {
      this.setState(() => ({
        featuredPlayingId: '',
      }));
    });
  }

  render() {
    return (
      <Home
        playing={this.props.playing}
        featured={this.state.featured}
        featuredPlayingId={this.state.featuredPlayingId}
        playFeatured={this.playFeatured}
      />
    );
  }
}

HomeContainer.propTypes = {
  playing: bool,
};

HomeContainer.defaultProps = {
  playing: false,
};

module.exports = connect(state => ({
  playing: state.playing,
}))(HomeContainer);
