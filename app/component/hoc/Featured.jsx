/* eslint no-console: 0 */

import React, { Component } from 'react';
import { string, shape } from 'prop-types';
import styled from 'emotion/react';

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

  .featured {
    flex: 1 0 auto;
    display: flex;
    flex-direction: row;
    padding: 1em 2em;

    &__image {
      flex: 0 0 200px;
      height: 200px;
      width: 200px;
      border: 1px solid rgba(51, 51, 51, 0.25);
      border-radius: 50%;
    }

    &__info {
      margin-left: 1em;

      & > * {
        margin: 0;
      }

      & > p:not(:first-child) {
        color: ${props => props.theme.controlMute};
      }
    }
  }

  .featured-info {
    display: flex;
    flex-direction: column;
    justify-content: center;

    &__button {
      margin-top: 1em;
      width: 175px;
    }
  }

  .song {
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
      initialQueue: [],
      isCurrentList: false,
    };
    this.togglePlayPauseAll = this.togglePlayPauseAll.bind(this);
    this.togglePlayPause = this.togglePlayPause.bind(this);
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
      if (this.state.featured === null) {
        return;
      }

      const { playing, current, initialQueue } = store.getState();
      this.setState(() => ({ playing, current, initialQueue }));

      // fix your face
      // sees if the featured list is the same as the one that triggered the current playing list
      // i.e. current playing should only be active in one list - not in all list that it's found
      // eslint-disable-next-line
      if (this.state.featured.songs.length > 0 && this.state.initialQueue.length > 0 && this.state.featured.songs.length === this.state.initialQueue.length && this.state.featured.songs[0].songId === this.state.initialQueue[0].songId && this.state.featured.songs[this.state.featured.songs.length - 1].songId === this.state.initialQueue[this.state.initialQueue.length - 1].songId) {
        this.setState(() => ({ isCurrentList: true }));
      } else {
        this.setState(() => ({ isCurrentList: false }));
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  togglePlayPauseAll() {
    if (this.state.featured === null) {
      return;
    }

    // booting playlist
    if (this.state.current === null || this.state.isCurrentList === false) {
      store.dispatch({
        type: PLAY,
        payload: {
          play: this.state.featured.songs[0],
          queue: this.state.featured.songs,
          initialQueue: this.state.featured.songs,
        },
      });

      // resuming / pausing playlist
    } else if (this.state.current !== null) {
      store.dispatch({
        type: TOGGLE_PLAY_PAUSE,
      });
    }
  }

  togglePlayPause(songId) {
    const songIdIndex = this.state.featured.songs.findIndex(song => song.songId === songId);

    if (songIdIndex === -1) {
      return;
    }

    if (this.state.isCurrentList && this.state.current.songId === this.state.featured.songs[songIdIndex].songId) {
      store.dispatch({
        type: TOGGLE_PLAY_PAUSE,
      });

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

    const { hours, minutes, seconds } = human(this.state.featured.songs.reduce((totalDuration, song) => totalDuration + song.playtime, 0), true);

    return (
      <FeaturedContainer>
        <div className="featured">
          <div className="featured__image" style={{ background: `transparent url('${BASE}${this.state.featured.thumbnail}') 50% 50% / cover no-repeat` }} />
          <div className="featured__info featured-info">
            <p>FEATURED</p>
            <h1>{ this.state.featured.title }</h1>
            <p style={{ marginTop: '0.5em' }}>{`${this.state.featured.songs.length} song${this.state.featured.songs.length > 1 ? 's' : ''}, ${hours > 0 ? `${hours} hr` : ''} ${minutes} min ${hours > 0 ? '' : `${seconds} sec`}`}</p>
            <Button className="featured-info__button" onClick={this.togglePlayPauseAll}>{`${this.state.playing && this.state.isCurrentList ? 'PAUSE' : 'PLAY'}`}</Button>
          </div>
        </div>

        <Divider />

        <div className="song">
          { this.state.featured.songs.map((song, index) => <Song
            key={song.songId}
            currentSongId={this.state.current === null || this.state.isCurrentList === false ? -1 : this.state.current.songId}
            trackNumber={index + 1}
            togglePlayPause={this.togglePlayPause}
            playing={this.state.playing}
            {...song}
          />) }
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
