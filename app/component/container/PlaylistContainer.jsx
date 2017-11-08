import React, { Component } from 'react';
import { bool, string, shape } from 'prop-types';
import { connect } from 'react-redux';

import { BASE } from '@app/config/api';
import { NOTIFICATION_ON_REQUEST } from '@app/redux/constant/notification';
import { PLAY_REQUEST, PLAY_PAUSE_REQUEST } from '@app/redux/constant/wolfCola';
import { CONTEXT_MENU_ON_REQUEST, CONTEXT_TRACK, CONTEXT_PLAYLIST } from '@app/redux/constant/contextMenu';
import trackListSame from '@app/util/trackListSame';
import { human } from '@app/util/time';
import api, { error } from '@app/util/api';
import track from '@app/util/track';

import HeaderTracks from '@app/component/presentational/HeaderTracks';

import { loading } from '@app/redux/action/loading';
import store from '@app/redux/store';

class PlaylistContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      featured: null,
      duration: {
        hours: 0,
        minutes: 0,
        seconds: 0,
      },
      playingFeatured: false,
    };
    this.tracksPlayPause = this.tracksPlayPause.bind(this);
    this.trackPlayPause = this.trackPlayPause.bind(this);
    this.contextMenuPlaylist = this.contextMenuPlaylist.bind(this);
    this.contextMenuTrack = this.contextMenuTrack.bind(this);
  }

  componentDidMount() {
    store.dispatch(loading(true));
    api(`${BASE}playlist/${this.props.match.params.id}`, undefined, (cancel) => {
      this.cancelRequest = cancel;
    }).then((data) => {
      store.dispatch(loading(false));
      // mapping track...
      const playlistTrack = Object.assign({}, data.data, {
        playlist_track: data.data.playlist_track.map(trackId => data.included.track[trackId]),
      });
      const tracks = track(playlistTrack.playlist_track, data.included);

      this.setState(() => ({
        featured: Object.assign({}, data.data, {
          playlist_cover: data.included.s3[data.data.playlist_cover],
          playlist_track: tracks,
        }),
        duration: human(tracks.reduce((totalD, t) => totalD + t.track_track.s3_meta.duration, 0), true),
      }), () => {
        const { queueInitial } = store.getState();

        if (queueInitial.length === 0 || this.state.featured.playlist_track.length === 0) {
          this.setState(() => ({
            playingFeatured: false,
          }));

          return;
        }

        if (trackListSame(this.state.featured.playlist_track, queueInitial)) {
          this.setState(() => ({
            playingFeatured: true,
          }));
        } else {
          this.setState(() => ({
            playingFeatured: false,
          }));
        }
      });
    }, error(store));
  }

  componentWillUnmount() {
    store.dispatch(loading(false));
    this.cancelRequest();
  }

  tracksPlayPause() {
    if (this.state.featured === null) {
      return;
    }

    // booting playlist
    if (this.props.current === null || this.state.playingFeatured === false) {
      store.dispatch({
        type: PLAY_REQUEST,
        payload: {
          play: this.state.featured.playlist_track[0],
          queue: this.state.featured.playlist_track,
          queueInitial: this.state.featured.playlist_track,
        },
      });

      this.setState(() => ({
        playingFeatured: true,
      }));
      // resuming / pausing playlist
    } else if (this.props.current !== null) {
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

    const trackIdIndex = this.state.featured.playlist_track.findIndex(t => t.track_id === trackId);

    if (trackIdIndex === -1) {
      return;
    }

    store.dispatch({
      type: PLAY_REQUEST,
      payload: {
        play: this.state.featured.playlist_track[trackIdIndex],
        queue: this.state.featured.playlist_track,
        queueInitial: this.state.featured.playlist_track,
      },
    });

    this.setState(() => ({
      playingFeatured: true,
    }));
  }

  contextMenuPlaylist() {
    store.dispatch({
      type: CONTEXT_MENU_ON_REQUEST,
      payload: {
        type: CONTEXT_PLAYLIST,
        payload: this.state.featured,
      },
    });
  }

  contextMenuTrack(trackId) {
    const trackIndex = this.state.featured.playlist_track.findIndex(t => t.track_id === trackId);

    if (trackIndex === -1) {
      return;
    }

    store.dispatch({
      type: CONTEXT_MENU_ON_REQUEST,
      payload: {
        type: CONTEXT_TRACK,
        payload: this.state.featured.playlist_track[trackIndex],
      },
    });
  }

  render() {
    if (this.state.featured === null) {
      return null;
    }

    return (
      <HeaderTracks
        type={this.props.match.params.type}
        current={this.props.current}
        playing={this.props.playing}
        tracksPlaying={this.props.playing && this.state.playingFeatured}
        duration={this.state.duration}
        tracksPlayPause={this.tracksPlayPause}
        trackPlayPause={this.trackPlayPause}
        title={this.state.featured.playlist_name}
        description={this.state.featured.playlist_description}
        cover={this.state.featured.playlist_cover}
        tracks={this.state.featured.playlist_track}
        contextMenuPlaylist={this.contextMenuPlaylist}
        contextMenuTrack={this.contextMenuTrack}
      />
    );
  }
}

PlaylistContainer.propTypes = {
  current: shape({}),
  playing: bool,
  match: shape({
    params: shape({
      id: string,
    }),
  }).isRequired,
};

PlaylistContainer.defaultProps = {
  current: null,
  playing: false,
};

module.exports = connect(state => ({
  current: state.current,
  playing: state.playing,
}))(PlaylistContainer);
