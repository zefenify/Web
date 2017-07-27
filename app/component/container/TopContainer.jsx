import React, { Component } from 'react';
import { string, bool, func, shape } from 'prop-types';

import { BASE } from '@app/config/api';
import { PLAY, TOGGLE_PLAY_PAUSE } from '@app/redux/constant/wolfCola';
import sameSongList from '@app/util/sameSongList';
import { human } from '@app/util/time';

import api from '@app/util/api';
import store from '@app/redux/store';

import DJkhaled from '@app/component/hoc/DJkhaled';
import Top from '@app/component/presentational/Top';

class TopContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      most: null,
      duration: {
        hours: 0,
        minutes: 0,
        seconds: 0,
      },
      playingTheSameMost: false,
    };

    this.togglePlayPauseAll = this.togglePlayPauseAll.bind(this);
    this.togglePlayPauseSong = this.togglePlayPauseSong.bind(this);
  }

  componentDidMount() {
    if (this.props.match.params.category === undefined) {
      this.props.history.replace('/top/recent');
      return;
    }

    this.loadSongs(this.props.match.params.category);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.category === undefined) {
      this.props.history.replace('/top/recent');
      return;
    }

    if (nextProps.match.params.category !== this.props.match.params.category) {
      this.loadSongs(nextProps.match.params.category);
    }
  }

  loadSongs(filter) {
    if (['recent', 'liked', 'played'].includes(filter) === false) {
      this.props.history.replace('/top/recent');
      return;
    }

    // this makes sure tab navigation clears previous render
    this.setState(() => ({
      most: null,
    }));

    api(`${BASE}/json/list/most${filter}.json`)
      .then((data) => {
        this.setState(() => ({
          most: data,
          duration: human(data.songs.reduce((totalD, song) => totalD + song.playtime, 0), true),
        }), () => {
          const { initialQueue } = store.getState();

          if (initialQueue.length === 0 || this.state.most.songs.length === 0) {
            this.setState(() => ({
              playingTheSameMost: false,
            }));

            return;
          }

          if (sameSongList(this.state.most.songs, initialQueue)) {
            this.setState(() => ({
              playingTheSameMost: true,
            }));
          } else {
            this.setState(() => ({
              playingTheSameMost: false,
            }));
          }
        });
      });
  }

  togglePlayPauseAll() {
    if (this.state.most === null) {
      return;
    }

    // booting playlist
    if (this.props.current === null || this.state.playingTheSameMost === false) {
      store.dispatch({
        type: PLAY,
        payload: {
          play: this.state.most.songs[0],
          queue: this.state.most.songs,
          initialQueue: this.state.most.songs,
        },
      });

      this.setState(() => ({
        playingTheSameMost: true,
      }));
      // resuming / pausing playlist
    } else if (this.props.current !== null) {
      store.dispatch({
        type: TOGGLE_PLAY_PAUSE,
      });
    }
  }

  togglePlayPauseSong(songId) {
    if (this.props.current !== null && this.props.current.songId === songId) {
      store.dispatch({
        type: TOGGLE_PLAY_PAUSE,
      });

      return;
    }

    const songIdIndex = this.state.most.songs.findIndex(song => song.songId === songId);

    if (songIdIndex === -1) {
      return;
    }

    store.dispatch({
      type: PLAY,
      payload: {
        play: this.state.most.songs[songIdIndex],
        queue: this.state.most.songs,
        initialQueue: this.state.most.songs,
      },
    });

    this.setState(() => ({
      playingTheSameMost: true,
    }));
  }

  render() {
    return (
      <Top
        most={this.state.most}
        current={this.props.current}
        playing={this.props.playing}
        duration={this.state.duration}
        playingTheSameMost={this.state.playingTheSameMost}
        togglePlayPauseAll={this.togglePlayPauseAll}
        togglePlayPauseSong={this.togglePlayPauseSong}
      />
    );
  }
}

TopContainer.propTypes = {
  playing: bool,
  current: shape({}),
  history: shape({
    replace: func,
  }).isRequired,
  match: shape({
    params: shape({
      id: string,
    }),
  }).isRequired,
};

TopContainer.defaultProps = {
  playing: false,
  current: null,
};

module.exports = DJkhaled('current', 'playing')(TopContainer);
