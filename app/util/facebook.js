/* global window */

import store from '@app/redux/store';

import { FAUTH } from '@app/config/api';
import { SONG_BOOT_REQUEST } from '@app/redux/constant/song';
import { USER_REQUEST } from '@app/redux/constant/user';
import api from '@app/util/api';

const statusChangeCallback = (response) => {
  // user connected - booting `user`...
  if (response.status === 'connected') {
    api(`${FAUTH}${response.authResponse.accessToken}`).then(({ data }) => {
      store.dispatch({
        type: USER_REQUEST,
        payload: data,
      });

      // TODO: booters
      // - [X] song
      // - [ ] playlist
      store.dispatch({
        type: SONG_BOOT_REQUEST,
      });
    }, () => {});
  }
};

// SDK will be loaded if `userBootFromLF` doesn't find any user
window.fbAsyncInit = () => {
  window.FB.init({
    appId: '470148740022518',
    cookie: false,
    xfbml: false,
    version: 'v2.8',
  });
};

module.exports = statusChangeCallback;
