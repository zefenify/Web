import React, { Component } from 'react';
import { string, shape } from 'prop-types';
import flatten from 'lodash/flatten';

import { BASE } from '@app/config/api';
import { PLAY, TOGGLE_PLAY_PAUSE } from '@app/redux/constant/wolfCola';

import sameSongList from '@app/util/sameSongList';
import api from '@app/util/api';
import store from '@app/redux/store';

import Artist from '@app/component/presentational/Artist';

class ArtistContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      artist: null,
      current: null,
      playing: false,
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
    api(`${BASE}/json/artist/${this.props.match.params.id}.json`)
      .then((data) => {
        this.afterFetch(data);
      }, (err) => {
        /* handle fetch error */
      });

    this.unsubscribe = store.subscribe(() => {
      if (this.state.artist === null) {
        return;
      }

      const { playing, current, initialQueue } = store.getState();
      this.setState(() => ({ playing, current, initialQueue }));
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.id === this.props.match.params.id) {
      return;
    }

    api(`${BASE}/json/artist/${nextProps.match.params.id}.json`)
      .then((data) => {
        this.afterFetch(data);
      }, (err) => {
        /* handle fetch error */
      });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  afterFetch(data) {
    // building a copy so each song containing `artistId`, `artistName` & `thumbnail`
    // also replace `albumPurl` `icon` with `cover`
    const restructuredData = Object.assign({}, data);
    restructuredData.albums = restructuredData.albums.map((album) => {
      const albumCopy = Object.assign({}, album);
      albumCopy.songs = albumCopy.songs.map(song => Object.assign(song, {
        artistId: restructuredData.artistId,
        artistName: restructuredData.artistName,
        albumName: albumCopy.albumName,
        playtime: song.songPlaytime,
        thumbnail: albumCopy.albumPurl.replace('_icon_', '_cover_'),
      }));
      albumCopy.albumPurl = albumCopy.albumPurl.replace('_icon_', '_cover_');

      return albumCopy;
    });

    const { initialQueue } = store.getState();
    const flattenSongs = flatten(restructuredData.albums.map(album => album.songs));

    const queueIsByArtist = (albums, queue) => {
      const queueIsBySingleArtist = queue.every(song => song.artistId === restructuredData.artistId);

      if (queueIsBySingleArtist === false) {
        return false;
      }

      // looking for album index to set `PAUSE`...
      let albumIndex = -1;
      const queueSongIdList = queue.map(song => song.songId);

      albums.forEach((album, index) => {
        if (albumIndex === -1 && album.songs.every(song => queueSongIdList.includes(song.songId))) {
          albumIndex = index;
        }
      });

      return albumIndex;
    };

    this.setState(() => ({
      artist: restructuredData,
      songCount: flattenSongs.length,
      playingArist: sameSongList(initialQueue, flattenSongs),
      albumPlayingIndex: sameSongList(initialQueue, flattenSongs) ? -1 : queueIsByArtist(restructuredData.albums, initialQueue),
    }));
  }

  togglePlayPauseArtist() {
    if (this.state.artist === null) {
      return;
    }

    // booting playlist...
    if (this.state.current === null || this.state.playingArist === false) {
      const flattenSongs = flatten(this.state.artist.albums.map(album => album.songs));

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
    } else if (this.state.current !== null) {
      store.dispatch({
        type: TOGGLE_PLAY_PAUSE,
      });
    }
  }

  togglePlayPauseAlbum(album, albumIndex) {
    if (this.state.current === null || this.state.albumPlayingIndex !== albumIndex) {
      store.dispatch({
        type: PLAY,
        payload: {
          play: album.songs[0],
          queue: album.songs,
          initialQueue: album.songs,
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
    const flattenSongs = flatten(this.state.artist.albums.map(album => album.songs));
    const songIndex = flattenSongs.findIndex(song => song.songId === songId);

    if (this.state.current !== null && this.state.current.songId === songId) {
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
        current={this.state.current}
        playing={this.state.playing}
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
  match: shape({
    params: shape({
      id: string,
    }),
  }).isRequired,
};

module.exports = ArtistContainer;
