import React from 'react';
import { func, string } from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { SET_THEME } from 'app/redux/constant/theme';

import Button from 'app/component/styled/Button';
import Divider from 'app/component/styled/Divider';

const SettingContainer = styled.div`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1em;
`;

const Setting = ({ currentTheme, toggleTheme }) => (
  <SettingContainer>
    <h1>Settings</h1>

    <Divider />

    <Button style={{ margin: '1em 0 0.5em 0' }} onClick={toggleTheme}>Change Theme</Button>

    <small>
      <span>Current theme is </span><b>{ currentTheme }</b>
    </small>
  </SettingContainer>
);

Setting.propTypes = {
  currentTheme: string,
  toggleTheme: func.isRequired,
};

Setting.defaultProps = {
  currentTheme: '',
};

module.exports = connect(state => ({
  currentTheme: state.theme,
}), dispatch => ({
  toggleTheme() {
    dispatch({ type: SET_THEME });
  },
}))(Setting);
