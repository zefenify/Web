import React from 'react';
import {
  string,
  bool,
  func,
  number,
  shape,
  oneOf,
} from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'react-emotion';

import { BASE_S3 } from '@app/config/api';
import PlayPause from '@app/component/svg/PlayPause';
import ImageContainer from '@app/component/styled/ImageContainer';


const PlaylistContainer = styled(Link)`
  position: relative;
  width: 25%;
  text-decoration: none;
  color: ${props => props.theme.PRIMARY_4};
  transition: transform 128ms;

  &.active {
    .__playlist-title {
      color: ${props => props.theme.PRIMARY_4};
    }

    .__playlist-description {
      color: ${props => props.theme.PRIMARY_4};
    }

    .__playlist-count {
      color: ${props => props.theme.PRIMARY_5};
    }
  }

  &:not(.active) {
    svg {
      color: hsl(0, 0%, 100%) !important;
    }
  }

  @media(min-width: 1282px) {
    width: 20%;
  }

  .__playlist-cover {
    position: relative;

    &__overlay {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-color: rgba(51, 51, 51, 0.75);
      border-radius: 6px;

      svg {
        color: inherit;
        width: 64px;
        height: 64px;
      }
    }

    .__playlist-cover__overlay {
      opacity: 0;
    }

    &:hover .__playlist-cover__overlay {
      opacity: 1;
    }
  }

  .__playlist-title {
    line-height: 125%;
    font-size: 1.25em;
    font-weight: bold;
    color: ${props => props.theme.NATURAL_2};
  }

  .__playlist-description {
    color: ${props => props.theme.NATURAL_2};
  }

  .__playlist-count {
    color: ${props => props.theme.NATURAL_4};
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
    <PlaylistContainer to={`/${type}/${id}`} className={`d-flex flex-column flex-shrink-0 py-0 px-3 mb-4 ${id === playingId ? 'active' : ''}`}>
      <div className="__playlist-cover">
        <ImageContainer>
          <img src={`${BASE_S3}${cover.s3_name}`} alt={name} />
        </ImageContainer>

        <div className="d-flex align-items-center justify-content-center __playlist-cover__overlay">
          <PlayPause
            strokeWidth="1px"
            playing={id === playingId && playing}
            onClick={(event) => { event.preventDefault(); play(id); }}
          />
        </div>
      </div>

      <strong className="m-0 p-0 mt-2 __playlist-title">{ name }</strong>
      <p className="m-0 p-0 mt-2 __playlist-description">{ description }</p>
      <small className="m-0 p-0 mt-2 __playlist-count">{`${trackCount} SONG${trackCount > 1 ? 'S' : ''}`}</small>
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

export default Playlist;
