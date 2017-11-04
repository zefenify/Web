import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bool, shape, arrayOf } from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';

import { PLAY_REQUEST, PLAY_PAUSE_REQUEST } from '@app/redux/constant/wolfCola';

import store from '@app/redux/store';
import track from '@app/util/track';
import sameSongList from '@app/util/sameSongList';

import Albums from '@app/component/presentational/Albums';

class AlbumsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      albums: [],
      albumsPlayingId: '',
    };

    this.togglePlayPauseAlbum = this.togglePlayPauseAlbum.bind(this);
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
      this.setState(() => ({ albums: [], albumsPlayingId: -1 }));
      return;
    }

    if (Object.hasOwnProperty.call(props.song.included, 'album') === false) {
      this.setState(() => ({ albums: [] }));
      return;
    }

    const included = cloneDeep(props.song.included);
    const albums = Object.values(included.album);
    const savedTrackIds = props.song.data.song_track;
    let albumsPlayingId = -1;

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

    // finding `albumsPlayingIndex`...
    if (this.props.queueInitial.length > 0) {
      albums.forEach((album) => {
        if (sameSongList(album.relationships.track, this.props.queueInitial) === true) {
          albumsPlayingId = album.album_id;
        }
      });
    }

    this.setState(() => ({ albums, albumsPlayingId }));
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

  render() {
    return (<Albums
      playing={this.props.playing}
      user={this.props.user}
      albums={this.state.albums}
      togglePlayPauseAlbum={this.togglePlayPauseAlbum}
      albumsPlayingId={this.state.albumsPlayingId}
    />);
  }
}

AlbumsContainer.propTypes = {
  playing: bool,
  queueInitial: arrayOf(shape({})),
  user: shape({}),
  song: shape({}),
};

AlbumsContainer.defaultProps = {
  playing: false,
  queueInitial: [],
  user: null,
  song: null,
};

module.exports = connect(state => ({
  user: state.user,
  song: state.song,
  playing: state.playing,
  queueInitial: state.queueInitial,
}))(AlbumsContainer);
