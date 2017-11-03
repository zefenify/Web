import React, { Component } from 'react';
import { string, bool, shape } from 'prop-types';
import { connect } from 'react-redux';
import flatten from 'lodash/flatten';
import cloneDeep from 'lodash/cloneDeep';
import sortBy from 'lodash/sortBy';
import reverse from 'lodash/reverse';

import { BASE } from '@app/config/api';
import { NOTIFICATION_ON_REQUEST } from '@app/redux/constant/notification';
import { PLAY_REQUEST, PLAY_PAUSE_REQUEST } from '@app/redux/constant/wolfCola';
import { CONTEXT_MENU_ON_REQUEST, CONTEXT_SONG, CONTEXT_ALBUM, CONTEXT_ARTIST } from '@app/redux/constant/contextMenu';

import sameSongList from '@app/util/sameSongList';
import api from '@app/util/api';
import track from '@app/util/track';
import { loading } from '@app/redux/action/loading';
import store from '@app/redux/store';

import Artist from '@app/component/presentational/Artist';

class ArtistContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      artist: null,
      songCount: 0,
      flattenSongs: [], // all tracks in artist album flattened
      albumPlayingIndex: -1, // controls queue set on album play
      playingArist: false, // checks the current queueInitial is filled with artists song [flat]
    };

    this.togglePlayPauseArtist = this.togglePlayPauseArtist.bind(this);
    this.togglePlayPauseSong = this.togglePlayPauseSong.bind(this);
    this.togglePlayPauseAlbum = this.togglePlayPauseAlbum.bind(this);
    this.contextMenuArtist = this.contextMenuArtist.bind(this);
    this.contextMenuAlbum = this.contextMenuAlbum.bind(this);
    this.contextMenuSong = this.contextMenuSong.bind(this);
    this.afterFetch = this.afterFetch.bind(this);
  }

  componentDidMount() {
    store.dispatch(loading(true));
    api(`${BASE}artist/${this.props.match.params.id}`, undefined, (cancel) => {
      this.cancelRequest = cancel;
    }).then((data) => {
      store.dispatch(loading(false));
      this.afterFetch(data);
    }, (err) => {
      store.dispatch(loading(false));

      if (err.message === 'Network Error') {
        store.dispatch({
          type: NOTIFICATION_ON_REQUEST,
          payload: {
            message: 'No Internet connection. Please try again later',
          },
        });

        return;
      }

      store.dispatch({
        type: NOTIFICATION_ON_REQUEST,
        payload: {
          message: 'ይቅርታ, unable to fetch Artist',
        },
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.id === this.props.match.params.id) {
      return;
    }

    store.dispatch(loading(true));
    api(`${BASE}artist/${nextProps.match.params.id}`, undefined, (cancel) => {
      this.cancelRequest = cancel;
    }).then((data) => {
      store.dispatch(loading(false));
      this.afterFetch(data);
    }, () => {
      /* handle fetch error */
      store.dispatch(loading(false));
    });
  }

  componentWillUnmount() {
    store.dispatch(loading(false));
    this.cancelRequest();
  }

  afterFetch({ data, included }) {
    const { queueInitial } = store.getState();

    // sorting by `album.album_year` [ascending order] -> reversing
    const albums = reverse(sortBy(data.relationships.album.map((albumId) => {
      const album = cloneDeep(included.album[albumId]);
      album.relationships.track = track(album.relationships.track.map(trackId => included.track[trackId]), included);
      album.album_cover = included.s3[album.album_cover];

      return album;
    }), album => album.album_year));

    const tracks = track(data.relationships.track.map(trackId => included.track[trackId]), included);
    const flattenSongs = flatten(albums.map(album => album.relationships.track));

    let albumPlayingIndex = -1;
    albums.forEach((album, albumIndex) => {
      if (sameSongList(queueInitial, album.relationships.track) === true) {
        albumPlayingIndex = albumIndex;
      }
    });

    this.setState(() => ({
      artist: Object.assign({}, data, {
        artist_cover: included.s3[data.artist_cover],
        relationships: {
          album: albums,
          track: tracks,
        },
      }),
      flattenSongs,
      songCount: flattenSongs.length,
      playingArist: sameSongList(queueInitial, flattenSongs),
      albumPlayingIndex,
    }));
  }

  togglePlayPauseArtist() {
    if (this.state.artist === null || this.state.flattenSongs.length === 0) {
      return;
    }

    // booting playlist...
    if (this.props.current === null || this.state.playingArist === false) {
      store.dispatch({
        type: PLAY_REQUEST,
        payload: {
          play: this.state.flattenSongs[0],
          queue: this.state.flattenSongs,
          queueInitial: this.state.flattenSongs,
        },
      });

      this.setState(() => ({
        albumPlayingIndex: -1,
        playingArist: true,
      }));
      // resuming / pausing playlist
    } else if (this.props.current !== null) {
      store.dispatch({
        type: PLAY_PAUSE_REQUEST,
      });
    }
  }

  togglePlayPauseAlbum(album, albumIndex) {
    if (this.props.current === null || this.state.albumPlayingIndex !== albumIndex) {
      store.dispatch({
        type: PLAY_REQUEST,
        payload: {
          play: album.relationships.track[0],
          queue: album.relationships.track,
          queueInitial: album.relationships.track,
        },
      });

      this.setState(() => ({
        albumPlayingIndex: albumIndex,
        playingArist: true,
      }));

      return;
    }

    if (this.state.albumPlayingIndex === albumIndex) {
      store.dispatch({
        type: PLAY_PAUSE_REQUEST,
      });
    }
  }

  togglePlayPauseSong(songId) {
    const songIndex = this.state.flattenSongs.findIndex(song => song.track_id === songId);

    if (this.props.current !== null && this.props.current.track_id === songId) {
      store.dispatch({
        type: PLAY_PAUSE_REQUEST,
      });

      return;
    }

    store.dispatch({
      type: PLAY_REQUEST,
      payload: {
        play: this.state.flattenSongs[songIndex],
        queue: this.state.flattenSongs,
        queueInitial: this.state.flattenSongs,
      },
    });

    this.setState(() => ({
      albumPlayingIndex: -1,
      playingArist: true,
    }));
  }

  contextMenuArtist() {
    store.dispatch({
      type: CONTEXT_MENU_ON_REQUEST,
      payload: {
        type: CONTEXT_ARTIST,
        payload: this.state.artist,
      },
    });
  }

  contextMenuAlbum(albumId) {
    const album = this.state.artist.relationships.album.filter(artistAlbum => artistAlbum.album_id === albumId)[0];

    store.dispatch({
      type: CONTEXT_MENU_ON_REQUEST,
      payload: {
        context: CONTEXT_ALBUM,
        payload: album,
      },
    });
  }

  contextMenuSong(songId) {
    const songIndex = this.state.flattenSongs.findIndex(song => song.track_id === songId);

    if (songIndex === -1) {
      return;
    }

    store.dispatch({
      type: CONTEXT_MENU_ON_REQUEST,
      payload: {
        type: CONTEXT_SONG,
        payload: this.state.flattenSongs[songIndex],
      },
    });
  }

  render() {
    if (this.state.artist === null) {
      return null;
    }

    return (
      <Artist
        artist={this.state.artist}
        current={this.props.current}
        playing={this.props.playing}
        songCount={this.state.songCount}
        albumPlayingIndex={this.state.albumPlayingIndex}
        playingArist={this.state.playingArist}
        togglePlayPauseArtist={this.togglePlayPauseArtist}
        togglePlayPauseSong={this.togglePlayPauseSong}
        togglePlayPauseAlbum={this.togglePlayPauseAlbum}
        contextMenuArtist={this.contextMenuArtist}
        contextMenuAlbum={this.contextMenuAlbum}
        contextMenuSong={this.contextMenuSong}
      />
    );
  }
}

ArtistContainer.propTypes = {
  current: shape({}),
  playing: bool,
  match: shape({
    params: shape({
      id: string,
    }),
  }).isRequired,
};

ArtistContainer.defaultProps = {
  current: null,
  playing: false,
};

module.exports = connect(state => ({
  current: state.current,
  playing: state.playing,
}))(ArtistContainer);
