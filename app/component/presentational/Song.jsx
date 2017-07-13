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

  .track-number-container {
    position: relative;
    flex: 0 0 8%;
    padding-left: 2em;

    .track-number {
      display: block;
    }

    i {
      display: none;
      position: absolute;
      left: 1em;
      top: 4px;
      width: 1em;
      font-size: 2em;
    }
  }

  .name {
    flex: 0 0 37%;
  }

  .artist-name {
    flex: 0 0 25%;
  }

  .album-name {
    flex: 0 0 20%;
  }

  .duration {
    flex: 0 0 10%;
  }

  &.active {
    color: ${props => props.theme.primary};
  }

  &:hover {
    background-color: ${props => props.theme.controlBackground};

    .track-number-container {
      .track-number {
        display: none;
      }

      i {
        display: block;
      }
    }
  }
`;

const Song = ({
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
}) => (
  <SongContainer className={`${currentSongId === songId ? 'active' : ''}`} onDoubleClick={() => togglePlayPause(songId)}>
    <div className="track-number-container">
      <span className="track-number">{ trackNumber }</span>
      <i className={`icon-ion-ios-${currentSongId === songId && playing ? 'pause' : 'play'}`} onClick={() => togglePlayPause(songId)} />
    </div>
    <div className="name">{ songName }</div>
    <Link to={`/artist/${artistId}`} className="artist-name">{ artistName }</Link>
    <div className="album-name">{ albumName }</div>
    <div className="duration">{ human(playtime) }</div>
  </SongContainer>
);

Song.propTypes = {
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

module.exports = Song;
