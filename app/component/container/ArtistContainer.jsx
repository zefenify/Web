import React, { Component } from 'react';
import { string, bool, shape } from 'prop-types';
import flatten from 'lodash/flatten';
import cloneDeep from 'lodash/cloneDeep';
import sortBy from 'lodash/sortBy';
import reverse from 'lodash/reverse';

import { BASE } from '@app/config/api';
import { PLAY, TOGGLE_PLAY_PAUSE } from '@app/redux/constant/wolfCola';

import sameSongList from '@app/util/sameSongList';
import api from '@app/util/api';
import track from '@app/util/track';
import store from '@app/redux/store';

import DJKhaled from '@app/component/hoc/DJKhaled';

import Artist from '@app/component/presentational/Artist';

class ArtistContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      artist: null,
      songCount: 0,
      flattenSongs: [], // all tracks in artist album flattened
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

  afterFetch({ data, included }) {
    const { initialQueue } = store.getState();

    // sorting by `album.album_year` [ascending order] -> reversing
    const albums = reverse(sortBy(data.relationships.album.map((albumId) => {
      const album = cloneDeep(included.album[albumId]);
      album.relationships.track = track(album.relationships.track.map(trackId => included.track[trackId]), included);
      album.album_cover = included.s3[album.album_cover];

      return album;
    }), album => album.album_year));

    const tracks = track(data.relationships.track.map(trackId => included.track[trackId]), included);
    const flattenSongs = flatten(albums.map(album => album.relationships.track));

    const queueIsByArtist = (artistAlbums, queue) => {
      const queueIsBySingleArtist = queue.every(song => song.artist_id === data.artist_id);

      if (queueIsBySingleArtist === false) {
        return false;
      }

      // looking for album index to set `PAUSE`...
      let albumIndex = -1;
      const queueSongIdList = queue.map(song => song.songId);

      artistAlbums.forEach((album, index) => {
        if (albumIndex === -1 && album.relationships.track.every(song => queueSongIdList.includes(song.track_id))) {
          albumIndex = index;
        }
      });

      return albumIndex;
    };

    let albumPlayingIndex = -1;
    albums.forEach((album, albumIndex) => {
      if (sameSongList(initialQueue, album.relationships.track) === true) {
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
      playingArist: sameSongList(initialQueue, flattenSongs),
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
        type: PLAY,
        payload: {
          play: this.state.flattenSongs[0],
          queue: this.state.flattenSongs,
          initialQueue: this.state.flattenSongs,
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
          play: album.relationships.track[0],
          queue: album.relationships.track,
          initialQueue: album.relationships.track,
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
    const songIndex = this.state.flattenSongs.findIndex(song => song.track_id === songId);

    if (this.props.current !== null && this.props.current.track_id === songId) {
      store.dispatch({
        type: TOGGLE_PLAY_PAUSE,
      });

      return;
    }

    store.dispatch({
      type: PLAY,
      payload: {
        play: this.state.flattenSongs[songIndex],
        queue: this.state.flattenSongs,
        initialQueue: this.state.flattenSongs,
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
