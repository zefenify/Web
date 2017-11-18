/* global window, document */
/* eslint no-console: off */

import { Component } from 'react';

import { PLAY_PAUSE_REQUEST } from '@app/redux/constant/wolfCola';
import store from '@app/redux/store';

// we're leaving Redux Saga `throttle` effects - RAW
// we need to prevent scrolling on space and fire `PLAY_PAUSE_REQUEST` after `KEYPRESS_THROTTLE`
// so debouching isn't what we're looking for...
const KEYPRESS_THROTTLE = 128;
let keypress = null;

class SpaceContainer extends Component {
  componentDidMount() {
    const body = document.querySelector('body');
    body.addEventListener('keydown', (e) => {
      // shortcutting for faster execution...I think
      if (e.key !== ' ' || window.location.pathname.includes('/search') === true) {
        return;
      }

      e.preventDefault();
      clearTimeout(keypress);
      keypress = setTimeout(() => {
        // pre-checks are done inside the saga
        store.dispatch({
          type: PLAY_PAUSE_REQUEST,
        });
      }, KEYPRESS_THROTTLE);
    }, { passive: false });
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return null;
  }
}

module.exports = SpaceContainer;
