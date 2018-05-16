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
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 70px;
  background-color: ${props => props.theme.control__backgroundColor};
  color: ${props => props.theme.control__color};
`;

const NowPlayingContainer = styled.div`
  display: flex;
  align-items: center;
  width: 250px;
  padding-left: 6px;

  .track {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 250px;

    &__artwork {
      width: 60px;
      height: 60px;
      border-radius: 2px;
      text-decoration: none;
    }

    &__name {
      padding-left: 6px;
      width: 184px;
    }
  }

  .track-name {
    display: flex;
    flex-direction: column;

    &__name,
    &__artist {
      padding: 0;
      margin: 0;
      width: 184px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    &__name {
      margin-bottom: 0.5em;
      color: ${props => props.theme.control__color};
    }

    &__artist a {
      color: ${props => props.theme.control__color_mute};
      text-decoration: none;
    }
  }
`;

const MusicControlsContainer = styled.div`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
`;

const MusicControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 40px;
  font-size: 1.75em;
  padding-top: 0.5em;

  .control {
    position: relative;
    display: flex;
    transition: transform 256ms;
    will-change: transform;

    &_active {
      color: ${props => props.theme.primary};
    }

    &__state {
      position: absolute;
      top: -4px;
      right: 20px;
      width: 14px;
      height: 14px;
      padding: 0.25em 0.5em;
      border-radius: 50%;
      background-color: ${props => props.theme.primary};
      color: #fff;
      font-size: 9px;
      margin: 0 auto;
      text-align: center;
    }

    &:hover {
      transform: scale3d(1.075, 1.075, 1);
    }
  }

  & > * {
    padding: 0 1em;
  }
`;

// Now Playing: 250px
// Volume: 175px
// Queue: 50px
const MusicProgress = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 30px;
  width: calc(100vw - 475px);
  padding: 0 1em;
  cursor: default;

  .time {
    flex: 1 1 25px;
    padding: 0 0.75em;
    font-size: 0.8em;
  }

  .progress {
    flex: 1 1 auto;
  }
`;

const QueueContainer = styled(Link)`
  flex: 0 1 50px;
  height: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0 1em;
  cursor: pointer;
  text-decoration: none;
  color: ${props => props.theme.control__color};
  transition: transform 256ms;
  will-change: transform;

  &:active {
    transform: scale3d(0.95, 0.95, 1);
  }
`;

const VolumeContainer = styled.div`
  flex: 0 1 175px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0 1em;

  input[type="range"] {
    margin: 0 0.5em;
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
  <ControlsContainer>
    <NowPlayingContainer>
      {
        current !== null
          ? (
            <div className="track">
              {
                urlCurrentPlaying === null
                ? <div className="track__artwork" style={{ background: `transparent url('${BASE_S3}${current.track_album.album_cover.s3_name}') 50% 50% / cover no-repeat` }} />
                : <Link to={urlCurrentPlaying} className="track__artwork" style={{ background: `transparent url('${BASE_S3}${current.track_album.album_cover.s3_name}') 50% 50% / cover no-repeat` }} />
              }
              <div className="track__name track-name">
                <p className="track-name__name">{ current.track_name }</p>
                <div className="track-name__artist">
                  <ArtistList artists={current.track_album.album_artist} />
                </div>
              </div>
            </div>
          ) : null
      }
    </NowPlayingContainer>

    <MusicControlsContainer>
      <MusicControls>
        <div className={`control ${shuffle ? 'control_active' : ''}`} onClick={toggleShuffle}>
          <Shuffle />
        </div>

        <div className="control" onClick={previous}>
          <SkipBack />
        </div>

        <div className="control" onClick={togglePlayPause}>
          <PlayPause playing={playing} />
        </div>

        <div className="control" onClick={next}>
          <SkipForward />
        </div>

        <div className={`control ${repeat === 'OFF' ? '' : 'control_active'}`} onClick={setRepeat}>
          <Repeat />
          <div className="control__state" style={{ opacity: repeat === 'ONE' ? 1 : 0 }}>1</div>
        </div>
      </MusicControls>

      <MusicProgress>
        <div className="time">
          {`${playbackPosition === 0 ? '0:00' : human(playbackPosition)}`}
        </div>

        <Range
          type="range"
          min="0"
          max={duration}
          step="1"
          value={playbackPosition}
          className="progress"
          onChange={e => seek(e)}
        />

        <ClearButton className="time" onClick={toggleRemaining}>
          <span style={{ opacity: remaining ? 1 : 0 }}>-&nbsp;</span>
          <span>{`${remaining ? human(duration - playbackPosition) : human(duration)}`}</span>
        </ClearButton>
      </MusicProgress>
    </MusicControlsContainer>

    <QueueContainer to="/queue" id="queue-container">
      <List />
    </QueueContainer>

    <VolumeContainer>
      <Volume volume={volume} onClick={() => volume === 0 ? maxVolume() : muteVolume()} />

      <Range
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={volume}
        onChange={e => setVolume(e)}
      />
    </VolumeContainer>
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

module.exports = Control;
