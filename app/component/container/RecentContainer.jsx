// Congratulations!? you played yourself
// DJ K...

import React, { Component } from 'react';
import { bool, shape, arrayOf } from 'prop-types';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';

import { PLAY_REQUEST, PLAY_PAUSE_REQUEST } from '@app/redux/constant/wolfCola';
import { CONTEXT_MENU_ON_REQUEST, CONTEXT_TRACK } from '@app/redux/constant/contextMenu';

import store from '@app/redux/store';
import historyDuration from '@app/redux/selector/historyDuration';
import historyPlaying from '@app/redux/selector/historyPlaying';

import Recent from '@app/component/presentational/Recent';

class RecentContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalDuration: historyDuration(props),
      historyPlaying: historyPlaying(props),
    };

    this.historyPlayPause = this.historyPlayPause.bind(this);
    this.trackPlayPause = this.trackPlayPause.bind(this);
    this.contextMenuTrack = this.contextMenuTrack.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(() => ({
      totalDuration: historyDuration(nextProps),
      historyPlaying: historyPlaying(nextProps),
    }));
  }

  shouldComponentUpdate(nextProps) {
    return isEqual({
      history: this.props.history,
      queueInitial: this.props.queueInitial,
      playing: this.props.playing,
    }, {
      history: nextProps.history,
      queueInitial: nextProps.queueInitial,
      playing: nextProps.playing,
    }) === false;
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
      <Recent
        playing={this.props.playing}
        current={this.props.current}
        history={this.props.history}
        totalDuration={this.state.totalDuration}
        historyPlaying={this.state.historyPlaying}
        historyPlayPause={this.historyPlayPause}
        trackPlayPause={this.trackPlayPause}
        contextMenuTrack={this.contextMenuTrack}
      />
    );
  }
}

RecentContainer.propTypes = {
  playing: bool,
  current: shape({}),
  history: arrayOf(shape({})),
  queueInitial: arrayOf(shape({})),
};

RecentContainer.defaultProps = {
  playing: false,
  current: null,
  history: [],
  queueInitial: [],
};

module.exports = connect(state => ({
  playing: state.playing,
  current: state.current,
  history: state.history,
  queueInitial: state.queueInitial,
  totalDuration: historyDuration(state),
  historyPlaying: historyPlaying(state),
}))(RecentContainer);
