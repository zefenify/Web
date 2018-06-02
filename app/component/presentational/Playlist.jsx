import React from 'react';
import { string, bool, func, number, shape, oneOf } from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'react-emotion';

import { BASE_S3 } from '@app/config/api';

import PlayPause from '@app/component/svg/PlayPause';
import ImageContainer from '@app/component/styled/ImageContainer';

const PlaylistContainer = styled(Link)`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 25%;
  padding: 0 1rem;
  padding-bottom: 2rem;
  text-decoration: none;
  color: inherit;
  transition: transform 128ms;
  will-change: transform;

  &.active {
    color: ${props => props.theme.primary};

    .playlist-title {
      color: ${props => props.theme.primary};
    }
  }

  &:not(.active) {
    svg {
      color: #fff !important;
    }
  }

  @media(min-width: 1282px) {
    width: 20%;
  }

  .playlist-cover {
    position: relative;

    &__overlay {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(51, 51, 51, 0.75);
      border-radius: 6px;

      svg {
        display: flex;
        justify-content: center;
        align-items: center;
        color: inherit;
        width: 64px;
        height: 64px;
      }
    }

    .playlist-cover__overlay {
      opacity: 0;
    }

    &:hover .playlist-cover__overlay {
      opacity: 1;
    }
  }

  .playlist-title {
    padding: 0;
    margin: 0;
    line-height: 125%;
    font-size: 1.25em;
    font-weight: bold;
    margin-top: 0.5em;
  }

  .playlist-description {
    padding: 0;
    margin: 0;
    margin-top: 0.5em;
    line-height: 1.25em;
    color: ${props => props.theme.mute};
  }

  .playlist-count {
    padding: 0;
    margin: 0;
    margin-top: 0.5em;
    color: ${props => props.theme.mute};
  }

  &:active {
    transform: scale3d(0.95, 0.95, 1);
  }
`;

function Playlist({
  type,
  id,
  playing,
  playingId,
  name,
  description,
  trackCount,
  cover,
  play,
}) {
  return (
    <PlaylistContainer to={`/${type}/${id}`} className={`${id === playingId ? 'active' : ''}`}>
      <div className="playlist-cover">
        <ImageContainer>
          <img src={`${BASE_S3}${cover.s3_name}`} alt={name} />
        </ImageContainer>

        <div className="playlist-cover__overlay">
          <PlayPause
            onClick={(e) => { e.preventDefault(); play(id); }}
            playing={id === playingId && playing}
          />
        </div>
      </div>

      <strong className="playlist-title">{ name }</strong>
      <p className="playlist-description">{ description }</p>
      <small className="playlist-count">{`${trackCount} SONG${trackCount > 1 ? 'S' : ''}`}</small>
    </PlaylistContainer>
  );
}

Playlist.propTypes = {
  type: oneOf(['featured', 'playlist']),
  id: string,
  playing: bool,
  playingId: string,
  name: string,
  description: string,
  trackCount: number,
  cover: shape({}),
  play: func.isRequired,
};

Playlist.defaultProps = {
  type: 'playlist',
  id: '',
  playing: false,
  playingId: '',
  name: '',
  description: '',
  trackCount: 0,
  cover: {},
};

module.exports = Playlist;
