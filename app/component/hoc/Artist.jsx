/* eslint no-console: 0 */

import React, { Component } from 'react';
import { string, shape } from 'prop-types';
import styled from 'emotion/react';

import { BASE } from '@app/config/api';

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
    };
  }

  componentDidMount() {
    api(`${BASE}/json/artist/${this.props.match.params.id}.json`)
      .then((data) => {
        this.setState(() => ({ artist: data }));
      }, (err) => {
        console.log(err);
      });
  }

  render() {
    if (this.state.artist === null) {
      return null;
    }

    const songCount = this.state.artist.albums.reduce((totalSongCount, album) => totalSongCount + album.songs.length, 0);

    return (
      <ArtistContainer>
        <div className="artist-container">
          <div className="artist-image" style={{ background: `transparent url('${BASE}${this.state.artist.thumbnail}') 50% 50% / cover no-repeat` }} />
          <div className="artist-info">
            <p>ARTIST</p>
            <h1>{ this.state.artist.artistName }</h1>
            <p style={{ marginTop: '0.5em' }}>{`${this.state.artist.albums.length} album${this.state.artist.albums.length > 1 ? 's' : ''}, ${songCount} song${songCount > 1 ? 's' : ''}`}</p>
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
