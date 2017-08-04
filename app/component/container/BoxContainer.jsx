import React, { Component } from 'react';
import { string, bool, shape } from 'prop-types';

import { GENRE_BASE, GENRE, ARIFLIST_BASE, ARIFLIST } from '@app/config/api';
import { PLAY, TOGGLE_PLAY_PAUSE } from '@app/redux/constant/wolfCola';
import sameSongList from '@app/util/sameSongList';
import { human } from '@app/util/time';
import store from '@app/redux/store';
import api from '@app/util/api';

import DJKhaled from '@app/component/hoc/DJKhaled';
import BoxList from '@app/component/presentational/BoxList';
import HeaderSongs from '@app/component/presentational/HeaderSongs';

class BoxContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      genre: GENRE,
      ariflist: ARIFLIST,
      boxPlayingData: 'Wolf-Cola',
      duration: {
        hours: 0,
        minutes: 0,
        seconds: 0,
      },
      playingList: false,
      list: null,
    };

    this.boxPlay = this.boxPlay.bind(this);
    this.togglePlayPauseAll = this.togglePlayPauseAll.bind(this);
    this.togglePlayPauseSong = this.togglePlayPauseSong.bind(this);
    this.cancelRequest = () => {};
  }

  componentDidMount() {
    this.loadData(this.props.match.params);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.list !== this.props.match.params.list) {
      this.loadData(nextProps.match.params);
    } else if (nextProps.match.params.type !== this.props.match.params.type) {
      this.loadData(nextProps.match.params);
    }
  }

  componentWillUnmount() {
    this.cancelRequest();
  }

  /**
   * load data
   *
   * @param  {String} options.type
   * @param  {String} options.list [description]
   */
  loadData({ type, list }) {
    // load boxes...
    if (list === undefined) {
      return;
    }

    this.setState(() => ({
      list: null,
    }));

    // load songs...
    api(`${type === 'genre' ? GENRE_BASE : ARIFLIST_BASE}${list}.json`)
      .then((data) => {
        this.setState(() => ({
          list: data,
          duration: human(data.songs.reduce((totalD, song) => totalD + song.playtime, 0), true),
        }), () => {
          const { initialQueue } = store.getState();

          if (initialQueue.length === 0 || this.state.list.songs.length === 0) {
            this.setState(() => ({
              playingList: false,
            }));

            return;
          }

          if (sameSongList(this.state.list.songs, initialQueue)) {
            this.setState(() => ({
              playingList: true,
            }));
          } else {
            this.setState(() => ({
              playingList: false,
            }));
          }
        });
      });
  }

  boxPlay(boxData) {
    if (this.state.boxPlayingData === boxData) {
      store.dispatch({
        type: TOGGLE_PLAY_PAUSE,
      });

      this.setState(() => ({
        boxPlayingData: 'Wolf-Cola',
      }));

      return;
    }

    this.setState(() => ({
      boxPlayingData: boxData,
    }));

    api(`${this.props.match.params.type === 'genre' ? GENRE_BASE : ARIFLIST_BASE}${boxData}.json`, (cancel) => {
      this.cancelRequest = cancel;
    })
      .then((data) => {
        store.dispatch({
          type: PLAY,
          payload: {
            play: data.songs[0],
            queue: data.songs,
            initialQueue: data.songs,
          },
        });
      }, () => {
        this.setState(() => ({
          boxPlayingData: 'Wolf-Cola',
        }));
      });
  }

  togglePlayPauseAll() {
    if (this.state.list === null) {
      return;
    }

    // booting playlist
    if (this.props.current === null || this.state.playingList === false) {
      store.dispatch({
        type: PLAY,
        payload: {
          play: this.state.list.songs[0],
          queue: this.state.list.songs,
          initialQueue: this.state.list.songs,
        },
      });

      this.setState(() => ({
        playingList: true,
      }));
      // resuming / pausing playlist
    } else if (this.props.current !== null) {
      store.dispatch({
        type: TOGGLE_PLAY_PAUSE,
      });
    }
  }

  togglePlayPauseSong(songId) {
    if (this.props.current !== null && this.props.current.songId === songId) {
      store.dispatch({
        type: TOGGLE_PLAY_PAUSE,
      });

      return;
    }

    const songIdIndex = this.state.list.songs.findIndex(song => song.songId === songId);

    if (songIdIndex === -1) {
      return;
    }

    store.dispatch({
      type: PLAY,
      payload: {
        play: this.state.list.songs[songIdIndex],
        queue: this.state.list.songs,
        initialQueue: this.state.list.songs,
      },
    });

    this.setState(() => ({
      playingTheSameMost: true,
    }));
  }

  render() {
    if (this.props.match.params.list === undefined) {
      return (
        <BoxList
          type={this.props.match.params.type}
          box={this.state[this.props.match.params.type]}
          boxPlayingData={this.state.boxPlayingData}
          boxPlay={this.boxPlay}
        />
      );
    }

    if (this.state.list === null) {
      return null;
    }

    return (
      <HeaderSongs
        current={this.props.current}
        playing={this.props.playing}
        playingSongs={this.props.playing && this.state.playingList}
        duration={this.state.duration}
        togglePlayPauseAll={this.togglePlayPauseAll}
        togglePlayPauseSong={this.togglePlayPauseSong}
        {...this.state.list}
      />
    );
  }
}

BoxContainer.propTypes = {
  playing: bool,
  current: shape({}),
  match: shape({
    params: shape({
      id: string,
    }),
  }).isRequired,
};

BoxContainer.defaultProps = {
  playing: false,
  current: null,
};

module.exports = DJKhaled('current', 'playing')(BoxContainer);
