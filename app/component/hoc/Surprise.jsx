/* eslint no-console: 0 */

import React, { Component } from 'react';
import styled from 'emotion/react';

import { BASE } from '@app/config/api';
import { PLAY, TOGGLE_PLAY_PAUSE } from '@app/redux/constant/wolfCola';
import sameSongList from '@app/util/sameSongList';
import { human } from '@app/util/time';

import Divider from '@app/component/styled/Divider';
import PlaylistHeader from '@app/component/presentational/PlaylistHeader';
import Song from '@app/component/presentational/Song';
import api from '@app/util/api';

import store from '@app/redux/store';

const SurpriseContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1em 2em;
  flex: 1 1 auto;

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
      duration: {
        hours: 0,
        minutes: 0,
        seconds: 0,
      },
      playingSurprise: false,
    };
    this.togglePlayPauseAll = this.togglePlayPauseAll.bind(this);
    this.togglePlayPauseSong = this.togglePlayPauseSong.bind(this);
  }

  componentDidMount() {
    // calling...
    api(`${BASE}/json/curated/surpriseme.php`)
      .then((data) => {
        this.setState(() => ({
          surpriseList: data,
          duration: human(data.songs.reduce((totalD, song) => totalD + song.playtime, 0), true),
        }), () => {
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

  togglePlayPauseSong(songId) {
    if (this.state.current !== null && this.state.current.songId === songId) {
      store.dispatch({
        type: TOGGLE_PLAY_PAUSE,
      });

      return;
    }

    const songIdIndex = this.state.surpriseList.songs.findIndex(song => song.songId === songId);

    if (songIdIndex === -1) {
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

    return (
      <SurpriseContainer>
        <PlaylistHeader
          {...this.state.surpriseList}
          duration={this.state.duration}
          playing={(this.state.playing && this.state.playingSurprise)}
          togglePlayPause={this.togglePlayPauseAll}
        />

        <Divider />

        <div className="song">
          { this.state.surpriseList.songs.map((song, index) => <Song
            key={song.songId}
            currentSongId={this.state.current === null ? -1 : this.state.current.songId}
            trackNumber={index + 1}
            togglePlayPause={this.togglePlayPauseSong}
            playing={this.state.playing}
            {...song}
          />) }
        </div>
      </SurpriseContainer>
    );
  }
}

module.exports = Suprise;
