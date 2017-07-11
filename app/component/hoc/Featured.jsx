/* eslint no-console: 0 */

import React, { Component } from 'react';
import { string, shape } from 'prop-types';
import styled from 'styled-components';

import { BASE } from '@app/config/api';
import { PLAY, TOGGLE_PLAY_PAUSE } from '@app/redux/constant/wolfCola';
import { human } from '@app/util/time';

import Divider from '@app/component/styled/Divider';
import Button from '@app/component/styled/Button';
import Song from '@app/component/presentational/Song';
import api from '@app/util/api';
import store from '@app/redux/store';

const FeaturedContainer = styled.div`
  display: flex;
  flex-direction: column;

  .featured-container {
    flex: 1 0 auto;
    display: flex;
    flex-direction: row;
    padding: 1em 2em;

    .featured-image {
      flex: 0 0 200px;
      height: 200px;
      width: 200px;
      border: 1px solid rgba(51, 51, 51, 0.25);
      border-radius: 50%;
    }

    .featured-info {
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

  .song-container {
    flex: 1 1 auto;

    & > *:last-child {
      margin-bottom: 1px;
    }
  }
`;

class Featured extends Component {
  constructor(props) {
    super(props);
    this.state = {
      featured: null,
      current: null,
      playing: false,
    };
    this.togglePlayPauseAll = this.togglePlayPauseAll.bind(this);
    this.playSong = this.playSong.bind(this);
  }

  componentDidMount() {
    // calling...
    api(`${BASE}/json/featured/${this.props.match.params.id}.json`)
      .then((data) => {
        this.setState(() => ({ featured: data }));
      }, (err) => {
        console.log(err);
      });

    this.unsubscribe = store.subscribe(() => {
      const { playing, current } = store.getState();
      this.setState(() => ({ playing, current }));
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  togglePlayPauseAll() {
    if (this.state.featured === null) {
      return;
    }

    const { current } = store.getState();

    // booting playlist
    if (current === null) {
      store.dispatch({
        type: PLAY,
        payload: {
          play: this.state.featured.songs[0],
          queue: this.state.featured.songs,
          initialQueue: this.state.featured.songs,
        },
      });

      // resuming / pausing playlist
    } else if (current !== null) {
      store.dispatch({
        type: TOGGLE_PLAY_PAUSE,
      });
    }
  }

  playSong(songId) {
    const songIdIndex = this.state.featured.songs.findIndex(song => song.songId === songId);

    if (songIdIndex === -1) {
      return;
    }

    store.dispatch({
      type: PLAY,
      payload: {
        play: this.state.featured.songs[songIdIndex],
        queue: this.state.featured.songs,
        initialQueue: this.state.featured.songs,
      },
    });
  }

  render() {
    if (this.state.featured === null) {
      return null;
    }

    // eslint-disable-next-line
    const { hours, minutes, seconds } = human(this.state.featured.songs.reduce((totalDuration, song) => totalDuration += song.playtime, 0), true);

    return (
      <FeaturedContainer>
        <div className="featured-container">
          <div className="featured-image" style={{ background: `transparent url('${BASE}${this.state.featured.thumbnail}') 50% 50% / cover no-repeat` }} />
          <div className="featured-info">
            <p>FEATURED</p>
            <h1>{ this.state.featured.title }</h1>
            <p style={{ marginTop: '0.5em' }}>{`${this.state.featured.songs.length} song${this.state.featured.songs.length > 1 ? 's' : ''}, ${hours > 0 ? `${hours} hr` : ''} ${minutes} min ${hours > 0 ? '' : `${seconds} sec`}`}</p>
            <Button onClick={this.togglePlayPauseAll}>{`${this.state.playing ? 'PAUSE' : 'PLAY'}`}</Button>
          </div>
        </div>

        <Divider />

        <div className="song-container">
          { this.state.featured.songs.map(song => <Song currentId={this.state.current === null ? -1 : this.state.current.songId} playSong={this.playSong} key={song.songId} {...song} />) }
        </div>
      </FeaturedContainer>
    );
  }
}

Featured.propTypes = {
  match: shape({
    params: shape({
      id: string,
    }),
  }).isRequired,
};

Featured.defaultProps = {};

module.exports = Featured;
