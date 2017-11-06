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
      songsFlatten: [], // all tracks in artist album flattened
      albumPlayingId: '', // controls queue set on album play
      aristPlaying: false, // checks the current queueInitial is filled with artists song [flat]
    };

    this.artistPlayPause = this.artistPlayPause.bind(this);
    this.songPlayPause = this.songPlayPause.bind(this);
    this.albumPlayPause = this.albumPlayPause.bind(this);
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
    const songsFlatten = flatten(albums.map(album => album.relationships.track));

    let albumPlayingId = '';
    albums.forEach((album) => {
      if (sameSongList(queueInitial, album.relationships.track) === true) {
        albumPlayingId = album.album_id;
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
      songsFlatten,
      songCount: songsFlatten.length,
      aristPlaying: sameSongList(queueInitial, songsFlatten),
      albumPlayingId,
    }));
  }

  artistPlayPause() {
    if (this.state.artist === null || this.state.songsFlatten.length === 0) {
      return;
    }

    // booting playlist...
    if (this.props.current === null || this.state.aristPlaying === false) {
      store.dispatch({
        type: PLAY_REQUEST,
        payload: {
          play: this.state.songsFlatten[0],
          queue: this.state.songsFlatten,
          queueInitial: this.state.songsFlatten,
        },
      });

      this.setState(() => ({
        albumPlayingId: '',
        aristPlaying: true,
      }));
      // resuming / pausing playlist
    } else if (this.props.current !== null) {
      store.dispatch({
        type: PLAY_PAUSE_REQUEST,
      });
    }
  }

  albumPlayPause(album) {
    if (this.props.current === null || this.state.albumPlayingId !== album.album_id) {
      store.dispatch({
        type: PLAY_REQUEST,
        payload: {
          play: album.relationships.track[0],
          queue: album.relationships.track,
          queueInitial: album.relationships.track,
        },
      });

      this.setState(() => ({
        albumPlayingId: album.album_id,
        aristPlaying: sameSongList(album.relationships.track, this.state.songsFlatten),
      }));

      return;
    }

    if (this.state.albumPlayingId === album.album_id) {
      store.dispatch({
        type: PLAY_PAUSE_REQUEST,
      });
    }
  }

  songPlayPause(songId) {
    const songIndex = this.state.songsFlatten.findIndex(song => song.track_id === songId);

    if (this.props.current !== null && this.props.current.track_id === songId) {
      store.dispatch({
        type: PLAY_PAUSE_REQUEST,
      });

      return;
    }

    store.dispatch({
      type: PLAY_REQUEST,
      payload: {
        play: this.state.songsFlatten[songIndex],
        queue: this.state.songsFlatten,
        queueInitial: this.state.songsFlatten,
      },
    });

    this.setState(() => ({
      albumPlayingId: '',
      aristPlaying: true,
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

  contextMenuAlbum(albumContext) {
    const album = this.state.artist.relationships.albumContext.filter(artistAlbum => artistAlbum.album_id === albumContext.album_id)[0];

    store.dispatch({
      type: CONTEXT_MENU_ON_REQUEST,
      payload: {
        context: CONTEXT_ALBUM,
        payload: album,
      },
    });
  }

  contextMenuSong(songId) {
    const songIndex = this.state.songsFlatten.findIndex(song => song.track_id === songId);

    if (songIndex === -1) {
      return;
    }

    store.dispatch({
      type: CONTEXT_MENU_ON_REQUEST,
      payload: {
        type: CONTEXT_SONG,
        payload: this.state.songsFlatten[songIndex],
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
        albumPlayingId={this.state.albumPlayingId}
        aristPlaying={this.state.aristPlaying}
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
