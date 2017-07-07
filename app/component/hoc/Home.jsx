/* eslint no-console: 0 */
/* global document, fetch */

import React, { Component } from 'react';
import styled from 'styled-components';

import { BASE, FEATURED_ALL } from '@app/config/api';
import { PLAY, TOGGLE_PLAY_PAUSE } from '@app/redux/constant/wolfCola';
import store from '@app/redux/store';

import api from '@app/util/api';
import Collection from '@app/component/presentational/Collection';

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  ovefflow-y: scroll;
  padding: 0 1em;

  .title {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    border-bottom: 1px solid rgba(51, 51, 51, 0.25);
    height: 60px;
    padding: 0 1em;
  }

  .list {
    position: absolute;
    top: 60px;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    overflow-y: scroll;
    padding-top: 1em;
  }
`;

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      featured: [],
      featuredPlay: null,
    };

    this.playFeatured = this.playFeatured.bind(this);
  }

  componentDidMount() {
    api(FEATURED_ALL)
      .then((data) => {
        this.setState(() => ({ featured: data }));
      }, (err) => {
        console.warn(err);
      });
  }

  playFeatured(fid) {
    // trigger _stop_...
    if (this.state.featuredPlay === fid) {
      // pausing whatever was playing...
      store.dispatch({ type: TOGGLE_PLAY_PAUSE });
      // pausing icon...
      this.setState(() => ({ featuredPlay: null }));
      return;
    }

    this.setState(() => ({ featuredPlay: fid }));

    // calling...
    api(`${BASE}/json/featured/${fid}.json`)
      .then((data) => {
        // playing...
        store.dispatch({
          type: PLAY,
          payload: {
            play: data.songs[0],
            queue: data.songs,
            initialQueue: data.songs,
          },
        });
      }, (err) => {
        this.setState(() => ({ featuredPlay: null }));
        console.log(err);
      });
  }

  render() {
    return (
      <HomeContainer>
        <div className="title">
          <h2>Featured</h2>
        </div>

        <div className="list">
          { this.state.featured.map(f => (<Collection play={this.playFeatured} key={f.id} playingId={this.state.featuredPlay} {...f} />)) }
        </div>
      </HomeContainer>
    );
  }
}

module.exports = Home;
