import React, { Component } from 'react';
import { string, bool, shape } from 'prop-types';

import { BASE } from '@app/config/api';
import { CONTEXT_MENU_ON_REQUEST, CONTEXT_TRACK } from '@app/redux/constant/contextMenu';
import { PLAY_REQUEST, PLAY_PAUSE_REQUEST } from '@app/redux/constant/wolfCola';
import trackListSame from '@app/util/trackListSame';
import track from '@app/util/track';
import { human } from '@app/util/time';

import api, { error } from '@app/util/api';
import { loading } from '@app/redux/action/loading';
import store from '@app/redux/store';
import { urlCurrentPlaying } from '@app/redux/action/urlCurrentPlaying';

import Trending from '@app/component/presentational/Trending';
import { withContext } from '@app/component/context/context';

class TrendingContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trending: null,
      duration: {
        hours: 0,
        minutes: 0,
        seconds: 0,
      },
      category: props.match.params.category,
      trendingPlaying: false,
    };

    this.trendingPlayPause = this.trendingPlayPause.bind(this);
    this.trackPlayPause = this.trackPlayPause.bind(this);
    this.contextMenuTrack = this.contextMenuTrack.bind(this);
  }

  componentDidMount() {
    this.loadTracks(this.props.match.params.category);
  }

  componentDidUpdate(previousProps, previousState) {
    if (previousState.category !== this.state.category) {
      this.loadTracks(this.state.category);
    }
  }

  componentWillUnmount() {
    store.dispatch(loading(false));
    this.cancelRequest();
  }

  loadTracks(filter) {
    // this makes sure tab navigation clears previous render
    this.setState(() => ({
      trending: null,
    }));

    if (this.cancelRequest !== undefined) {
      this.cancelRequest();
    }

    store.dispatch(loading(true));
    api(`${BASE}trending/${filter}`, this.props.user, (cancel) => {
      this.cancelRequest = cancel;
    }, filter === 'today')
      .then((data) => {
        store.dispatch(loading(false));

        const trending = track(data.data, data.included);

        this.setState(() => ({
          trending,
          duration: human(trending.reduce((totalDuration, t) => totalDuration + t.track_track.s3_meta.duration, 0), true),
        }), () => {
          const { queueInitial } = store.getState();

          if (queueInitial.length === 0 || this.state.trending.length === 0) {
            this.setState(() => ({
              trendingPlaying: false,
            }));

            return;
          }

          this.setState(() => ({
            trendingPlaying: trackListSame(this.state.trending, queueInitial),
          }));
        });
      }, error(store));
  }

  trendingPlayPause() {
    if (this.state.trending === null || this.state.trending.length === 0) {
      return;
    }

    // booting playlist...
    if (this.props.current === null || this.state.trendingPlaying === false) {
      store.dispatch({
        type: PLAY_REQUEST,
        payload: {
          play: this.state.trending[0],
          queue: this.state.trending,
          queueInitial: this.state.trending,
        },
      });

      this.setState(() => ({
        trendingPlaying: true,
      }));

      store.dispatch(urlCurrentPlaying(this.props.match.url));

      return;
    }

    store.dispatch({
      type: PLAY_PAUSE_REQUEST,
    });
  }

  trackPlayPause(trackId) {
    if (this.props.current !== null && this.props.current.track_id === trackId) {
      store.dispatch({
        type: PLAY_PAUSE_REQUEST,
      });

      return;
    }

    const trackIndex = this.state.trending.findIndex(t => t.track_id === trackId);

    if (trackIndex === -1) {
      return;
    }

    store.dispatch({
      type: PLAY_REQUEST,
      payload: {
        play: this.state.trending[trackIndex],
        queue: this.state.trending,
        queueInitial: this.state.trending,
      },
    });

    this.setState(() => ({
      trendingPlaying: true,
    }));

    store.dispatch(urlCurrentPlaying(this.props.match.url));
  }

  contextMenuTrack(trackId) {
    if (this.state.trending === null) {
      return;
    }

    const trackIndex = this.state.trending.findIndex(t => t.track_id === trackId);

    if (trackIndex === -1) {
      return;
    }

    store.dispatch({
      type: CONTEXT_MENU_ON_REQUEST,
      payload: {
        type: CONTEXT_TRACK,
        payload: this.state.trending[trackIndex],
      },
    });
  }

  render() {
    return (
      <Trending
        current={this.props.current}
        playing={this.props.playing}
        category={this.props.match.params.category}
        trending={this.state.trending}
        duration={this.state.duration}
        trendingPlaying={this.state.trendingPlaying}
        trendingPlayPause={this.trendingPlayPause}
        trackPlayPause={this.trackPlayPause}
        contextMenuTrack={this.contextMenuTrack}
      />
    );
  }
}

TrendingContainer.getDerivedStateFromProps = (nextProps, prevState) => {
  if (nextProps.match.params.category === prevState.category) {
    return null;
  }

  return {
    category: nextProps.match.params.category,
  };
};

TrendingContainer.propTypes = {
  playing: bool,
  current: shape({}),
  match: shape({
    url: string,
    params: shape({
      category: string,
    }),
  }).isRequired,
  user: shape({}),
};

TrendingContainer.defaultProps = {
  playing: false,
  current: null,
  user: null,
};

module.exports = withContext('user', 'current', 'playing')(TrendingContainer);
