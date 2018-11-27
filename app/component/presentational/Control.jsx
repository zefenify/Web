import React from 'react';
import { func, bool, string, number, oneOfType, shape } from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'react-emotion';

import { BASE_S3 } from '@app/config/api';
import { human } from '@app/util/time';

import ArtistList from '@app/component/presentational/ArtistList';
import Range from '@app/component/styled/Range';
import { ClearButton } from '@app/component/styled/Button';

import SkipBack from '@app/component/svg/SkipBack';
import SkipForward from '@app/component/svg/SkipForward';
import Repeat from '@app/component/svg/Repeat';
import Shuffle from '@app/component/svg/Shuffle';
import PlayPause from '@app/component/svg/PlayPause';
import Volume from '@app/component/svg/Volume';
import List from '@app/component/svg/List';


const ControlsContainer = styled.div`
  height: 90px;
  background-color: ${props => props.theme.BACKGROUND_CONTROL};
  color: ${props => props.theme.NATURAL_2};

  .ControlsContainer {
    &__queue {
      cursor: pointer;
      text-decoration: none;
      color: ${props => props.theme.NATURAL_2};
    }

    &__now-playing {
      width: 250px;
    }

    &__artwork {
      width: 60px;
      height: 60px;
      border-radius: 2px;
      text-decoration: none;
      border: 1px solid ${props => props.theme.NATURAL_7};
    }

    &__track-name {
      color: ${props => props.theme.NATURAL_2};
    }

    &__artist {
      color: ${props => props.theme.NATURAL_4};

      a {
        color: inherit;
        text-decoration: none;
      }
    }

    &__control {
      height: 40px;

      & > div {
        position: relative;
        padding: 0 1.5rem;
      }
    }

    &__repeat {
      position: absolute;
      top: -0.175rem;
      right: 20px;
      width: 12px;
      height: 12px;
      border-radius: 6px;
      background-color: ${props => props.theme.PRIMARY_4};
      font-size: 0.64rem;
      color: ${props => props.theme.NATURAL_2};
    }

    &__progress {
      height: 30px;
      /* width: calc(100vw - 475px); */
      width: auto;
      cursor: default;

      &__time {
        flex: 1 1 25px;
        font-size: 0.8rem;
      }
    }

    &--active {
      color: ${props => props.theme.PRIMARY_4};
    }
  }
`;


const Control = ({
  current,
  togglePlayPause,
  next,
  previous,
  playing,
  shuffle,
  repeat,
  volume,
  remaining,
  duration,
  playbackPosition,
  seek,
  toggleShuffle,
  toggleRemaining,
  setVolume,
  muteVolume,
  maxVolume,
  setRepeat,
  urlCurrentPlaying,
}) => (
  <ControlsContainer className="d-flex flex-direction-row align-items-center px-3">
    <div className="ControlsContainer__now-playing flex-grow-0 flex-shrink-0">
      {
        current !== null
          ? (
            <div className="d-flex flex-row align-items-center">
              {
                urlCurrentPlaying === null
                  ? <div className="ControlsContainer__artwork" style={{ background: `transparent url('${BASE_S3}${current.track_album.album_cover.s3_name}') 50% 50% / cover no-repeat` }} />
                  : <Link to={urlCurrentPlaying} className="ControlsContainer__artwork" style={{ background: `transparent url('${BASE_S3}${current.track_album.album_cover.s3_name}') 50% 50% / cover no-repeat` }} />
              }

              <div className="d-flex flex-column px-2">
                <p className="m-0 p-0 ControlsContainer__track-name">{ current.track_name }</p>
                <div className="ControlsContainer__artist mt-2">
                  <ArtistList artist={current.track_album.album_artist} />
                </div>
              </div>
            </div>
          ) : null
      }
    </div>

    <div className="d-flex flex-column flex-grow-1 flex-shrink-1">
      <div className="d-flex flex-row align-items-center justify-content-center pt-2 ControlsContainer__control">
        <div
          tabIndex="-1"
          role="button"
          className={`${shuffle ? 'ControlsContainer--active' : ''}`}
          onKeyPress={toggleShuffle}
          onClick={toggleShuffle}
        >
          <Shuffle width="20" height="20" />
        </div>

        <div
          tabIndex="-1"
          role="button"
          onKeyPress={previous}
          onClick={previous}
        >
          <SkipBack width="20" height="20" />
        </div>

        <div
          tabIndex="-1"
          role="button"
          onKeyPress={togglePlayPause}
          onClick={togglePlayPause}
        >
          <PlayPause strokeWidth="1" width="32" height="32" playing={playing} />
        </div>

        <div
          tabIndex="-1"
          role="button"
          onKeyPress={next}
          onClick={next}
        >
          <SkipForward width="20" height="20" />
        </div>

        <div
          tabIndex="-1"
          role="button"
          className={`${repeat === 'OFF' ? '' : 'ControlsContainer--active'}`}
          onKeyPress={setRepeat}
          onClick={setRepeat}
        >
          <Repeat width="20" height="20" />
          <div className="d-flex flex-row align-items-center justify-content-center ControlsContainer__repeat" style={{ opacity: repeat === 'ONE' ? 1 : 0 }} />
        </div>
      </div>

      <div className="d-flex flex-row align-items-center justify-content-center py-0 px-3 ControlsContainer__progress">
        <div className="ControlsContainer__progress__time pr-2">
          {`${playbackPosition === 0 ? '0:00' : human(playbackPosition)}`}
        </div>

        <Range
          type="range"
          min="0"
          max={duration}
          step="1"
          value={playbackPosition}
          className="flex-grow-1 flex-shrink-1"
          onChange={e => seek(e)}
        />

        <ClearButton className="ControlsContainer__progress__time pl-2" onClick={toggleRemaining}>
          <span style={{ opacity: remaining ? 1 : 0 }}>-&nbsp;</span>
          <span>{`${remaining ? human(duration - playbackPosition) : human(duration)}`}</span>
        </ClearButton>
      </div>
    </div>

    <Link to="/queue" className="py-0 px-3 ControlsContainer__queue">
      <List width="20" height="20px" />
    </Link>

    <div className="d-flex flex-row align-items-center justify-content-center px-0 py-3">
      <Volume className="mr-2 flex-shrink-0" volume={volume} onClick={() => volume === 0 ? maxVolume() : muteVolume()} />

      <Range
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={volume}
        onChange={setVolume}
      />
    </div>
  </ControlsContainer>
);

Control.propTypes = {
  current: oneOfType([shape({})]),
  togglePlayPause: func.isRequired,
  next: func.isRequired,
  previous: func.isRequired,
  playing: bool,
  shuffle: bool,
  repeat: string,
  volume: number,
  remaining: bool,
  duration: number,
  playbackPosition: number,
  urlCurrentPlaying: oneOfType([string, shape({})]),
  seek: func.isRequired,
  toggleShuffle: func.isRequired,
  toggleRemaining: func.isRequired,
  setVolume: func.isRequired,
  muteVolume: func.isRequired,
  maxVolume: func.isRequired,
  setRepeat: func.isRequired,
};

Control.defaultProps = {
  current: null,
  playing: false,
  shuffle: false,
  repeat: 'OFF',
  volume: 1,
  remaining: false,
  duration: 0,
  playbackPosition: 0,
  urlCurrentPlaying: null,
};

export default Control;
