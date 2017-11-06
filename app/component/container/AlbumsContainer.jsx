import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bool, shape, oneOfType, string } from 'prop-types';

import { CONTEXT_MENU_ON_REQUEST, CONTEXT_SONG, CONTEXT_ALBUM } from '@app/redux/constant/contextMenu';
import { PLAY_REQUEST, PLAY_PAUSE_REQUEST } from '@app/redux/constant/wolfCola';

import store from '@app/redux/store';
import albumsBuild from '@app/redux/selector/albumsBuild';

import Albums from '@app/component/presentational/Albums';

class AlbumsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = albumsBuild(props);

    this.albumPlayPause = this.albumPlayPause.bind(this);
    this.albumsPlayPause = this.albumsPlayPause.bind(this);
    this.songPlayPause = this.songPlayPause.bind(this);
    this.contextMenuAlbum = this.contextMenuAlbum.bind(this);
    this.contextMenuSong = this.contextMenuSong.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(() => albumsBuild(nextProps));
  }

  albumPlayPause(albumId) {
    if (albumId === this.state.albumsPlayingId) {
      store.dispatch({
        type: PLAY_PAUSE_REQUEST,
      });

      return;
    }

    const albumIndex = this.state.albums.findIndex(album => album.album_id === albumId);

    if (albumIndex === -1) {
      return;
    }

    store.dispatch({
      type: PLAY_REQUEST,
      payload: {
        play: this.state.albums[albumIndex].relationships.track[0],
        queue: this.state.albums[albumIndex].relationships.track,
        queueInitial: this.state.albums[albumIndex].relationships.track,
      },
    });

    this.setState(() => ({ albumsPlayingId: albumId }));
  }

  albumsPlayPause() {
    if (this.state.albums === null) {
      return;
    }

    if (this.props.current === null || this.state.albumPlaying === false) {
      // -> booting playlist
      store.dispatch({
        type: PLAY_REQUEST,
        payload: {
          play: this.state.albums[0].relationships.track[0],
          queue: this.state.albums[0].relationships.track,
          queueInitial: this.state.albums[0].relationships.track,
        },
      });

      this.setState(() => ({
        albumPlaying: true,
      }));
    } else if (this.props.current !== null) {
      // -> resuming / pausing album
      store.dispatch({
        type: PLAY_PAUSE_REQUEST,
      });
    }
  }

  songPlayPause(songId) {
    if (this.props.current !== null && this.props.current.track_id === songId) {
      store.dispatch({
        type: PLAY_PAUSE_REQUEST,
      });

      return;
    }

    const songIdIndex = this.state.albums[0].relationships.track.findIndex(song => song.track_id === songId);

    if (songIdIndex === -1) {
      return;
    }

    store.dispatch({
      type: PLAY_REQUEST,
      payload: {
        play: this.state.albums[0].relationships.track[songIdIndex],
        queue: this.state.albums[0].relationships.track,
        queueInitial: this.state.albums[0].relationships.track,
      },
    });

    this.setState(() => ({
      playingAlbum: true,
    }));
  }

  contextMenuAlbum() {
    store.dispatch({
      type: CONTEXT_MENU_ON_REQUEST,
      payload: {
        type: CONTEXT_ALBUM,
        payload: this.state.albums[0],
      },
    });
  }

  contextMenuSong(songId) {
    const songIndex = this.state.albums[0].relationships.track.findIndex(song => song.track_id === songId);

    if (songIndex === -1) {
      return;
    }

    store.dispatch({
      type: CONTEXT_MENU_ON_REQUEST,
      payload: {
        type: CONTEXT_SONG,
        payload: this.state.albums[0].relationships.track[songIndex],
      },
    });
  }

  render() {
    return (
      <Albums
        user={this.props.user}
        playing={this.props.playing}
        current={this.props.current}
        albumId={this.props.match.params.id}
        albums={this.state.albums}
        albumPlaying={this.state.albumPlaying}
        duration={this.state.duration}
        albumsPlayingId={this.state.albumsPlayingId}
        albumPlayPause={this.albumPlayPause}
        albumsPlayPause={this.albumsPlayPause}
        songPlayPause={this.songPlayPause}
        contextMenuAlbum={this.contextMenuAlbum}
        contextMenuSong={this.contextMenuSong}
      />
    );
  }
}

AlbumsContainer.propTypes = {
  playing: bool,
  current: shape({}),
  match: shape({
    params: shape({
      id: oneOfType([shape({}), string]),
    }),
  }),
  user: shape({}),
};

AlbumsContainer.defaultProps = {
  playing: false,
  current: null,
  match: { params: { id: undefined } },
  user: null,
};

module.exports = connect(state => ({
  user: state.user,
  song: state.song,
  playing: state.playing,
  current: state.current,
  queueInitial: state.queueInitial,
}))(AlbumsContainer);
