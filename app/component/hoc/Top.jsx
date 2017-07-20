import React, { Component } from 'react';
import { string, func, shape } from 'prop-types';
import { NavLink } from 'react-router-dom';
import styled from 'emotion/react';

import { BASE } from '@app/config/api';
import { PLAY, TOGGLE_PLAY_PAUSE } from '@app/redux/constant/wolfCola';
import sameSongList from '@app/util/sameSongList';
import { human } from '@app/util/time';

import Divider from '@app/component/styled/Divider';
import Song from '@app/component/presentational/Song';
import PlaylistHeader from '@app/component/presentational/PlaylistHeader';
import api from '@app/util/api';
import store from '@app/redux/store';

const TopContainer = styled.div`
  display: flex;
  flex-direction: column;
  ovefflow-y: scroll;
  padding: 0 1em;

  .title {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    height: 60px;
    padding: 0 1em;
    box-shadow: 0 0 4px 2px ${props => props.theme.navBarBoxShadow};
  }

  .list {
    position: absolute;
    top: 60px;
    right: 0;
    bottom: 0;
    left: 0;
    overflow-y: scroll;

    &__song {
      flex: 1 1 auto;

      & > *:last-child {
        margin-bottom: 1px;
      }
    }
  }
`;

const NavLinkStyled = styled(NavLink)`
  color: ${props => props.theme.navbarText};
  padding: 0 1em;
  font-size: 1.2em;
  font-weight: bold;
  text-decoration: none;
  border-bottom: 2px solid transparent;
  cursor: default;
  display: flex;
  flex-direction: column;
  justify-content: center;

  &:hover {
    color: ${props => props.theme.navbarTextActive};
  }

  &.active {
    color: ${props => props.theme.navbarTextActive};
    border-bottom: 2px solid ${props => props.theme.primary};
    background-color: ${props => props.theme.listBackgroundHover};
  }
`;

class Top extends Component {
  constructor(props) {
    super(props);
    this.state = {
      most: null,
      current: null,
      playing: false,
      initialQueue: [],
      duration: {
        hours: 0,
        minutes: 0,
        seconds: 0,
      },
      playingTheSameMost: false,
    };

    this.togglePlayPauseAll = this.togglePlayPauseAll.bind(this);
    this.togglePlayPauseSong = this.togglePlayPauseSong.bind(this);
  }

  componentDidMount() {
    this.unsubscribe = store.subscribe(() => {
      const { playing, current, initialQueue } = store.getState();
      this.setState(() => ({ playing, current, initialQueue }));
    });

    if (this.props.match.params.category === undefined) {
      this.props.history.replace('/top/recent');
      return;
    }

    this.loadSongs(this.props.match.params.category);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.category === undefined) {
      this.props.history.replace('/top/recent');
      return;
    }

    if (nextProps.match.params.category !== this.props.match.params.category) {
      this.loadSongs(nextProps.match.params.category);
    }
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  loadSongs(filter) {
    if (['recent', 'liked', 'played'].includes(filter) === false) {
      this.props.history.replace('/top/recent');
      return;
    }

    // this makes sure tab navigation clears previous render
    this.setState(() => ({ most: null }));

    api(`${BASE}/json/list/most${filter}.json`)
      .then((data) => {
        this.setState(() => ({
          most: data,
          duration: human(data.songs.reduce((totalD, song) => totalD + song.playtime, 0), true),
        }), () => {
          const { initialQueue } = store.getState();

          if (initialQueue.length === 0 || this.state.most.songs.length === 0) {
            this.setState(() => ({ playingTheSameMost: false }));
            return;
          }

          if (sameSongList(this.state.most.songs, initialQueue)) {
            this.setState(() => ({ playingTheSameMost: true }));
          } else {
            this.setState(() => ({ playingTheSameMost: false }));
          }
        });
      });
  }

  togglePlayPauseAll() {
    if (this.state.most === null) {
      return;
    }

    // booting playlist
    if (this.state.current === null || this.state.playingTheSameMost === false) {
      store.dispatch({
        type: PLAY,
        payload: {
          play: this.state.most.songs[0],
          queue: this.state.most.songs,
          initialQueue: this.state.most.songs,
        },
      });

      this.setState(() => ({ playingTheSameMost: true }));
      // resuming / pausing playlist
    } else if (this.state.current !== null) {
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

    const songIdIndex = this.state.most.songs.findIndex(song => song.songId === songId);

    if (songIdIndex === -1) {
      return;
    }

    store.dispatch({
      type: PLAY,
      payload: {
        play: this.state.most.songs[songIdIndex],
        queue: this.state.most.songs,
        initialQueue: this.state.most.songs,
      },
    });

    this.setState(() => ({ playingTheSameMost: true }));
  }

  render() {
    if (this.state.most === null) {
      // repeating block to avoid the ? : in the _actual_ render
      return (
        <TopContainer>
          <div className="title">
            <NavLinkStyled to="/top/recent">Most Recent</NavLinkStyled>
            <NavLinkStyled to="/top/liked">Most Liked</NavLinkStyled>
            <NavLinkStyled to="/top/played">Most Played</NavLinkStyled>
          </div>
        </TopContainer>
      );
    }

    return (
      <TopContainer>
        <div className="title">
          <NavLinkStyled to="/top/recent">Most Recent</NavLinkStyled>
          <NavLinkStyled to="/top/liked">Most Liked</NavLinkStyled>
          <NavLinkStyled to="/top/played">Most Played</NavLinkStyled>
        </div>

        <div className="list">
          <PlaylistHeader
            {...this.state.most}
            duration={this.state.duration}
            playing={(this.state.playing && this.state.playingTheSameMost)}
            togglePlayPause={this.togglePlayPauseAll}
          />

          <Divider />

          <div className="list__song">
            { this.state.most.songs.map((song, index) => <Song
              key={song.songId}
              currentSongId={this.state.current === null ? -1 : this.state.current.songId}
              trackNumber={index + 1}
              togglePlayPause={this.togglePlayPauseSong}
              playing={this.state.playing}
              {...song}
            />) }
          </div>
        </div>
      </TopContainer>
    );
  }
}

Top.propTypes = {
  history: shape({
    replace: func,
  }).isRequired,
  match: shape({
    params: shape({
      id: string,
    }),
  }).isRequired,
};

module.exports = Top;
