// Congratulations!? you played yourself
// DJ K...

import React, { Component } from 'react';
import { bool, shape, arrayOf, string } from 'prop-types';

import { PLAY_REQUEST, PLAY_PAUSE_REQUEST } from '@app/redux/constant/wolfCola';
import { CONTEXT_MENU_ON_REQUEST, CONTEXT_TRACK } from '@app/redux/constant/contextMenu';

import store from '@app/redux/store';
import historyDuration from '@app/redux/selector/historyDuration';
import historyPlaying from '@app/redux/selector/historyPlaying';
import { urlCurrentPlaying } from '@app/redux/action/urlCurrentPlaying';

import Recent from '@app/component/presentational/Recent';
import { withContext } from '@app/component/context/context';

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
  match: shape({
    url: string,
  }).isRequired,
};

RecentContainer.defaultProps = {
  playing: false,
  current: null,
  history: [],
};

// module.exports = DJKhaled(connect(state => ({
//   playing: state.playing,
//   current: state.current,
//   history: state.history,
//   queueInitial: state.queueInitial,
//   totalDuration: historyDuration(state),
//   historyPlaying: historyPlaying(state),
// }))(RecentContainer));

module.exports = withContext('playing', 'current', 'history', 'queueInitial', 'totalDuration')(RecentContainer);
