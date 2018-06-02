import React, { Component } from 'react';
import { bool, shape, oneOfType, string } from 'prop-types';

import { CONTEXT_MENU_ON_REQUEST, CONTEXT_TRACK, CONTEXT_ALBUM } from '@app/redux/constant/contextMenu';
import { PLAY_REQUEST, PLAY_PAUSE_REQUEST } from '@app/redux/constant/wolfCola';

import store from '@app/redux/store';
import { urlCurrentPlaying } from '@app/redux/action/urlCurrentPlaying';
import albumsBuild from '@app/redux/selector/albumsBuild';

import Albums from '@app/component/presentational/Albums';
import { withContext } from '@app/component/context/context';

class AlbumsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = albumsBuild(props);

    this.albumPlayPause = this.albumPlayPause.bind(this);
    this.albumsPlayPause = this.albumsPlayPause.bind(this);
    this.trackPlayPause = this.trackPlayPause.bind(this);
    this.contextMenuAlbum = this.contextMenuAlbum.bind(this);
    this.contextMenuTrack = this.contextMenuTrack.bind(this);
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

    this.setState(() => ({
      albumsPlayingId: albumId,
    }));

    store.dispatch(urlCurrentPlaying(`${this.props.match.url}/${albumId}`));
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

      store.dispatch(urlCurrentPlaying(this.props.match.url));
    } else if (this.props.current !== null) {
      // -> resuming / pausing album
      store.dispatch({
        type: PLAY_PAUSE_REQUEST,
      });
    }
  }

  trackPlayPause(trackId) {
    if (this.props.current !== null && this.props.current.track_id === trackId) {
      store.dispatch({
        type: PLAY_PAUSE_REQUEST,
      });

      return;
    }

    const trackIdIndex = this.state.albums[0].relationships.track.findIndex(track => track.track_id === trackId);

    if (trackIdIndex === -1) {
      return;
    }

    store.dispatch({
      type: PLAY_REQUEST,
      payload: {
        play: this.state.albums[0].relationships.track[trackIdIndex],
        queue: this.state.albums[0].relationships.track,
        queueInitial: this.state.albums[0].relationships.track,
      },
    });

    this.setState(() => ({
      playingAlbum: true,
    }));

    store.dispatch(urlCurrentPlaying(this.props.match.url));
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

  contextMenuTrack(trackId) {
    const trackIndex = this.state.albums[0].relationships.track.findIndex(track => track.track_id === trackId);

    if (trackIndex === -1) {
      return;
    }

    store.dispatch({
      type: CONTEXT_MENU_ON_REQUEST,
      payload: {
        type: CONTEXT_TRACK,
        payload: this.state.albums[0].relationships.track[trackIndex],
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
        trackPlayPause={this.trackPlayPause}
        contextMenuAlbum={this.contextMenuAlbum}
        contextMenuTrack={this.contextMenuTrack}
      />
    );
  }
}

AlbumsContainer.getDerivedStateFromProps = nextProps => albumsBuild(nextProps);

AlbumsContainer.propTypes = {
  playing: bool,
  current: shape({}),
  match: shape({
    url: string,
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

module.exports = withContext('user', 'song', 'playing', 'current', 'queueInitial')(AlbumsContainer);
