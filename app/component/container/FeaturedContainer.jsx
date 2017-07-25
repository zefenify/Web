import React, { Component } from 'react';
import { string, shape } from 'prop-types';

import { BASE } from '@app/config/api';
import { PLAY, TOGGLE_PLAY_PAUSE } from '@app/redux/constant/wolfCola';
import sameSongList from '@app/util/sameSongList';
import { human } from '@app/util/time';
import api from '@app/util/api';

import HeaderSongs from '@app/component/presentational/HeaderSongs';

import store from '@app/redux/store';

class FeaturedContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      featured: null,
      current: null,
      playing: false,
      initialQueue: [],
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
    api(`${BASE}/json/featured/${this.props.match.params.id}.json`)
      .then((data) => {
        this.setState(() => ({
          featured: data,
          duration: human(data.songs.reduce((totalD, song) => totalD + song.playtime, 0), true),
        }), () => {
          const { initialQueue } = store.getState();

          if (initialQueue.length === 0 || this.state.featured.songs.length === 0) {
            this.setState(() => ({ playingFeatured: false }));
            return;
          }

          if (sameSongList(this.state.featured.songs, initialQueue)) {
            this.setState(() => ({ playingFeatured: true }));
          } else {
            this.setState(() => ({ playingFeatured: false }));
          }
        });
      }, (err) => {
        /* handle fetch error */
      });

    this.unsubscribe = store.subscribe(() => {
      if (this.state.featured === null) {
        return;
      }

      const { playing, current, initialQueue } = store.getState();
      this.setState(() => ({ playing, current, initialQueue }));
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  togglePlayPauseAll() {
    if (this.state.featured === null) {
      return;
    }

    // booting playlist
    if (this.state.current === null || this.state.playingFeatured === false) {
      store.dispatch({
        type: PLAY,
        payload: {
          play: this.state.featured.songs[0],
          queue: this.state.featured.songs,
          initialQueue: this.state.featured.songs,
        },
      });

      this.setState(() => ({
        playingFeatured: true,
      }));
      // resuming / pausing playlist
    } else if (this.state.current !== null) {
      store.dispatch({
        type: TOGGLE_PLAY_PAUSE,
      });
    }
  }

  togglePlayPauseSong(songId) {
    if (this.state.current !== null && this.state.current.songId === songId) {
      store.dispatch({
        type: TOGGLE_PLAY_PAUSE,
      });

      return;
    }

    const songIdIndex = this.state.featured.songs.findIndex(song => song.songId === songId);

    if (songIdIndex === -1) {
      return;
    }

    store.dispatch({
      type: PLAY,
      payload: {
        play: this.state.featured.songs[songIdIndex],
        queue: this.state.featured.songs,
        initialQueue: this.state.featured.songs,
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
        current={this.state.current}
        playing={this.state.playing}
        playingSongs={this.state.playingFeatured}
        duration={this.state.duration}
        togglePlayPauseAll={this.togglePlayPauseAll}
        togglePlayPauseSong={this.togglePlayPauseSong}
        {...this.state.featured}
      />
    );
  }
}

FeaturedContainer.propTypes = {
  match: shape({
    params: shape({
      id: string,
    }),
  }).isRequired,
};

module.exports = FeaturedContainer;
