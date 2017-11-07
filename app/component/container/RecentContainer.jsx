// Congratulations!? you played yourself
// DJ K...

import React, { Component } from 'react';
import { bool, shape, arrayOf } from 'prop-types';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';

import { PLAY_REQUEST, PLAY_PAUSE_REQUEST } from '@app/redux/constant/wolfCola';
import { CONTEXT_MENU_ON_REQUEST, CONTEXT_SONG } from '@app/redux/constant/contextMenu';

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
    this.songPlayPause = this.songPlayPause.bind(this);
    this.contextMenuSong = this.contextMenuSong.bind(this);
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

  songPlayPause(songId) {
    if (this.props.current === null || this.props.current.track_id !== songId) {
      const songIndex = this.props.history.findIndex(track => track.track_id === songId);

      if (songIndex === -1) {
        return;
      }

      store.dispatch({
        type: PLAY_REQUEST,
        payload: {
          play: this.props.history[songIndex],
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

  contextMenuSong(songId) {
    const songIndex = this.props.history.findIndex(track => track.track_id === songId);

    if (songIndex === -1) {
      return;
    }

    store.dispatch({
      type: CONTEXT_MENU_ON_REQUEST,
      payload: {
        type: CONTEXT_SONG,
        payload: this.props.history[songIndex],
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
        songPlayPause={this.songPlayPause}
        contextMenuSong={this.contextMenuSong}
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
