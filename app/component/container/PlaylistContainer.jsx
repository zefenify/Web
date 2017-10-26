import React, { Component } from 'react';
import { bool, string, shape } from 'prop-types';

import { BASE } from '@app/config/api';
import { PLAY, TOGGLE_PLAY_PAUSE } from '@app/redux/constant/wolfCola';
import { SET_CONTEXT_MENU_ON, CONTEXT_SONG, CONTEXT_PLAYLIST } from '@app/redux/constant/contextMenu';
import sameSongList from '@app/util/sameSongList';
import { human } from '@app/util/time';
import api from '@app/util/api';
import track from '@app/util/track';

import DJKhaled from '@app/component/hoc/DJKhaled';

import HeaderSongs from '@app/component/presentational/HeaderSongs';

import store from '@app/redux/store';

class PlaylistContainer extends Component {
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
    this.contextMenuPlaylist = this.contextMenuPlaylist.bind(this);
    this.contextMenuSong = this.contextMenuSong.bind(this);
  }

  componentDidMount() {
    api(`${BASE}playlist/${this.props.match.params.id}`, (cancel) => {
      this.cancelRequest = cancel;
    }).then((data) => {
      // mapping track...
      const playlistTrack = Object.assign({}, data.data, {
        playlist_track: data.data.playlist_track.map(trackId => data.included.track[trackId]),
      });
      const tracks = track(playlistTrack.playlist_track, data.included);

      this.setState(() => ({
        featured: Object.assign({}, data.data, {
          playlist_cover: data.included.s3[data.data.playlist_cover],
          playlist_track: tracks,
        }),
        duration: human(tracks.reduce((totalD, t) => totalD + t.track_track.s3_meta.duration, 0), true),
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

  contextMenuPlaylist() {
    store.dispatch({
      type: SET_CONTEXT_MENU_ON,
      payload: {
        contextType: CONTEXT_PLAYLIST,
        payload: this.state.featured,
      },
    });
  }

  contextMenuSong(songId) {
    const songIndex = this.state.featured.playlist_track.findIndex(song => song.track_id === songId);

    if (songIndex === -1) {
      return;
    }

    store.dispatch({
      type: SET_CONTEXT_MENU_ON,
      payload: {
        type: CONTEXT_SONG,
        payload: this.state.featured.playlist_track[songIndex],
      },
    });
  }

  render() {
    if (this.state.featured === null) {
      return null;
    }

    return (
      <HeaderSongs
        type={this.props.match.params.type}
        current={this.props.current}
        playing={this.props.playing}
        playingSongs={this.props.playing && this.state.playingFeatured}
        duration={this.state.duration}
        togglePlayPauseAll={this.togglePlayPauseAll}
        togglePlayPauseSong={this.togglePlayPauseSong}
        title={this.state.featured.playlist_name}
        description={this.state.featured.playlist_description}
        cover={this.state.featured.playlist_cover}
        songs={this.state.featured.playlist_track}
        contextMenuPlaylist={this.contextMenuPlaylist}
        contextMenuSong={this.contextMenuSong}
      />
    );
  }
}

PlaylistContainer.propTypes = {
  current: shape({}),
  playing: bool,
  match: shape({
    params: shape({
      id: string,
    }),
  }).isRequired,
};

PlaylistContainer.defaultProps = {
  current: null,
  playing: false,
};

module.exports = DJKhaled('current', 'playing')(PlaylistContainer);
