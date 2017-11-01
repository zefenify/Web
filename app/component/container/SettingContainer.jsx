/* global document, window */

import React from 'react';
import { connect } from 'react-redux';
import { alert, confirm } from 'notie';

import statusChangeCallback from '@app/util/facebook';
import { THEME_REQUEST } from '@app/redux/constant/theme';
import { CROSSFADE_REQUEST } from '@app/redux/constant/crossfade';
import { USER_REQUEST } from '@app/redux/constant/user';

import DJKhaled from '@app/component/hoc/DJKhaled';

import Setting from '@app/component/presentational/Setting';

const SettingContainer = props => (<Setting {...props} />);

module.exports = connect(state => ({
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
      alert({
        type: 'error',
        text: 'Unable to reach Facebook server',
      });

      return;
    }

    window.FB.login(statusChangeCallback);
  },
  logout() {
    confirm({
      text: 'Logout?',
      submitCallback: () => {
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
    });
  },
}))(DJKhaled('currentTheme', 'currentCrossfade', 'user')(SettingContainer));
