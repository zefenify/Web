import React, { Component } from 'react';
import { string, bool, shape } from 'prop-types';
import { connect } from 'react-redux';
import flatten from 'lodash/flatten';

import { PLAY_REQUEST, PLAY_PAUSE_REQUEST } from '@app/redux/constant/wolfCola';
import { CONTEXT_MENU_ON_REQUEST, CONTEXT_SONG, CONTEXT_ALBUM, CONTEXT_ARTIST } from '@app/redux/constant/contextMenu';

import store from '@app/redux/store';
import artistsBuild from '@app/redux/selector/artistsBuild';

import Artists from '@app/component/presentational/Artists';

class ArtistsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = artistsBuild(props);

    this.artistsPlayPause = this.artistsPlayPause.bind(this);
    this.artistPlayPause = this.artistPlayPause.bind(this);
    this.artistPlayPauseBuild = this.artistPlayPauseBuild.bind(this);
    this.songPlayPause = this.songPlayPause.bind(this);
    this.albumPlayPause = this.albumPlayPause.bind(this);
    this.contextMenuArtist = this.contextMenuArtist.bind(this);
    this.contextMenuAlbum = this.contextMenuAlbum.bind(this);
    this.contextMenuSong = this.contextMenuSong.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(() => artistsBuild(nextProps));
  }

  artistPlayPauseBuild(artistId) {
    if (this.state.artists.length === 0) {
      return;
    }

    const artistIndex = this.state.artists.findIndex(artist => artist.artist_id === artistId);

    if (artistIndex === -1) {
      return;
    }

    const songsFlatten = flatten(this.state.artists[artistIndex].relationships.album.map(album => album.relationships.track));

    if (this.props.current === null || this.state.artistPlayingId !== artistId) {
      store.dispatch({
        type: PLAY_REQUEST,
        payload: {
          play: songsFlatten[0],
          queue: songsFlatten,
          queueInitial: songsFlatten,
        },
      });

      return;
    }

    store.dispatch({
      type: PLAY_PAUSE_REQUEST,
    });

    this.setState(() => ({
      artistPlayingId: artistId || '',
      albumPlayingId: '',
    }));
  }

  artistsPlayPause(artistId) {
    this.artistPlayPauseBuild(artistId);
  }

  artistPlayPause() {
    this.artistPlayPauseBuild(this.props.match.params.id);
  }

  albumPlayPause(albumId) {
    if (this.props.current === null || this.state.albumPlayingId !== albumId) {
      const artistIndex = this.state.artists.findIndex(artist => artist.artist_id === this.props.match.params.id);

      if (artistIndex === -1) {
        return;
      }

      const albumIndex = this.state.artists[artistIndex].relationships.album.findIndex(album => album.album_id === albumId);

      if (albumIndex === -1) {
        return;
      }

      store.dispatch({
        type: PLAY_REQUEST,
        payload: {
          play: this.state.artists[artistIndex].relationships.album[albumIndex].relationships.track[0],
          queue: this.state.artists[artistIndex].relationships.album[albumIndex].relationships.track,
          queueInitial: this.state.artists[artistIndex].relationships.album[albumIndex].relationships.track,
        },
      });

      return;
    }

    if (this.state.albumPlayingId === albumId) {
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

    let song = null;
    const songsFlatten = [];

    this.state.artists.forEach((artist) => {
      artist.relationships.album.forEach((album) => {
        songsFlatten.push(...album.relationships.track);

        album.relationships.track.forEach((t) => {
          if (t.track_id === songId) {
            song = t;
          }
        });
      });
    });

    if (song === null) {
      return;
    }

    store.dispatch({
      type: PLAY_REQUEST,
      payload: {
        play: song,
        queue: songsFlatten,
        queueInitial: songsFlatten,
      },
    });
  }

  contextMenuArtist() {
    const artistIndex = this.state.artists.findIndex(artist => artist.artist_id === this.props.match.params.id);

    if (artistIndex === -1) {
      return;
    }

    store.dispatch({
      type: CONTEXT_MENU_ON_REQUEST,
      payload: {
        type: CONTEXT_ARTIST,
        payload: this.state.artists[artistIndex],
      },
    });
  }

  contextMenuAlbum(albumId) {
    const artistIndex = this.state.artists.findIndex(artist => artist.artist_id === this.props.match.params.id);

    if (artistIndex === -1) {
      return;
    }

    const albumIndex = this.state.artists[artistIndex].relationships.album.findIndex(album => album.album_id === albumId);

    if (albumIndex === -1) {
      return;
    }

    store.dispatch({
      type: CONTEXT_MENU_ON_REQUEST,
      payload: {
        type: CONTEXT_ALBUM,
        payload: this.state.artists[artistIndex].relationships.album[albumIndex],
      },
    });
  }

  contextMenuSong(songId) {
    let song = null;

    this.state.artists.forEach((artist) => {
      artist.relationships.album.forEach((album) => {
        album.relationships.track.forEach((t) => {
          if (t.track_id === songId) {
            song = t;
          }
        });
      });
    });

    if (song === null) {
      return;
    }

    store.dispatch({
      type: CONTEXT_MENU_ON_REQUEST,
      payload: {
        type: CONTEXT_SONG,
        payload: song,
      },
    });
  }

  render() {
    if (this.state.artists === null) {
      return null;
    }

    return (
      <Artists
        current={this.props.current}
        playing={this.props.playing}
        artistId={this.props.match.params.id}
        user={this.props.user}
        artistPlayingId={this.state.artistPlayingId}
        artists={this.state.artists}
        songCount={this.state.songCount}
        albumPlayingId={this.state.albumPlayingId}
        artistsPlayPause={this.artistsPlayPause}
        artistPlayPause={this.artistPlayPause}
        songPlayPause={this.songPlayPause}
        albumPlayPause={this.albumPlayPause}
        contextMenuArtist={this.contextMenuArtist}
        contextMenuAlbum={this.contextMenuAlbum}
        contextMenuSong={this.contextMenuSong}
      />
    );
  }
}

ArtistsContainer.propTypes = {
  user: shape({}),
  current: shape({}),
  playing: bool,
  match: shape({
    params: shape({
      id: string,
    }),
  }).isRequired,
};

ArtistsContainer.defaultProps = {
  user: null,
  current: null,
  playing: false,
};

module.exports = connect(state => ({
  song: state.song,
  user: state.user,
  current: state.current,
  playing: state.playing,
  queueInitial: state.queueInitial,
}))(ArtistsContainer);
