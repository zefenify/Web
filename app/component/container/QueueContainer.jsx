import React, { Component } from 'react';
import { bool, shape, arrayOf, string } from 'prop-types';

import { PLAY_REQUEST, PLAY_PAUSE_REQUEST } from '@app/redux/constant/wolfCola';
import { CONTEXT_MENU_ON_REQUEST, CONTEXT_TRACK } from '@app/redux/constant/contextMenu';

import store from '@app/redux/store';
import tracksDuration from '@app/redux/selector/tracksDuration';
import { urlCurrentPlaying } from '@app/redux/action/urlCurrentPlaying';

import Tracks from '@app/component/presentational/Tracks';
import { withContext } from '@app/component/context/context';

class QueueContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      durationTotal: tracksDuration({ tracks: props.queueNext }),
    };

    this.queueNextPlayPause = this.queueNextPlayPause.bind(this);
    this.trackPlayPause = this.trackPlayPause.bind(this);
    this.contextMenuTrack = this.contextMenuTrack.bind(this);
  }

  queueNextPlayPause() {
    if (this.state.queueNextPlaying === true) {
      store.dispatch({
        type: PLAY_PAUSE_REQUEST,
      });

      return;
    }

    store.dispatch({
      type: PLAY_REQUEST,
      payload: {
        play: this.props.queueNext[0],
        queue: this.props.queueNext,
        queueInitial: this.props.queueInitial,
      },
    });

    store.dispatch(urlCurrentPlaying(this.props.match.url));
  }

  trackPlayPause(trackId) {
    if (this.props.current === null || this.props.current.track_id !== trackId) {
      const trackIndex = this.props.queueNext.findIndex(track => track.track_id === trackId);

      if (trackIndex === -1) {
        return;
      }

      store.dispatch({
        type: PLAY_REQUEST,
        payload: {
          play: this.props.queueNext[trackIndex],
          queue: this.props.queueNext,
          queueInitial: this.props.queueInitial,
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
    const trackIndex = this.props.queueNext.findIndex(track => track.track_id === trackId);

    if (trackIndex === -1) {
      return;
    }

    store.dispatch({
      type: CONTEXT_MENU_ON_REQUEST,
      payload: {
        type: CONTEXT_TRACK,
        payload: this.props.queueNext[trackIndex],
      },
    });
  }

  render() {
    return (
      <Tracks
        titleMain="Queue"
        titleEmpty="Queue is empty...spice it up እንጂ"
        playing={this.props.playing}
        current={this.props.current}
        tracks={this.props.queueNext}
        durationTotal={this.state.durationTotal}
        tracksPlaying={false}
        tracksPlayPauseButtonShow={false}
        tracksPlayPause={this.queueNextPlayPause}
        trackPlayPause={this.trackPlayPause}
        contextMenuTrack={this.contextMenuTrack}
      />
    );
  }
}

QueueContainer.getDerivedStateFromProps = nextProps => ({
  durationTotal: tracksDuration({ tracks: nextProps.queueNext }),
});

QueueContainer.propTypes = {
  playing: bool,
  current: shape({}),
  queueNext: arrayOf(shape({})),
  queueInitial: arrayOf(shape({})),
  match: shape({
    url: string,
  }).isRequired,
};

QueueContainer.defaultProps = {
  playing: false,
  current: null,
  queueNext: [],
  queueInitial: [],
};

module.exports = withContext('playing', 'current', 'queueNext', 'queueInitial', 'totalDuration')(QueueContainer);
