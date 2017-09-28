import React from 'react';
import { string, func, shape, oneOf } from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'react-emotion';
import { withTheme } from 'theming';

import { BASE_S3 } from '@app/config/api';

import PlayPauseSVG from '@app/component/presentational/PlayPauseSVG';

const PlaylistContainer = withTheme(styled(Link)`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 0 0 25%;
  min-height: 25vh;
  padding: 0 1em;
  margin-bottom: 3em;
  text-decoration: none;
  color: inherit;

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
    flex: 0 0 20%;
  }

  .playlist-cover {
    position: relative;
    width: 100%;
    height: auto;
    min-height: 225px;
    border-radius: 6px;

    @media(min-width: 1284px) {
      height: 300px;
    }

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
        font-size: 80px;
        width: 80px;
        height: 80px;
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
    font-weight: bold;
    margin-top: 0.5em;
  }

  .playlist-description {
    padding: 0;
    margin: 0;
    margin-top: 0.5em;
    line-height: 1.25em;
    color: ${props => props.theme.controlMute};
  }

  .playlist-count {
    padding: 0;
    margin: 0;
    margin-top: 0.5em;
    color: ${props => props.theme.controlMute};
  }

  &:active {
    transform: scale(0.95);
  }
`);

function Playlist({ type, id, playingId, name, description, songCount, cover, play }) {
  return (
    <PlaylistContainer to={`/${type}/${id}`} className={`${id === playingId ? 'active' : ''}`}>
      <div className="playlist-cover" style={{ background: `transparent url('${BASE_S3}${cover.s3_name}') 50% 50% / cover no-repeat` }}>
        <div className="playlist-cover__overlay">
          <PlayPauseSVG
            onClick={(e) => { e.preventDefault(); play(id); }}
            playing={id === playingId}
          />
        </div>
      </div>

      <strong className="playlist-title">{ name }</strong>
      <p className="playlist-description">{ description }</p>
      <small className="playlist-count">{`${songCount} SONG${Number.parseInt(songCount, 10) > 1 ? 'S' : ''}`}</small>
    </PlaylistContainer>
  );
}

Playlist.propTypes = {
  type: oneOf(['featured', 'playlist']),
  id: string,
  playingId: string,
  name: string,
  description: string,
  songCount: string,
  cover: shape({}),
  play: func.isRequired,
};

Playlist.defaultProps = {
  type: 'playlist',
  id: -1,
  playingId: -1,
  name: '',
  description: '',
  songCount: 0,
  cover: {},
};

module.exports = Playlist;
