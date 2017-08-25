import React from 'react';
import { func, string, number } from 'prop-types';
import styled from 'emotion/react';

import Button from '@app/component/styled/Button';
import Divider from '@app/component/styled/Divider';
import Range from '@app/component/styled/Range';

const SettingContainer = styled.div`
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;

  & .crossfade {
    padding: 0;
    width: 75%;
    max-width: 250px;
    margin-top: 2em;
    margin-bottom: 4em;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const Setting = ({
  currentTheme,
  currentCrossfade,
  crossfade,
  toggleTheme,
  login,
}) => {
  const crossfadeMessage = `Crossfade: ${currentCrossfade === 0 ? 'Off' : `${currentCrossfade} Second${currentCrossfade > 1 ? 's' : ''}`}`;

  return (
    <SettingContainer>
      <h1>Settings</h1>

      <Divider />

      <Button style={{ marginTop: '2em', marginBottom: '5em' }} onClick={login}>
        <b>Login with Facebook</b>
      </Button>

      <Button style={{ marginBottom: '0.5em' }} onClick={toggleTheme}>Change Theme</Button>

      <small>
        <span>Current theme is </span><b>{ currentTheme === 'light' ? 'Dayman' : 'Nightman' }</b>
      </small>

      <div className="crossfade">
        <h3>{ crossfadeMessage }</h3>

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
};

Setting.propTypes = {
  currentTheme: string,
  currentCrossfade: number,
  toggleTheme: func.isRequired,
  crossfade: func.isRequired,
  login: func.isRequired,
};

Setting.defaultProps = {
  currentTheme: 'light',
  currentCrossfade: 0,
};

module.exports = Setting;
