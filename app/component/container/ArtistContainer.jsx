import React, { Component } from 'react';
import { string, bool, shape } from 'prop-types';
import flatten from 'lodash/flatten';

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
    api(`json/artist/${this.props.match.params.id}.json`, (cancel) => {
      this.cancelRequest = cancel;
    })
      .then((data) => {
        this.afterFetch(data);
      }, (err) => {
        /* handle fetch error */
      });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.id === this.props.match.params.id) {
      return;
    }

    api(`json/artist/${nextProps.match.params.id}.json`, (cancel) => {
      this.cancelRequest = cancel;
    })
      .then((data) => {
        this.afterFetch(data);
      }, (err) => {
        /* handle fetch error */
      });
  }

  componentWillUnmount() {
    this.cancelRequest();
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
    if (this.props.current === null || this.state.playingArist === false) {
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

    if (this.props.current !== null && this.props.current.songId === songId) {
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
