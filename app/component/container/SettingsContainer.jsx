/* global document, window */

import React from 'react';
import { connect } from 'react-redux';

import { NOTIFICATION_ON_REQUEST } from '@app/redux/constant/notification';
import statusChangeCallback from '@app/util/facebook';
import { THEME_REQUEST } from '@app/redux/constant/theme';
import { CROSSFADE_REQUEST } from '@app/redux/constant/crossfade';
import { USER_REQUEST } from '@app/redux/constant/user';

import DJKhaled from '@app/component/hoc/DJKhaled';
import Settings from '@app/component/presentational/Settings';

const SettingsContainer = props => (<Settings {...props} />);

module.exports = DJKhaled(connect(state => ({
  currentTheme: state.theme,
  currentCrossfade: state.crossfade,
  user: state.user,
}), dispatch => ({
  toggleTheme() {
    dispatch({
      type: THEME_REQUEST,
    });
  },
  crossfade(e) {
    dispatch({
      type: CROSSFADE_REQUEST,
      payload: Number.parseInt(e.target.value, 10),
    });
  },
  login() {
    if (window.FB === undefined) {
      dispatch({
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
    dispatch({
      type: USER_REQUEST,
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
}))(SettingsContainer));
