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
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  & .utopia {
    display: flex;
    flex-direction: column;

    &__squad {
      margin-top: 8em;
      margin-bottom: 2em;
    }
  }

  & .squad {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    & a {
      text-decoration: none;
    }

    &__howler {
      background: url(../../static/image/howler.svg) no-repeat;
      display: inline-block;
      width: 36px;
      height: 40px;
    }

    &__plus {
      font-size: 2em;
      padding: 0 1em;
    }

    &__react {
      font-size: 2.5em;
    }
  }
`;

const Setting = ({
  currentTheme,
  currentCrossfade,
  crossfade,
  toggleTheme,
}) => {
  const crossfadeMessage = `Crossfade: ${currentCrossfade === 0 ? 'Off' : `${currentCrossfade} Second${currentCrossfade > 1 ? 's' : ''}`}`;

  return (
    <SettingContainer>
      <h1>Settings</h1>

      <Divider />

      <Button style={{ margin: '1em 0 0.5em 0' }} onClick={toggleTheme}>Change Theme</Button>

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

      <div className="utopia">
        <div className="utopia__squad squad">
          <a className="squad__howler" href="https://howlerjs.com" rel="noopener noreferrer" target="_blank" />
          <i className="squad__plus icon-ion-ios-plus-empty" />
          <a className="squad__react" href="https://facebook.github.io/react" rel="noopener noreferrer" target="_blank"><i className="icon-react" /></a>
        </div>
      </div>
    </SettingContainer>
  );
};

Setting.propTypes = {
  currentTheme: string,
  currentCrossfade: number,
  toggleTheme: func.isRequired,
  crossfade: func.isRequired,
};

Setting.defaultProps = {
  currentTheme: 'light',
  currentCrossfade: 0,
};

module.exports = Setting;
