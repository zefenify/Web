import React from 'react';
import { func, string, number } from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { SET_THEME } from 'app/redux/constant/theme';
import { SET_CROSSFADE } from 'app/redux/constant/crossfade';

import Button from 'app/component/styled/Button';
import Divider from 'app/component/styled/Divider';
import Range from 'app/component/styled/Range';

const SettingContainer = styled.div`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1em;

  .crossfade {
    padding: 0;
    width: 75%;
    max-width: 250px;
    margin-top: 2em;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const Setting = ({ currentTheme, currentCrossfade, crossfade, toggleTheme }) => (
  <SettingContainer>
    <h1>Settings</h1>

    <Divider />

    <Button style={{ margin: '1em 0 0.5em 0' }} onClick={toggleTheme}>Change Theme</Button>

    <small>
      <span>Current theme is </span><b>{ currentTheme }</b>
    </small>

    <div className="crossfade">
      <h3>Crossfade: { currentCrossfade === 0 ? 'Off' : `${currentCrossfade} Second${currentCrossfade > 1 ? 's' : ''}` }</h3>

      <Range
        type="range"
        onChange={e => crossfade(e)}
        value={currentCrossfade}
        min="0"
        max="12"
        step="1"
      />
    </div>
  </SettingContainer>
);

Setting.propTypes = {
  currentTheme: string,
  currentCrossfade: number,
  toggleTheme: func.isRequired,
  crossfade: func.isRequired,
};

Setting.defaultProps = {
  currentTheme: '',
  currentCrossfade: 0,
};

module.exports = connect(state => ({
  currentTheme: state.theme,
  currentCrossfade: state.crossfade,
}), dispatch => ({
  toggleTheme() {
    dispatch({ type: SET_THEME });
  },
  crossfade(e) {
    dispatch({ type: SET_CROSSFADE, payload: Number.parseInt(e.target.value, 10) });
  },
}))(Setting);
