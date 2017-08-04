import React, { Component } from 'react';

import { LIST, GENRE } from '@app/config/api';
import { PLAY, TOGGLE_PLAY_PAUSE } from '@app/redux/constant/wolfCola';
import store from '@app/redux/store';
import api from '@app/util/api';

import BoxList from '@app/component/presentational/BoxList';

class BoxContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      box: GENRE,
      boxPlayingData: 'Wolf-Cola',
    };

    this.boxPlay = this.boxPlay.bind(this);
    this.cancelRequest = () => {};
  }

  componentDidMount() {
    console.log(this.props.match);
  }

  componentWillUnmount() {
    this.cancelRequest();
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

    api(`${LIST}${boxData}.json`, (cancel) => {
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

  render() {
    return (
      <BoxList
        box={this.state.box}
        boxPlayingData={this.state.boxPlayingData}
        boxPlay={this.boxPlay}
      />
    );
  }
}

module.exports = BoxContainer;
