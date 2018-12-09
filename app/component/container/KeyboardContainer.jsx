/* global window, document */

import { useEffect } from 'react';
import debounce from 'lodash/debounce';

import {
  NEXT_REQUEST,
  PREVIOUS_REQUEST,
  PLAY_PAUSE_REQUEST,
} from '@app/redux/constant/wolfCola';
import { SHUFFLE_REQUEST } from '@app/redux/constant/shuffle';
import { REPEAT_REQUEST } from '@app/redux/constant/repeat';
import { VOLUME_REQUEST } from '@app/redux/constant/volume';
import store from '@app/redux/store';


// we're leaving Redux Saga `throttle` effects - RAW
// we need to prevent scrolling on space and fire `PLAY_PAUSE_REQUEST` after `KEY`s
const KEY = 'keyup';
const WAIT = 64;

const KeyboardContainer = () => {
  useEffect(() => {
    document.querySelector('body').addEventListener(KEY, debounce((event) => {
      if (window.location.pathname.includes('/search') === true || window.location.pathname.includes('/settings') === true) {
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

        case 's':
        case 'S':
          store.dispatch({
            type: SHUFFLE_REQUEST,
          });
          break;

        case 'r':
        case 'R':
          store.dispatch({
            type: REPEAT_REQUEST,
          });
          break;

        case 'm':
        case 'M': {
          const { volume } = store.getState();

          store.dispatch({
            type: VOLUME_REQUEST,
            payload: volume === 0 ? 1 : 0,
          });
          break;
        }

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
