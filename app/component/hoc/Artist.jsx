/* eslint no-console: 0 */

import React, { Component } from 'react';
import { string, shape } from 'prop-types';
import styled from 'emotion/react';
import flatten from 'lodash/flatten';

import { BASE } from '@app/config/api';
import { PLAY, TOGGLE_PLAY_PAUSE } from '@app/redux/constant/wolfCola';

import Divider from '@app/component/styled/Divider';
import Button from '@app/component/styled/Button';
import Song from '@app/component/presentational/Song';
import api from '@app/util/api';
import store from '@app/redux/store';

const ArtistContainer = styled.div`
  display: flex;
  flex-direction: column;

  .artist-container {
    flex: 1 0 auto;
    display: flex;
    flex-direction: row;
    padding: 1em 2em;

    .artist-image {
      flex: 0 0 200px;
      height: 200px;
      width: 200px;
      border: 1px solid rgba(51, 51, 51, 0.25);
      border-radius: 50%;
    }

    .artist-info {
      display: flex;
      flex-direction: column;
      margin-left: 1em;
      justify-content: center;

      & > * {
        margin: 0;
      }

      & > p:not(:first-child) {
        color: ${props => props.theme.controlMute};
      }

      button {
        width: 175px;
        margin-top: 1em;
      }
    }
  }
`;

class Artist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      artist: null,
      current: null,
      playing: false,
      songCount: 0,
    };

    this.togglePlayPauseAll = this.togglePlayPauseAll.bind(this);
  }

  componentDidMount() {
    api(`${BASE}/json/artist/${this.props.match.params.id}.json`)
      .then((data) => {
        this.setState(() => ({
          artist: data,
          // eslint-disable-next-line
          songCount: data.albums.reduce((totalSongCount, album) => totalSongCount + album.songs.length, 0),
        }));
      }, (err) => {
        console.log(err);
      });

    this.unsubscribe = store.subscribe(() => {
      if (this.state.artist === null) {
        return;
      }

      const { playing, current, initialQueue } = store.getState();
      this.setState(() => ({ playing, current, initialQueue }));
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  togglePlayPauseAll() {
    if (this.state.artist === null) {
      return;
    }

    // booting playlist
    if (this.state.current === null) {
      const flattenSongs = flatten(this.state.artist.albums.map(album => album.songs));

      store.dispatch({
        type: PLAY,
        payload: {
          play: flattenSongs[0],
          queue: flattenSongs,
          initialQueue: flattenSongs,
        },
      });

      // resuming / pausing playlist
    } else if (this.state.current !== null) {
      store.dispatch({
        type: TOGGLE_PLAY_PAUSE,
      });
    }
  }

  render() {
    if (this.state.artist === null) {
      return null;
    }

    return (
      <ArtistContainer>
        <div className="artist-container">
          <div className="artist-image" style={{ background: `transparent url('${BASE}${this.state.artist.thumbnail}') 50% 50% / cover no-repeat` }} />
          <div className="artist-info">
            <p>ARTIST</p>
            <h1>{ this.state.artist.artistName }</h1>
            <p style={{ marginTop: '0.5em' }}>{`${this.state.artist.albums.length} album${this.state.artist.albums.length > 1 ? 's' : ''}, ${this.state.songCount} song${this.state.songCount > 1 ? 's' : ''}`}</p>
            <Button onClick={this.togglePlayPauseAll}>{`${this.state.playing ? 'PAUSE' : 'PLAY'}`}</Button>
          </div>
        </div>

        <Divider />
      </ArtistContainer>
    );
  }
}

Artist.propTypes = {
  match: shape({
    params: shape({
      id: string,
    }),
  }).isRequired,
};

Artist.defaultProps = {};

module.exports = Artist;
