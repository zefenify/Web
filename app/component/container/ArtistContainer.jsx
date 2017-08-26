import React, { Component } from 'react';
import { string, bool, shape } from 'prop-types';
import flatten from 'lodash/flatten';

import { BASE } from '@app/config/api';
import { PLAY, TOGGLE_PLAY_PAUSE } from '@app/redux/constant/wolfCola';

import sameSongList from '@app/util/sameSongList';
import api from '@app/util/api';
import store from '@app/redux/store';

import DJKhaled from '@app/component/hoc/DJKhaled';

import Artist from '@app/component/presentational/Artist';

class ArtistContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      artist: null,
      songCount: 0,
      albumPlayingIndex: -1, // controls queue set on album play
      playingArist: false, // checks the current initialQueue is filled with artists song [flat]
    };

    this.togglePlayPauseArtist = this.togglePlayPauseArtist.bind(this);
    this.togglePlayPauseSong = this.togglePlayPauseSong.bind(this);
    this.togglePlayPauseAlbum = this.togglePlayPauseAlbum.bind(this);
    this.afterFetch = this.afterFetch.bind(this);
  }

  componentDidMount() {
    api(`${BASE}artist/${this.props.match.params.id}`, (cancel) => {
      this.cancelRequest = cancel;
    }).then((data) => {
      this.afterFetch(data);
    }, () => { /* handle fetch error */ });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.id === this.props.match.params.id) {
      return;
    }

    api(`${BASE}artist/${nextProps.match.params.id}`, (cancel) => {
      this.cancelRequest = cancel;
    }).then((data) => {
      this.afterFetch(data);
    }, () => { /* handle fetch error */ });
  }

  componentWillUnmount() {
    this.cancelRequest();
  }

  afterFetch(data) {
    const { initialQueue } = store.getState();

    // minor restructuring to avoid artist depth 4 request
    // it's going to be a massacre of mutations 🙈
    const flattenSongs = flatten(data.reference.album.map((album) => {
      const albumArtistDereferenced = Object.assign([], album.album_artist);
      albumArtistDereferenced.forEach((artist) => {
        // eslint-disable-next-line
        delete artist.reference;
      });

      album.reference.track.forEach((track) => {
        // eslint-disable-next-line
        track.track_album.album_cover = Object.assign({}, album.album_cover);
        // eslint-disable-next-line
        track.track_album.album_artist = albumArtistDereferenced; // so `current` isn't bloated
      });

      return album.reference.track;
    }));
    // end of massacre

    const queueIsByArtist = (albums, queue) => {
      const queueIsBySingleArtist = queue.every(song => song.artist_id === data.artist_id);

      if (queueIsBySingleArtist === false) {
        return false;
      }

      // looking for album index to set `PAUSE`...
      let albumIndex = -1;
      const queueSongIdList = queue.map(song => song.songId);

      albums.forEach((album, index) => {
        if (albumIndex === -1 && album.reference.track.every(song => queueSongIdList.includes(song.track_id))) {
          albumIndex = index;
        }
      });

      return albumIndex;
    };

    this.setState(() => ({
      artist: data,
      songCount: flattenSongs.length,
      playingArist: sameSongList(initialQueue, flattenSongs),
      albumPlayingIndex: sameSongList(initialQueue, flattenSongs) ? -1 : queueIsByArtist(data.reference.album, initialQueue),
    }));
  }

  togglePlayPauseArtist() {
    if (this.state.artist === null) {
      return;
    }

    // booting playlist...
    if (this.props.current === null || this.state.playingArist === false) {
      const flattenSongs = flatten(this.state.artist.reference.album.map(album => album.reference.track));

      store.dispatch({
        type: PLAY,
        payload: {
          play: flattenSongs[0],
          queue: flattenSongs,
          initialQueue: flattenSongs,
        },
      });

      this.setState(() => ({
        albumPlayingIndex: -1,
        playingArist: true,
      }));
      // resuming / pausing playlist
    } else if (this.props.current !== null) {
      store.dispatch({
        type: TOGGLE_PLAY_PAUSE,
      });
    }
  }

  togglePlayPauseAlbum(album, albumIndex) {
    if (this.props.current === null || this.state.albumPlayingIndex !== albumIndex) {
      store.dispatch({
        type: PLAY,
        payload: {
          play: album.reference.track[0],
          queue: album.reference.track,
          initialQueue: album.reference.track,
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
        type: TOGGLE_PLAY_PAUSE,
      });
    }
  }

  togglePlayPauseSong(songId) {
    const flattenSongs = flatten(this.state.artist.reference.album.map(album => album.reference.track));
    const songIndex = flattenSongs.findIndex(song => song.track_id === songId);

    if (this.props.current !== null && this.props.current.track_id === songId) {
      store.dispatch({
        type: TOGGLE_PLAY_PAUSE,
      });

      return;
    }

    store.dispatch({
      type: PLAY,
      payload: {
        play: flattenSongs[songIndex],
        queue: flattenSongs,
        initialQueue: flattenSongs,
      },
    });

    this.setState(() => ({
      albumPlayingIndex: -1,
      playingArist: true,
    }));
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

module.exports = DJKhaled('current', 'playing')(ArtistContainer);
