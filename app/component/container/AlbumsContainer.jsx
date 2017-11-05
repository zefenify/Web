import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bool, shape, arrayOf, oneOfType, string } from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';

import { CONTEXT_MENU_ON_REQUEST, CONTEXT_SONG, CONTEXT_ALBUM } from '@app/redux/constant/contextMenu';
import { PLAY_REQUEST, PLAY_PAUSE_REQUEST } from '@app/redux/constant/wolfCola';

import store from '@app/redux/store';
import track from '@app/util/track';
import sameSongList from '@app/util/sameSongList';
import { human } from '@app/util/time';

import Albums from '@app/component/presentational/Albums';

class AlbumsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      albums: [],
      albumsPlayingId: '',
      albumPlaying: false,
      duration: {
        hours: 0,
        minutes: 0,
        seconds: 0,
      },
    };

    this.togglePlayPauseAlbum = this.togglePlayPauseAlbum.bind(this);
    this.togglePlayPauseAlbumAlbum = this.togglePlayPauseAlbumAlbum.bind(this);
    this.togglePlayPauseSong = this.togglePlayPauseSong.bind(this);
    this.contextMenuAlbum = this.contextMenuAlbum.bind(this);
    this.contextMenuSong = this.contextMenuSong.bind(this);
  }

  componentDidMount() {
    this.buildAlbums(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user === null || nextProps.song === null) {
      this.setState(() => ({
        albums: [],
        albumsPlayingId: '',
      }));

      return;
    }

    this.buildAlbums(nextProps);
  }

  buildAlbums(props) {
    if (props.user === null || props.song === null) {
      this.setState(() => ({
        albums: [],
        albumsPlayingId: '',
      }));

      return;
    }

    if (Object.hasOwnProperty.call(props.song.included, 'album') === false) {
      this.setState(() => ({ albums: [] }));
      return;
    }

    const included = cloneDeep(props.song.included);
    const albums = props.match.params.id === undefined ? Object.values(included.album) : Object.values(included.album).filter(album => album.album_id === props.match.params.id);
    const savedTrackIds = props.song.data.song_track;
    let albumsPlayingId = '';

    // fix your face, I'm going to be mutating albums...
    // removing tracks that are not saved in album relationship...
    albums.forEach((album) => {
      // albums -> removing tracks that are not saved -> passing to track for referencing...
      // eslint-disable-next-line
      album.relationships.track = track(album.relationships.track.filter(trackId => savedTrackIds.includes(trackId)).map(trackId => included.track[trackId]), included);
      // album artist mapping...
      // eslint-disable-next-line
      album.album_artist = album.album_artist.map(artistId => included.artist[artistId]);
      // eslint-disable-next-line
      album.album_cover = included.s3[album.album_cover];
    });

    if (props.match.params.id === undefined && this.props.queueInitial.length > 0) {
      // finding `albumsPlayingIndex`...
      albums.forEach((album) => {
        if (sameSongList(album.relationships.track, this.props.queueInitial) === true) {
          albumsPlayingId = album.album_id;
        }
      });
    }

    this.setState(() => ({ albums, albumsPlayingId }));

    if (albums.length === 1 && props.match.params.id !== undefined) {
      // building `duration` and `albumPlaying` for album view...
      this.setState(() => ({
        duration: human(albums[0].relationships.track.reduce((totalD, t) => totalD + t.track_track.s3_meta.duration, 0), true),
        albumPlaying: sameSongList(albums[0].relationships.track, this.props.queueInitial),
      }));
    }
  }

  togglePlayPauseAlbum(album) {
    if (album.album_id === this.state.albumsPlayingId) {
      store.dispatch({
        type: PLAY_PAUSE_REQUEST,
      });

      return;
    }

    store.dispatch({
      type: PLAY_REQUEST,
      payload: {
        play: album.relationships.track[0],
        queue: album.relationships.track,
        queueInitial: album.relationships.track,
      },
    });

    this.setState(() => ({ albumsPlayingId: album.album_id }));
  }

  // [x]
  togglePlayPauseAlbumAlbum() {
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

  togglePlayPauseSong(songId) {
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
  // [x]

  render() {
    return (
      <Albums
        user={this.props.user}
        albums={this.state.albums}
        playing={this.props.playing}
        togglePlayPauseAlbum={this.togglePlayPauseAlbum}
        albumsPlayingId={this.state.albumsPlayingId}

        current={this.props.current}
        albumId={this.props.match.params.id}
        albumPlaying={this.state.albumPlaying}
        duration={this.state.duration}
        togglePlayPauseAlbumAlbum={this.togglePlayPauseAlbumAlbum}
        togglePlayPauseSong={this.togglePlayPauseSong}
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
  queueInitial: arrayOf(shape({})),
  user: shape({}),
  song: shape({}),
};

AlbumsContainer.defaultProps = {
  playing: false,
  current: null,
  match: { params: { id: undefined } },
  queueInitial: [],
  user: null,
  song: null,
};

module.exports = connect(state => ({
  user: state.user,
  song: state.song,
  playing: state.playing,
  current: state.current,
  queueInitial: state.queueInitial,
}))(AlbumsContainer);
