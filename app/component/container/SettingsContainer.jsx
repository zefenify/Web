/* global document, window */

import React from 'react';

import { NOTIFICATION_ON_REQUEST } from '@app/redux/constant/notification';
import statusChangeCallback from '@app/util/facebook';
import { THEME_REQUEST } from '@app/redux/constant/theme';
import { CROSSFADE_REQUEST } from '@app/redux/constant/crossfade';
import { USER_REQUEST } from '@app/redux/constant/user';
import { SONG } from '@app/redux/constant/song';

import Settings from '@app/component/presentational/Settings';
import store from '@app/redux/store';
import { withContext } from '@app/component/context/context';

const dispatches = {
  themeToggle() {
    store.dispatch({
      type: THEME_REQUEST,
    });
  },

  crossfadeSet(e) {
    store.dispatch({
      type: CROSSFADE_REQUEST,
      payload: Number.parseInt(e.target.value, 10),
    });
  },

  login() {
    if (window.FB === undefined) {
      store.dispatch({
        type: NOTIFICATION_ON_REQUEST,
        payload: {
          message: 'Unable to reach Facebook server',
        },
      });

      return;
    }

    window.FB.login(statusChangeCallback);
  },

  logout() {
    store.dispatch({
      type: USER_REQUEST,
      payload: null,
    });

    store.dispatch({
      type: SONG,
      payload: null,
    });

    // [re]booting Facebook SDK...
    if (window.FB === undefined) {
      (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) { return; }
        js = d.createElement(s); js.id = id;
        js.src = '//connect.facebook.net/en_US/sdk.js';
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    }
  },
};

const SettingsContainer = props => (<Settings {...props} {...dispatches} />);

module.exports = withContext('theme', 'crossfade', 'user')(SettingsContainer);
