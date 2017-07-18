/* eslint no-console: 0 */

import React, { Component } from 'react';
import styled from 'emotion/react';

import { BASE } from '@app/config/api';
import { PLAY, TOGGLE_PLAY_PAUSE } from '@app/redux/constant/wolfCola';
import { human } from '@app/util/time';
import sameSongList from '@app/util/sameSongList';

import Divider from '@app/component/styled/Divider';
import Button from '@app/component/styled/Button';
import Song from '@app/component/presentational/Song';
import api from '@app/util/api';

import store from '@app/redux/store';

const SurpriseContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1em 2em;
  flex: 1 1 auto;

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

class Suprise extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playing: false,
      current: null,
      surpriseList: null,
      initialQueue: [],
      playingSurprise: false,
    };
    this.togglePlayPauseAll = this.togglePlayPauseAll.bind(this);
    this.togglePlayPause = this.togglePlayPause.bind(this);
  }

  componentDidMount() {
    // calling...
    api(`${BASE}/json/curated/surpriseme.php`)
      .then((data) => {
        this.setState(() => ({ surpriseList: data }), () => {
          const { initialQueue } = store.getState();

          if (initialQueue.length === 0 || this.state.surpriseList.songs.length === 0) {
            this.setState(() => ({ playingSurprise: false }));
            return;
          }

          if (sameSongList(this.state.surpriseList.songs, initialQueue)) {
            this.setState(() => ({ playingSurprise: true }));
          } else {
            this.setState(() => ({ playingSurprise: false }));
          }
        });
      }, (err) => {
        console.log(err);
      });

    this.unsubscribe = store.subscribe(() => {
      if (this.state.surpriseList === null) {
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
    if (this.state.surpriseList === null) {
      return;
    }

    // booting playlist
    if (this.state.current === null || this.state.playingSurprise === false) {
      store.dispatch({
        type: PLAY,
        payload: {
          play: this.state.surpriseList.songs[0],
          queue: this.state.surpriseList.songs,
          initialQueue: this.state.surpriseList.songs,
        },
      });

      this.setState(() => ({ playingSurprise: true }));
      // resuming / pausing playlist
    } else if (this.state.surpriseList !== null) {
      store.dispatch({
        type: TOGGLE_PLAY_PAUSE,
      });
    }
  }

  togglePlayPause(songId) {
    const songIdIndex = this.state.surpriseList.songs.findIndex(song => song.songId === songId);

    if (songIdIndex === -1) {
      return;
    }

    if (this.state.playingSurprise && this.state.current.songId === this.state.surpriseList.songs[songIdIndex].songId) {
      store.dispatch({
        type: TOGGLE_PLAY_PAUSE,
      });

      return;
    }

    store.dispatch({
      type: PLAY,
      payload: {
        play: this.state.surpriseList.songs[songIdIndex],
        queue: this.state.surpriseList.songs,
        initialQueue: this.state.surpriseList.songs,
      },
    });

    this.setState(() => ({ playingSurprise: true }));
  }

  render() {
    if (this.state.surpriseList === null) {
      return null;
    }

    const { hours, minutes, seconds } = human(this.state.surpriseList.songs.reduce((totalDuration, song) => totalDuration + song.playtime, 0), true);

    return (
      <SurpriseContainer>
        <div className="featured">
          <div className="featured__image" style={{ background: `transparent url('${BASE}${this.state.surpriseList.thumbnail}') 50% 50% / cover no-repeat` }} />
          <div className="featured__info featured-info">
            <p>PLAYLIST</p>
            <h1>{ this.state.surpriseList.title }</h1>
            <p style={{ marginTop: '0.5em' }}>{`${this.state.surpriseList.songs.length} song${this.state.surpriseList.songs.length > 1 ? 's' : ''}, ${hours > 0 ? `${hours} hr` : ''} ${minutes} min ${hours > 0 ? '' : `${seconds} sec`}`}</p>
            <Button className="featured-info__button" onClick={this.togglePlayPauseAll}>{`${this.state.playing && this.state.playingSurprise ? 'PAUSE' : 'PLAY'}`}</Button>
          </div>
        </div>

        <Divider />

        <div className="song">
          { this.state.surpriseList.songs.map((song, index) => <Song
            key={song.songId}
            currentSongId={this.state.current === null || this.state.playingSurprise === false ? -1 : this.state.current.songId}
            trackNumber={index + 1}
            togglePlayPause={this.togglePlayPause}
            playing={this.state.playing}
            {...song}
          />) }
        </div>
      </SurpriseContainer>
    );
  }
}

module.exports = Suprise;
