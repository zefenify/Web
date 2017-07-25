import React from 'react';
import { connect } from 'react-redux';

import { SET_THEME } from '@app/redux/constant/theme';
import { SET_CROSSFADE } from '@app/redux/constant/crossfade';

import Setting from '@app/component/presentational/Setting';

const SettingContainer = props => (<Setting {...props} />);

module.exports = connect(state => ({
  currentTheme: state.theme,
  currentCrossfade: state.crossfade,
}), dispatch => ({
  toggleTheme() {
    dispatch({
      type: SET_THEME,
    });
  },
  crossfade(e) {
    dispatch({
      type: SET_CROSSFADE,
      payload: Number.parseInt(e.target.value, 10),
    });
  },
}))(SettingContainer);
