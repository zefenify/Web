/* global FB, window, document */

import localforage from 'localforage';

import store from '@app/redux/store';

import { FAUTH } from '@app/config/api';
import { SET_USER } from '@app/redux/constant/user';
import { LF_STORE } from '@app/config/localforage';
import api from '@app/util/api';

const statusChangeCallback = (response) => {
  // user connected - booting `user`...
  if (response.status === 'connected') {
    api(`${FAUTH}${response.authResponse.accessToken}`).then((user) => {
      store.dispatch({
        type: SET_USER,
        payload: user,
      });
    }, () => {});
  }
};

// reading LF *directly* checking for user...
localforage
  .getItem(LF_STORE.USER)
  .then((lfUser) => {
    // booting Facebook SDK...
    if (lfUser === null) {
      (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) { return; }
        js = d.createElement(s); js.id = id;
        js.src = '//connect.facebook.net/en_US/sdk.js';
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    }
  }, () => {});

window.fbAsyncInit = () => {
  FB.init({
    appId: '470148740022518',
    cookie: false,
    xfbml: false,
    version: 'v2.8',
  });

  FB.AppEvents.logPageView();

  // checking user login status...
  FB.getLoginStatus(statusChangeCallback);
};

module.exports = statusChangeCallback;
