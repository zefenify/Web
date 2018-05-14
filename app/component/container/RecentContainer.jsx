import React, { Component } from 'react';
import { bool, shape, arrayOf, string } from 'prop-types';

import { PLAY_REQUEST, PLAY_PAUSE_REQUEST } from '@app/redux/constant/wolfCola';
import { CONTEXT_MENU_ON_REQUEST, CONTEXT_TRACK } from '@app/redux/constant/contextMenu';

import store from '@app/redux/store';
import tracksDuration from '@app/redux/selector/tracksDuration';
import tracksPlaying from '@app/redux/selector/tracksPlaying';
import { urlCurrentPlaying } from '@app/redux/action/urlCurrentPlaying';

import Tracks from '@app/component/presentational/Tracks';
import { withContext } from '@app/component/context/context';

class RecentContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      durationTotal: tracksDuration({ tracks: props.history }),
      historyPlaying: tracksPlaying({ queueInitial: props.queueInitial, tracks: props.history }),
    };

    this.historyPlayPause = this.historyPlayPause.bind(this);
    this.trackPlayPause = this.trackPlayPause.bind(this);
    this.contextMenuTrack = this.contextMenuTrack.bind(this);
  }

  historyPlayPause() {
    if (this.state.historyPlaying === true) {
      store.dispatch({
        type: PLAY_PAUSE_REQUEST,
      });

      return;
    }

    store.dispatch({
      type: PLAY_REQUEST,
      payload: {
        play: this.props.history[0],
        queue: this.props.history,
        queueInitial: this.props.history,
      },
    });

    store.dispatch(urlCurrentPlaying(this.props.match.url));
  }

  trackPlayPause(trackId) {
    if (this.props.current === null || this.props.current.track_id !== trackId) {
      const trackIndex = this.props.history.findIndex(track => track.track_id === trackId);

      if (trackIndex === -1) {
        return;
      }

      store.dispatch({
        type: PLAY_REQUEST,
        payload: {
          play: this.props.history[trackIndex],
          queue: this.props.history,
          queueInitial: this.props.history,
        },
      });

      store.dispatch(urlCurrentPlaying(this.props.match.url));
      return;
    }

    store.dispatch({
      type: PLAY_PAUSE_REQUEST,
    });
  }

  contextMenuTrack(trackId) {
    const trackIndex = this.props.history.findIndex(track => track.track_id === trackId);

    if (trackIndex === -1) {
      return;
    }

    store.dispatch({
      type: CONTEXT_MENU_ON_REQUEST,
      payload: {
        type: CONTEXT_TRACK,
        payload: this.props.history[trackIndex],
      },
    });
  }

  render() {
    return (
      <Tracks
        titleMain="Recently Played"
        titleEmpty="You have no recently played songs...yet"
        playing={this.props.playing}
        current={this.props.current}
        tracks={this.props.history}
        durationTotal={this.state.durationTotal}
        tracksPlaying={this.state.historyPlaying}
        tracksPlayPause={this.historyPlayPause}
        trackPlayPause={this.trackPlayPause}
        contextMenuTrack={this.contextMenuTrack}
      />
    );
  }
}

RecentContainer.getDerivedStateFromProps = nextProps => ({
  durationTotal: tracksDuration({ tracks: nextProps.history }),
  historyPlaying: tracksPlaying({ queueInitial: nextProps.queueInitial, tracks: nextProps.history }),
});

RecentContainer.propTypes = {
  playing: bool,
  current: shape({}),
  history: arrayOf(shape({})),
  queueInitial: arrayOf(shape({})),
  match: shape({
    url: string,
  }).isRequired,
};

RecentContainer.defaultProps = {
  playing: false,
  current: null,
  history: [],
  queueInitial: [],
};

module.exports = withContext('playing', 'current', 'history', 'queueInitial', 'totalDuration')(RecentContainer);
