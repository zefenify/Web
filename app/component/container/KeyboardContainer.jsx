/* global window, document */

import { useEffect } from 'react';
import debounce from 'lodash/debounce';

import {
  NEXT_REQUEST,
  PREVIOUS_REQUEST,
  PLAY_PAUSE_REQUEST,
} from '@app/redux/constant/wolfCola';
import store from '@app/redux/store';


// we're leaving Redux Saga `throttle` effects - RAW
// we need to prevent scrolling on space and fire `PLAY_PAUSE_REQUEST` after `KEY`s
const KEY = 'keydown';
const WAIT = 64;

const KeyboardContainer = () => {
  useEffect(() => {
    document.querySelector('body').addEventListener(KEY, debounce((event) => {
      if (window.location.pathname.includes('/search') === true) {
        return;
      }

      switch (event.key) {
        case ' ':
          event.preventDefault();
          store.dispatch({
            type: PLAY_PAUSE_REQUEST,
          });
          break;

        case 'n':
        case 'N':
          store.dispatch({
            type: NEXT_REQUEST,
          });
          break;

        case 'p':
        case 'P':
          store.dispatch({
            type: PREVIOUS_REQUEST,
          });
          break;

        default:
      }
    }, WAIT, {
      leading: true,
      trailing: false,
    }), { passive: false });
  }, []);

  return null;
};

export default KeyboardContainer;
