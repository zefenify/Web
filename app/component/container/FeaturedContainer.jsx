import React, { Component } from 'react';
import { bool, string, shape } from 'prop-types';

import { BASE } from '@app/config/api';
import { PLAY, TOGGLE_PLAY_PAUSE } from '@app/redux/constant/wolfCola';
import sameSongList from '@app/util/sameSongList';
import { human } from '@app/util/time';
import api from '@app/util/api';

import DJKhaled from '@app/component/hoc/DJKhaled';

import HeaderSongs from '@app/component/presentational/HeaderSongs';

import store from '@app/redux/store';

class FeaturedContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      featured: null,
      duration: {
        hours: 0,
        minutes: 0,
        seconds: 0,
      },
      playingFeatured: false,
    };
    this.togglePlayPauseAll = this.togglePlayPauseAll.bind(this);
    this.togglePlayPauseSong = this.togglePlayPauseSong.bind(this);
  }

  componentDidMount() {
    // calling...
    api(`${BASE}playlist/${this.props.match.params.id}`, (cancel) => {
      this.cancelRequest = cancel;
    }).then((data) => {
      this.setState(() => ({
        featured: data,
        duration: human(data.playlist_track.reduce((totalD, track) => totalD + track.track_track.s3_meta.duration, 0), true),
      }), () => {
        const { initialQueue } = store.getState();

        if (initialQueue.length === 0 || this.state.featured.playlist_track.length === 0) {
          this.setState(() => ({
            playingFeatured: false,
          }));

          return;
        }

        if (sameSongList(this.state.featured.playlist_track, initialQueue)) {
          this.setState(() => ({
            playingFeatured: true,
          }));
        } else {
          this.setState(() => ({
            playingFeatured: false,
          }));
        }
      });
    }, () => { /* handle fetch error */ });
  }

  componentWillUnmount() {
    this.cancelRequest();
  }

  togglePlayPauseAll() {
    if (this.state.featured === null) {
      return;
    }

    // booting playlist
    if (this.props.current === null || this.state.playingFeatured === false) {
      store.dispatch({
        type: PLAY,
        payload: {
          play: this.state.featured.playlist_track[0],
          queue: this.state.featured.playlist_track,
          initialQueue: this.state.featured.playlist_track,
        },
      });

      this.setState(() => ({
        playingFeatured: true,
      }));
      // resuming / pausing playlist
    } else if (this.props.current !== null) {
      store.dispatch({
        type: TOGGLE_PLAY_PAUSE,
      });
    }
  }

  togglePlayPauseSong(songId) {
    if (this.props.current !== null && this.props.current.track_id === songId) {
      store.dispatch({
        type: TOGGLE_PLAY_PAUSE,
      });

      return;
    }

    const songIdIndex = this.state.featured.playlist_track.findIndex(song => song.track_id === songId);

    if (songIdIndex === -1) {
      return;
    }

    store.dispatch({
      type: PLAY,
      payload: {
        play: this.state.featured.playlist_track[songIdIndex],
        queue: this.state.featured.playlist_track,
        initialQueue: this.state.featured.playlist_track,
      },
    });

    this.setState(() => ({
      playingFeatured: true,
    }));
  }

  render() {
    if (this.state.featured === null) {
      return null;
    }

    return (
      <HeaderSongs
        playlist={false}
        current={this.props.current}
        playing={this.props.playing}
        playingSongs={this.props.playing && this.state.playingFeatured}
        duration={this.state.duration}
        togglePlayPauseAll={this.togglePlayPauseAll}
        togglePlayPauseSong={this.togglePlayPauseSong}
        {...this.state.featured}
      />
    );
  }
}

FeaturedContainer.propTypes = {
  current: shape({}),
  playing: bool,
  match: shape({
    params: shape({
      id: string,
    }),
  }).isRequired,
};

FeaturedContainer.defaultProps = {
  current: null,
  playing: false,
};

module.exports = DJKhaled('current', 'playing')(FeaturedContainer);
