import React, { Component } from 'react';
import { bool, shape, string } from 'prop-types';

import { PLAY_REQUEST, PLAY_PAUSE_REQUEST } from '@app/redux/constant/wolfCola';
import { CONTEXT_MENU_ON_REQUEST, CONTEXT_TRACK } from '@app/redux/constant/contextMenu';

import store from '@app/redux/store';
import songDuration from '@app/redux/selector/songDuration';
import songPlaying from '@app/redux/selector/songPlaying';
import songTrack from '@app/redux/selector/songTrack';
import { urlCurrentPlaying } from '@app/redux/action/urlCurrentPlaying';

import Songs from '@app/component/presentational/Songs';
import { withContext } from '@app/component/context/context';

class SongsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      songs: songTrack(props),
      totalDuration: songDuration(props),
      songsPlaying: songPlaying(props),
    };

    this.songsPlayPause = this.songsPlayPause.bind(this);
    this.trackPlayPause = this.trackPlayPause.bind(this);
    this.contextMenuTrack = this.contextMenuTrack.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(() => ({
      current: nextProps.current,
      playing: nextProps.playing,
      user: nextProps.user,
      songs: songTrack(nextProps),
      totalDuration: songDuration(nextProps),
      songsPlaying: songPlaying(nextProps),
    }));
  }

  songsPlayPause() {
    if (this.state.songsPlaying === true) {
      store.dispatch({
        type: PLAY_PAUSE_REQUEST,
      });

      return;
    }

    store.dispatch({
      type: PLAY_REQUEST,
      payload: {
        play: this.state.songs[0],
        queue: this.state.songs,
        queueInitial: this.state.songs,
      },
    });

    store.dispatch(urlCurrentPlaying(this.props.match.url));
  }

  trackPlayPause(trackId) {
    if (this.props.current !== null && this.props.current.track_id === trackId) {
      store.dispatch({
        type: PLAY_PAUSE_REQUEST,
      });

      return;
    }

    const trackIndex = this.state.songs.findIndex(t => t.track_id === trackId);

    if (trackIndex === -1) {
      return;
    }

    store.dispatch({
      type: PLAY_REQUEST,
      payload: {
        play: this.state.songs[trackIndex],
        queue: this.state.songs,
        queueInitial: this.state.songs,
      },
    });

    this.setState(() => ({
      songsPlaying: true,
    }));

    store.dispatch(urlCurrentPlaying(this.props.match.url));
  }

  contextMenuTrack(trackId) {
    if (this.state.songs === null) {
      return;
    }

    const trackIndex = this.state.songs.findIndex(t => t.track_id === trackId);

    if (trackIndex === -1) {
      return;
    }

    store.dispatch({
      type: CONTEXT_MENU_ON_REQUEST,
      payload: {
        type: CONTEXT_TRACK,
        payload: this.state.songs[trackIndex],
      },
    });
  }

  render() {
    return (
      <Songs
        current={this.props.current}
        playing={this.props.playing}
        user={this.props.user}
        songs={this.state.songs}
        totalDuration={this.state.totalDuration}
        songsPlaying={this.state.songsPlaying}
        songsPlayPause={this.songsPlayPause}
        trackPlayPause={this.trackPlayPause}
        contextMenuTrack={this.contextMenuTrack}
      />
    );
  }
}

SongsContainer.propTypes = {
  playing: bool,
  current: shape({}),
  user: shape({}),
  match: shape({
    url: string,
  }).isRequired,
};

SongsContainer.defaultProps = {
  playing: false,
  current: null,
  user: null,
};

module.exports = withContext('current', 'playing', 'user', 'song', 'queueInitial', 'history')(SongsContainer);
