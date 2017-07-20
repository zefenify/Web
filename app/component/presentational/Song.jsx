import React from 'react';
import { func, number, string, bool } from 'prop-types';
import styled from 'emotion/react';
import { Link } from 'react-router-dom';

import { human } from '@app/util/time';

const SongContainer = styled.div`
  display: flex;
  flex-direction: row;

  & > * {
    flex: 1 1 auto;
    padding: 0.8em 0;
    border-bottom: 1px solid ${props => props.theme.controlBackground};
  }

  & > * {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  a {
    text-decoration: none;
    color: inherit;

    &:hover {
      color: ${props => props.theme.primary};
    }
  }

  .track-number-icon {
    position: relative;
    flex: 0 0 5%;
    padding-left: 0.5em;

    &__number {
      display: block;
    }

    &__icon {
      display: none;
      position: absolute;
      left: 0.25em;
      top: 6px;
      width: 1em;
      font-size: 2em;
    }
  }

  .name {
    flex: 1 0 auto;
  }

  .artist-name {
    flex: 0 0 25%;
  }

  .album-name {
    flex: 0 0 20%;
  }

  .duration {
    padding-right: 0.5em;
    flex: 0 0 8%;
    text-align: right;
  }

  &.active {
    color: ${props => props.theme.primary};
  }

  &:hover {
    background-color: ${props => props.theme.controlBackground};

    .track-number-icon {
      &__number {
        display: none;
      }

      &__icon {
        display: block;
      }
    }
  }
`;

const Song = ({
  fullDetail,
  currentSongId,
  artistId,
  songId,
  trackNumber,
  songName,
  artistName,
  albumName,
  playtime,
  togglePlayPause,
  playing,
}) => {
  if (fullDetail === false) {
    return (
      <SongContainer className={`${currentSongId === songId ? 'active' : ''}`} onDoubleClick={() => togglePlayPause(songId)}>
        <div className="track-number-icon">
          <span className="track-number-icon__number">{ trackNumber }</span>
          <i className={`track-number-icon__icon icon-ion-ios-${currentSongId === songId && playing ? 'pause' : 'play'}`} onClick={() => togglePlayPause(songId)} />
        </div>
        <div className="name">{ songName }</div>
        <div className="duration">{ human(playtime) }</div>
      </SongContainer>
    );
  }

  return (
    <SongContainer className={`${currentSongId === songId ? 'active' : ''}`} onDoubleClick={() => togglePlayPause(songId)}>
      <div className="track-number-icon">
        <span className="track-number-icon__number">{ trackNumber }</span>
        <i className={`track-number-icon__icon icon-ion-ios-${currentSongId === songId && playing ? 'pause' : 'play'}`} onClick={() => togglePlayPause(songId)} />
      </div>
      <div className="name">{ songName }</div>
      <Link to={`/artist/${artistId}`} className="artist-name">{ artistName }</Link>
      <div className="album-name">{ albumName }</div>
      <div className="duration">{ human(playtime) }</div>
    </SongContainer>
  );
};

Song.propTypes = {
  fullDetail: bool,
  currentSongId: number.isRequired,
  artistId: number.isRequired,
  songId: number.isRequired,
  trackNumber: number.isRequired,
  songName: string.isRequired,
  artistName: string.isRequired,
  albumName: string.isRequired,
  playtime: number.isRequired,
  togglePlayPause: func.isRequired,
  playing: bool.isRequired,
};

Song.defaultProps = {
  fullDetail: true,
};

module.exports = Song;
