import React from 'react';
import { func, number } from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { ControlsContainer } from 'app/component/styled/WolfCola';
import Range from 'app/component/styled/Range';

import { SET_VOLUME } from 'app/redux/constant/volume';

const NowPlayingContainer = styled.div`
  flex: 0 1 250px;
  display: flex;
  flex-direction: row;
  align-items: center;
  border: 1px solid red;
`;

const MusicControlsContainer = styled.div`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
`;

const MusicControls = styled.div`
  flex: 0 0 40px;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: center;
  font-size: 1.75em;

  div.control-container {
    position: relative;
    display: flex;

    &:hover {
      transform: scale(1.2);
      color: ${props => props.theme.listText};
    }

    &.active {
      color: ${props => props.theme.primary};
    }

    .controller-state {
      position: absolute;
      top: -0.75em;
      left: 50%;
      width: 16px;
      height: 16px;
      padding: 0.25em 0.5em;
      border-radius: 50%;
      background-color: ${props => props.theme.primary};
      color: #fff;
      font-size: 10px;
      margin: 0 auto;
      text-align: center;
    }
  }

  & [class^="icon-"] {
    padding: 0 1em;
  }
`;

const MusicProgress = styled.div`
  flex: 0 0 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  cursor: default;
`;

const VolumeContainer = styled.div`
  flex: 0 1 150px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  [class^="icon-"] {
    padding: 0 0.5em;
  }
`;

function Control({ volume, setVolume, muteVolume, maxVolume }) {
  return (
    <ControlsContainer>
      <NowPlayingContainer>Now Playing</NowPlayingContainer>

      <MusicControlsContainer>
        <MusicControls>
          <div className="control-container active">
            <i className="icon-shuffle" />
          </div>

          <div className="control-container">
            <i className="icon-skip-back" />
          </div>

          <div className="control-container">
            <i className="icon-play" />
          </div>

          <div className="control-container">
            <i className="icon-skip-forward" />
          </div>

          <div className="control-container active">
            <i className="icon-reload" />
            <div className="controller-state">1</div>
          </div>
        </MusicControls>

        <MusicProgress>
          <small style={{ padding: '0 0.5em 0 8%' }}>XX:XX</small>
          <Range type="range" min="0" max="100" step="1" />
          <small style={{ padding: '0 8% 0 0.5em' }}>YY:YY</small>
        </MusicProgress>
      </MusicControlsContainer>

      <VolumeContainer>
        <i className="icon-mute" onClick={muteVolume} />
        <Range
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={e => setVolume(e)}
        />
        <i className="icon-volume" onClick={maxVolume} />
      </VolumeContainer>
    </ControlsContainer>
  );
}

Control.propTypes = {
  volume: number,
  setVolume: func.isRequired,
  muteVolume: func.isRequired,
  maxVolume: func.isRequired,
};

Control.defaultProps = {
  volume: 1,
};

module.exports = connect(state => ({
  volume: state.volume,
}), dispatch => ({
  setVolume(e) {
    dispatch({ type: SET_VOLUME, payload: Number.parseFloat(e.target.value) });
  },
  muteVolume() {
    dispatch({ type: SET_VOLUME, payload: 0 });
  },
  maxVolume() {
    dispatch({ type: SET_VOLUME, payload: 1 });
  },
}))(Control);
