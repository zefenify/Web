import React, { Component } from 'react';
import { string, bool, func, shape } from 'prop-types';
import { connect } from 'react-redux';

import { BASE } from '@app/config/api';
import { NOTIFICATION_ON_REQUEST } from '@app/redux/constant/notification';
import { CONTEXT_MENU_ON_REQUEST, CONTEXT_SONG } from '@app/redux/constant/contextMenu';
import { PLAY_REQUEST, PLAY_PAUSE_REQUEST } from '@app/redux/constant/wolfCola';
import sameSongList from '@app/util/sameSongList';
import track from '@app/util/track';
import { human } from '@app/util/time';

import api from '@app/util/api';
import { loading } from '@app/redux/action/loading';
import store from '@app/redux/store';

import Trending from '@app/component/presentational/Trending';

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
      trendingPlaying: false,
    };

    this.trendingPlayPause = this.trendingPlayPause.bind(this);
    this.songPlayPause = this.songPlayPause.bind(this);
    this.contextMenuSong = this.contextMenuSong.bind(this);
  }

  componentDidMount() {
    if (this.props.match.params.category === undefined) {
      this.props.history.replace('/trending/yesterday');
      return;
    }

    this.loadSongs(this.props.match.params.category);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.category === undefined) {
      this.props.history.replace('/trending/yesterday');
      return;
    }

    if (nextProps.match.params.category !== this.props.match.params.category) {
      this.loadSongs(nextProps.match.params.category);
    }
  }

  componentWillUnmount() {
    store.dispatch(loading(false));
    this.cancelRequest();
  }

  loadSongs(filter) {
    if (['yesterday', 'today', 'week', 'popularity'].includes(filter) === false) {
      this.props.history.replace('/trending/yesterday');
      return;
    }

    // this makes sure tab navigation clears previous render
    this.setState(() => ({
      trending: null,
    }));

    if (this.cancelRequest !== undefined) {
      this.cancelRequest();
    }

    store.dispatch(loading(true));
    api(`${BASE}trending/${filter}`, undefined, (cancel) => {
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
            trendingPlaying: sameSongList(this.state.trending, queueInitial),
          }));
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
            message: 'ይቅርታ, unable to fetch Trending',
          },
        });
      });
  }

  trendingPlayPause() {
    if (this.state.trending === null) {
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

      return;
    }

    store.dispatch({
      type: PLAY_PAUSE_REQUEST,
    });
  }

  songPlayPause(songId) {
    if (this.props.current !== null && this.props.current.track_id === songId) {
      store.dispatch({
        type: PLAY_PAUSE_REQUEST,
      });

      return;
    }

    const songIndex = this.state.trending.findIndex(t => t.track_id === songId);

    if (songIndex === -1) {
      return;
    }

    store.dispatch({
      type: PLAY_REQUEST,
      payload: {
        play: this.state.trending[songIndex],
        queue: this.state.trending,
        queueInitial: this.state.trending,
      },
    });

    this.setState(() => ({
      trendingPlaying: true,
    }));
  }

  contextMenuSong(songId) {
    if (this.state.trending === null) {
      return;
    }

    const songIndex = this.state.trending.findIndex(song => song.track_id === songId);

    if (songIndex === -1) {
      return;
    }

    store.dispatch({
      type: CONTEXT_MENU_ON_REQUEST,
      payload: {
        type: CONTEXT_SONG,
        payload: this.state.trending[songIndex],
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
        songPlayPause={this.songPlayPause}
        contextMenuSong={this.contextMenuSong}
      />
    );
  }
}

TrendingContainer.propTypes = {
  playing: bool,
  current: shape({}),
  history: shape({
    replace: func,
  }).isRequired,
  match: shape({
    params: shape({
      category: string,
    }),
  }).isRequired,
};

TrendingContainer.defaultProps = {
  playing: false,
  current: null,
};

module.exports = connect(state => ({
  current: state.current,
  playing: state.playing,
}))(TrendingContainer);
