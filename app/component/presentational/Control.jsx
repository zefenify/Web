import React from 'react';
import { func, bool, string, number, oneOfType, object } from 'prop-types';
import styled from 'react-emotion';

import { BASE_S3 } from '@app/config/api';
import { human } from '@app/util/time';

import DJKhaled from '@app/component/hoc/DJKhaled';
import { ControlsContainer } from '@app/component/styled/WolfCola';
import ArtistList from '@app/component/presentational/ArtistList';
import Range from '@app/component/styled/Range';

const SkipBack = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="19 20 9 12 19 4 19 20" fill="currentColor" />
    <line x1="5" y1="19" x2="5" y2="5" />
  </svg>
);

const SkipForward = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="5 4 15 12 5 20 5 4" fill="currentColor" />
    <line x1="19" y1="5" x2="19" y2="19" />
  </svg>
);

const Repeat = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="17 1 21 5 17 9" />
    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
    <polyline points="7 23 3 19 7 15" />
    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
  </svg>
);

const Shuffle = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="16 3 21 3 21 8" />
    <line x1="4" y1="20" x2="21" y2="3" />
    <polyline points="21 16 21 21 16 21" />
    <line x1="15" y1="15" x2="21" y2="21" />
    <line x1="4" y1="4" x2="9" y2="9" />
  </svg>
);

const PlayPause = ({ playing }) => (
  <svg
    width="34"
    height="34"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {
      playing ?
        <g>
          <circle cx="12" cy="12" r="10" />
          <line x1="10" y1="15" x2="10" y2="9" />
          <line x1="14" y1="15" x2="14" y2="9" />
        </g>
        :
        <g>
          <circle cx="12" cy="12" r="10" />
          <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
        </g>
    }
  </svg>
);

PlayPause.propTypes = {
  playing: bool,
};

PlayPause.defaultProps = {
  playing: true,
};

const Volume = ({ onClick, volume }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    onClick={onClick}
  >
    {
      volume > 0.6 ?
        <g>
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
        </g>

        :

        volume === 0 ?
          <g>
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </g>

          :

          <g>
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          </g>
    }
  </svg>
);

Volume.propTypes = {
  onClick: func.isRequired,
  volume: number,
};

Volume.defaultProps = {
  volume: 0,
};

const Circle = props => (
  <svg
    width="4"
    height="4"
    viewBox="0 0 2 2"
    fill="currentColor"
    stroke="none"
    strokeWidth="1"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="1" cy="1" r="1" />
  </svg>
);

const NowPlayingContainer = styled.div`
  flex: 0 1 250px;
  max-width: 250px;
  padding-left: 6px;
  display: flex;
  align-items: center;

  .track {
    display: flex;
    flex-direction: row;
    align-items: center;
    max-width: 250px;

    &__artwork {
      flex: 0 0 60px;
      width: 60px;
      height: 60px;
      border-radius: 2px;
    }

    &__name {
      padding-left: 6px;
      flex: 0 0 184px;
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
      color: ${props => props.theme.controlText};
    }

    &__artist a {
      color: ${props => props.theme.controlMute};
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
  flex: 0 0 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-size: 1.75em;
  padding-top: 0.25em;

  .control {
    position: relative;
    display: flex;

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

    &__accessibility {
      position: absolute;
      display: flex;
      flex-direction: row;
      justify-content: center;
      font-size: 6px;
      left: 0;
      right: 0;
      bottom: -8px;
      margin: 0 auto;
    }

    &:hover {
      transform: scale(1.075);
    }
  }

  & > * {
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
}) => (
  <ControlsContainer>
    <NowPlayingContainer>
      {
        current !== null
          ? (
            <div className="track">
              <div className="track__artwork" style={{ background: `transparent url('${BASE_S3}${current.track_album.album_cover.s3_name}') 50% 50% / cover no-repeat` }} />
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
          <Circle className="control__accessibility" style={{ opacity: shuffle ? 1 : 0 }} />
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
          <Circle className="control__accessibility" style={{ opacity: (repeat === 'ONE' || repeat === 'ALL') ? 1 : 0 }} />
        </div>
      </MusicControls>

      <MusicProgress>
        <small style={{ padding: '0 0.5em 0 8%' }}>
          {`${playbackPosition === null ? '0:00' : human(playbackPosition)} `}
        </small>

        <Range
          type="range"
          min="0"
          max={duration}
          step="1"
          value={playbackPosition}
          onChange={e => seek(e)}
        />

        <small style={{ padding: '0 8% 0 0.5em' }} onClick={toggleRemaining}>
          <span style={{ opacity: remaining ? 1 : 0 }}>-&nbsp;</span>
          <span>{`${remaining ? human(duration - playbackPosition) : human(duration)}`}</span>
        </small>
      </MusicProgress>
    </MusicControlsContainer>

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
  current: oneOfType([object]),
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
};

module.exports = DJKhaled(Control);
