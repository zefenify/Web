import React, { Component } from 'react';
import { string, bool, shape } from 'prop-types';
import { connect } from 'react-redux';
import flatten from 'lodash/flatten';
import cloneDeep from 'lodash/cloneDeep';
import sortBy from 'lodash/sortBy';
import reverse from 'lodash/reverse';

import { BASE } from '@app/config/api';
import { PLAY_REQUEST, PLAY_PAUSE_REQUEST } from '@app/redux/constant/wolfCola';
import { CONTEXT_MENU_ON_REQUEST, CONTEXT_TRACK, CONTEXT_ALBUM, CONTEXT_ARTIST } from '@app/redux/constant/contextMenu';

import trackListSame from '@app/util/trackListSame';
import api, { error } from '@app/util/api';
import track from '@app/util/track';
import { loading } from '@app/redux/action/loading';
import store from '@app/redux/store';

import Artist from '@app/component/presentational/Artist';

class ArtistContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      artist: null,
      trackCount: 0,
      tracksFlatten: [], // all tracks in artist album flattened
      albumPlayingId: '', // controls queue set on album play
      aristPlaying: false, // checks the current queueInitial is filled with artists track [flat]
    };

    this.artistPlayPause = this.artistPlayPause.bind(this);
    this.trackPlayPause = this.trackPlayPause.bind(this);
    this.albumPlayPause = this.albumPlayPause.bind(this);
    this.contextMenuArtist = this.contextMenuArtist.bind(this);
    this.contextMenuAlbum = this.contextMenuAlbum.bind(this);
    this.contextMenuTrack = this.contextMenuTrack.bind(this);
    this.afterFetch = this.afterFetch.bind(this);
  }

  componentDidMount() {
    const { user } = store.getState();
    store.dispatch(loading(true));
    api(`${BASE}artist/${this.props.match.params.id}`, user, (cancel) => {
      this.cancelRequest = cancel;
    }).then((data) => {
      store.dispatch(loading(false));
      this.afterFetch(data);
    }, error(store));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.id === this.props.match.params.id) {
      return;
    }

    const { user } = store.getState();
    store.dispatch(loading(true));
    api(`${BASE}artist/${nextProps.match.params.id}`, user, (cancel) => {
      this.cancelRequest = cancel;
    }).then((data) => {
      store.dispatch(loading(false));
      this.afterFetch(data);
    }, error(store));
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
      album.album_artist = album.album_artist.map(artistId => included.artist[artistId]);
      album.relationships.track = track(album.relationships.track.map(trackId => included.track[trackId]), included);
      album.album_cover = included.s3[album.album_cover];

      return album;
    }), album => album.album_year));

    const tracks = track(data.relationships.track.map(trackId => included.track[trackId]), included);
    const tracksFlatten = flatten(albums.map(album => album.relationships.track));

    let albumPlayingId = '';
    albums.forEach((album) => {
      if (trackListSame(queueInitial, album.relationships.track) === true) {
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
      tracksFlatten,
      trackCount: tracksFlatten.length,
      aristPlaying: trackListSame(queueInitial, tracksFlatten),
      albumPlayingId,
    }));
  }

  artistPlayPause() {
    if (this.state.artist === null || this.state.tracksFlatten.length === 0) {
      return;
    }

    // booting playlist...
    if (this.props.current === null || this.state.aristPlaying === false) {
      store.dispatch({
        type: PLAY_REQUEST,
        payload: {
          play: this.state.tracksFlatten[0],
          queue: this.state.tracksFlatten,
          queueInitial: this.state.tracksFlatten,
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

  albumPlayPause(albumId) {
    if (this.props.current === null || this.state.albumPlayingId !== albumId) {
      const albumIndex = this.state.artist.relationships.album.findIndex(album => album.album_id === albumId);

      if (albumIndex === -1) {
        return;
      }

      store.dispatch({
        type: PLAY_REQUEST,
        payload: {
          play: this.state.artist.relationships.album[albumIndex].relationships.track[0],
          queue: this.state.artist.relationships.album[albumIndex].relationships.track,
          queueInitial: this.state.artist.relationships.album[albumIndex].relationships.track,
        },
      });

      this.setState(() => ({
        albumPlayingId: albumId,
        aristPlaying: trackListSame(this.state.artist.relationships.album[albumIndex].relationships.track, this.state.tracksFlatten),
      }));

      return;
    }

    if (this.state.albumPlayingId === albumId) {
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

    const trackIndex = this.state.tracksFlatten.findIndex(t => t.track_id === trackId);

    store.dispatch({
      type: PLAY_REQUEST,
      payload: {
        play: this.state.tracksFlatten[trackIndex],
        queue: this.state.tracksFlatten,
        queueInitial: this.state.tracksFlatten,
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

  contextMenuAlbum(albumId) {
    const albumIndex = this.state.artist.relationships.album.findIndex(album => album.album_id === albumId);

    if (albumIndex === -1) {
      return;
    }

    store.dispatch({
      type: CONTEXT_MENU_ON_REQUEST,
      payload: {
        type: CONTEXT_ALBUM,
        payload: this.state.artist.relationships.album[albumIndex],
      },
    });
  }

  contextMenuTrack(trackId) {
    const trackIndex = this.state.tracksFlatten.findIndex(t => t.track_id === trackId);

    if (trackIndex === -1) {
      return;
    }

    store.dispatch({
      type: CONTEXT_MENU_ON_REQUEST,
      payload: {
        type: CONTEXT_TRACK,
        payload: this.state.tracksFlatten[trackIndex],
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
        trackCount={this.state.trackCount}
        albumPlayingId={this.state.albumPlayingId}
        aristPlaying={this.state.aristPlaying}
        artistPlayPause={this.artistPlayPause}
        trackPlayPause={this.trackPlayPause}
        albumPlayPause={this.albumPlayPause}
        contextMenuArtist={this.contextMenuArtist}
        contextMenuAlbum={this.contextMenuAlbum}
        contextMenuTrack={this.contextMenuTrack}
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
