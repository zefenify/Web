import React, { Component } from 'react';

import { FEATURED_ALL } from '@app/config/api';
import { PLAY, TOGGLE_PLAY_PAUSE } from '@app/redux/constant/wolfCola';
import store from '@app/redux/store';
import api from '@app/util/api';

import Home from '@app/component/presentational/Home';

class HomeContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      featured: [],
      featuredPlayingId: '-1',
    };

    this.playFeatured = this.playFeatured.bind(this);
  }

  componentDidMount() {
    api(FEATURED_ALL, (cancel) => {
      this.cancelRequest = cancel;
    })
      .then((data) => {
        this.setState(() => ({
          featured: data,
        }));
      }, (err) => {
        /* handle fetch error */
      });
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
        featuredPlayingId: '-1',
      }));
      return;
    }

    this.setState(() => ({
      featuredPlayingId: fid,
    }));

    // calling...
    api(`json/featured/${fid}.json`)
      .then((data) => {
        // playing...
        store.dispatch({
          type: PLAY,
          payload: {
            play: data.songs[0],
            queue: data.songs,
            initialQueue: data.songs,
          },
        });
      }, () => {
        this.setState(() => ({
          featuredPlayingId: '-1',
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
