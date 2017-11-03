import React, { Component } from 'react';
import { bool, shape } from 'prop-types';
import { connect } from 'react-redux';

import { NOTIFICATION_ON_REQUEST } from '@app/redux/constant/notification';
import { SURPRISE_ME } from '@app/config/api';
import { PLAY_REQUEST, PLAY_PAUSE_REQUEST } from '@app/redux/constant/wolfCola';
import sameSongList from '@app/util/sameSongList';
import { human } from '@app/util/time';
import api from '@app/util/api';
import { loading } from '@app/redux/action/loading';
import store from '@app/redux/store';

import HeaderSongs from '@app/component/presentational/HeaderSongs';

class SupriseContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      surprise: null,
      duration: {
        hours: 0,
        minutes: 0,
        seconds: 0,
      },
      playingSurprise: false,
    };
    this.togglePlayPauseAll = this.togglePlayPauseAll.bind(this);
    this.togglePlayPauseSong = this.togglePlayPauseSong.bind(this);
  }

  componentDidMount() {
    // calling...
    store.dispatch(loading(true));
    api(SURPRISE_ME, undefined, (cancel) => {
      this.cancelRequest = cancel;
    })
      .then((data) => {
        store.dispatch(loading(false));
        this.setState(() => ({
          surprise: data,
          duration: human(data.songs.reduce((totalD, song) => totalD + song.playtime, 0), true),
        }), () => {
          const { queueInitial } = store.getState();

          if (queueInitial.length === 0 || this.state.surprise.songs.length === 0) {
            this.setState(() => ({
              playingSurprise: false,
            }));
            return;
          }

          if (sameSongList(this.state.surprise.songs, queueInitial)) {
            this.setState(() => ({
              playingSurprise: true,
            }));
          } else {
            this.setState(() => ({
              playingSurprise: false,
            }));
          }
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
            message: 'ይቅርታ, unable to fetch Surprise',
          },
        });
      });
  }

  componentWillUnmount() {
    store.dispatch(loading(false));
    this.cancelRequest();
  }

  togglePlayPauseAll() {
    if (this.state.surprise === null) {
      return;
    }

    // booting playlist
    if (this.props.current === null || this.state.playingSurprise === false) {
      store.dispatch({
        type: PLAY_REQUEST,
        payload: {
          play: this.state.surprise.songs[0],
          queue: this.state.surprise.songs,
          queueInitial: this.state.surprise.songs,
        },
      });

      this.setState(() => ({
        playingSurprise: true,
      }));
      // resuming / pausing playlist
    } else if (this.state.surprise !== null) {
      store.dispatch({
        type: PLAY_PAUSE_REQUEST,
      });
    }
  }

  togglePlayPauseSong(songId) {
    if (this.props.current !== null && this.props.current.songId === songId) {
      store.dispatch({
        type: PLAY_PAUSE_REQUEST,
      });

      return;
    }

    const songIdIndex = this.state.surprise.songs.findIndex(song => song.songId === songId);

    if (songIdIndex === -1) {
      return;
    }

    store.dispatch({
      type: PLAY_REQUEST,
      payload: {
        play: this.state.surprise.songs[songIdIndex],
        queue: this.state.surprise.songs,
        queueInitial: this.state.surprise.songs,
      },
    });

    this.setState(() => ({
      playingSurprise: true,
    }));
  }

  render() {
    if (this.state.surprise === null) {
      return null;
    }

    return (
      <HeaderSongs
        current={this.props.current}
        duration={this.state.duration}
        playing={this.props.playing}
        playingSongs={this.props.playing && this.state.playingSurprise}
        togglePlayPauseAll={this.togglePlayPauseAll}
        togglePlayPauseSong={this.togglePlayPauseSong}
        {...this.state.surprise}
      />
    );
  }
}

SupriseContainer.propTypes = {
  current: shape({}),
  playing: bool,
};

SupriseContainer.defaultProps = {
  current: null,
  playing: false,
};

module.exports = connect(state => ({
  playing: state.playing,
  current: state.current,
}))(SupriseContainer);
