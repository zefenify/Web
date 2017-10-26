import React, { Component } from 'react';
import { bool, string, shape } from 'prop-types';

import { BASE } from '@app/config/api';
import { PLAY, TOGGLE_PLAY_PAUSE } from '@app/redux/constant/wolfCola';
import { SET_CONTEXT_MENU_ON, CONTEXT_SONG, CONTEXT_ALBUM } from '@app/redux/constant/contextMenu';
import sameSongList from '@app/util/sameSongList';
import { human } from '@app/util/time';
import api from '@app/util/api';
import track from '@app/util/track';

import DJKhaled from '@app/component/hoc/DJKhaled';

import Album from '@app/component/presentational/Album';

import store from '@app/redux/store';

class AlbumContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      album: null,
      duration: {
        hours: 0,
        minutes: 0,
        seconds: 0,
      },
      playingAlbum: false,
    };
    this.togglePlayPauseAll = this.togglePlayPauseAll.bind(this);
    this.togglePlayPauseSong = this.togglePlayPauseSong.bind(this);
    this.contextMenuAlbum = this.contextMenuAlbum.bind(this);
    this.contextMenuSong = this.contextMenuSong.bind(this);
  }

  componentDidMount() {
    api(`${BASE}album/${this.props.match.params.id}`, (cancel) => {
      this.cancelRequest = cancel;
    }).then(({ data, included }) => {
      // mapping track...

      const paramTrackId = this.props.match.params.trackId;
      let albumTrack = [];

      if (paramTrackId === undefined) {
        albumTrack = data.relationships.track.map(trackId => included.track[trackId]);
      } else {
        albumTrack = data.relationships.track
          .filter(trackId => Number.parseInt(paramTrackId, 10) === trackId)
          .map(trackId => included.track[trackId]);
      }

      const tracks = track(albumTrack, included);

      this.setState(() => ({
        album: {
          album_id: data.album_id,
          album_name: data.album_name,
          album_artist: data.album_artist.map(artistId => included.artist[artistId]),
          album_cover: included.s3[data.album_cover],
          album_year: data.album_year,
          relationships: {
            track: tracks,
          },
        },
        duration: human(tracks.reduce((totalD, t) => totalD + t.track_track.s3_meta.duration, 0), true),
      }), () => {
        const { initialQueue } = store.getState();

        if (initialQueue.length === 0 || this.state.album.relationships.track.length === 0) {
          this.setState(() => ({
            playingAlbum: false,
          }));

          return;
        }

        this.setState(() => ({
          playingAlbum: sameSongList(this.state.album.relationships.track, initialQueue),
        }));
      });
    }, () => { /* handle fetch error */ });
  }

  componentWillUnmount() {
    this.cancelRequest();
  }

  togglePlayPauseAll() {
    if (this.state.album === null) {
      return;
    }

    // booting playlist
    if (this.props.current === null || this.state.playingAlbum === false) {
      store.dispatch({
        type: PLAY,
        payload: {
          play: this.state.album.relationships.track[0],
          queue: this.state.album.relationships.track,
          initialQueue: this.state.album.relationships.track,
        },
      });

      this.setState(() => ({
        playingAlbum: true,
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

    const songIdIndex = this.state.album.relationships.track.findIndex(song => song.track_id === songId);

    if (songIdIndex === -1) {
      return;
    }

    store.dispatch({
      type: PLAY,
      payload: {
        play: this.state.album.relationships.track[songIdIndex],
        queue: this.state.album.relationships.track,
        initialQueue: this.state.album.relationships.track,
      },
    });

    this.setState(() => ({
      playingAlbum: true,
    }));
  }

  contextMenuAlbum() {
    store.dispatch({
      type: SET_CONTEXT_MENU_ON,
      payload: {
        contextType: CONTEXT_ALBUM,
        payload: this.state.album,
      },
    });
  }

  contextMenuSong(songId) {
    const songIndex = this.state.album.relationships.track.findIndex(song => song.track_id === songId);

    if (songIndex === -1) {
      return;
    }

    store.dispatch({
      type: SET_CONTEXT_MENU_ON,
      payload: {
        type: CONTEXT_SONG,
        payload: this.state.album.relationships.track[songIndex],
      },
    });
  }

  render() {
    if (this.state.album === null) {
      return null;
    }

    return (
      <Album
        current={this.props.current}
        playing={this.props.playing}
        playingSongs={this.props.playing && this.state.playingAlbum}
        duration={this.state.duration}
        togglePlayPauseAll={this.togglePlayPauseAll}
        togglePlayPauseSong={this.togglePlayPauseSong}
        title={this.state.album.album_name}
        cover={this.state.album.album_cover}
        artist={this.state.album.album_artist}
        songs={this.state.album.relationships.track}
        contextMenuAlbum={this.contextMenuAlbum}
        contextMenuSong={this.contextMenuSong}
      />
    );
  }
}

AlbumContainer.propTypes = {
  current: shape({}),
  playing: bool,
  match: shape({
    params: shape({
      id: string,
    }),
  }).isRequired,
};

AlbumContainer.defaultProps = {
  current: null,
  playing: false,
};

module.exports = DJKhaled('current', 'playing')(AlbumContainer);
