/* eslint no-console: 0 */
/* global document, fetch */

import React, { Component } from 'react';
import styled from 'styled-components';

import { BASE, FEATURED_ALL } from '@app/config/api';
import { PLAY } from '@app/redux/constant/wolfCola';
import store from '@app/redux/store';

import { fidel } from '@app/util/fidel';
import api from '@app/util/api';
import { BoxContainer } from '@app/component/styled/WolfCola';

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
  }

  componentDidMount() {
    api(FEATURED_ALL)
      .then((data) => {
        this.setState(() => ({ featured: data }));
      }, (err) => {
        console.warn(err);
      });
  }

  playFeatured(e, f) {
    e.stopPropagation();

    // trigger _stop_...
    if (this.state.featuredPlay === f.id) {
      this.setState(() => ({ featuredPlay: null }));
      return;
    }

    this.setState(() => ({ featuredPlay: f.id }));

    // calling...
    api(`${BASE}/json/featured/${f.id}.json`)
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

        <BoxContainer className="list">
          {
            this.state.featured.map(f => (
              <div key={f.id} className="box">
                <div className="box__img-container" style={{ background: `transparent url('${BASE}${f.thumbnail}') 50% 50% / cover no-repeat` }}>
                  <div className="control-overlay">
                    <i onClick={e => this.playFeatured(e, f)} className={`icon-ion-ios-${f.id === this.state.featuredPlay ? 'pause' : 'play'}`} />
                  </div>
                </div>
                <strong className={`${fidel(f.name)} box__title`}>{ f.name }</strong>
                <p className={`${fidel(f.description)} box__description`}>{ f.description }</p>
                <small className="box__count">{`${f.songCnt} SONG${Number.parseInt(f.songCnt, 10) > 1 ? 'S' : ''}`}</small>
              </div>
            ))
          }
        </BoxContainer>
      </HomeContainer>
    );
  }
}

module.exports = Home;
