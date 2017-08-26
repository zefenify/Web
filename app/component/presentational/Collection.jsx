import React from 'react';
import { string, func, shape } from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'emotion/react';
import { withTheme } from 'theming';

import { BASE_S3 } from '@app/config/api';

import PlayPauseSVG from '@app/component/presentational/PlayPauseSVG';

const CollectionContainer = withTheme(styled(Link)`
  position: relative;
  flex: 0 0 25%;
  min-height: 25vh;
  padding: 0 1em;
  margin-bottom: 3em;
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;

  &.active {
    color: ${props => props.theme.primary};
  }

  &:not(.active) {
    & svg {
      color: #fff !important;
    }
  }

  @media(min-width: 1282px) {
    flex: 0 0 20%;
  }

  & .collection-cover {
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

      & svg {
        display: flex;
        justify-content: center;
        align-items: center;
        color: inherit;
        font-size: 80px;
        width: 80px;
        height: 80px;
      }
    }

    & .collection-cover__overlay {
      opacity: 0;
    }

    &:hover .collection-cover__overlay {
      opacity: 1;
    }
  }

  & .collection-title {
    padding: 0;
    margin: 0;
    font-weight: bold;
    margin-top: 0.5em;
  }

  & .collection-description {
    padding: 0;
    margin: 0;
    margin-top: 0.5em;
  }

  & .collection-count {
    padding: 0;
    margin: 0;
    margin-top: 0.5em;
  }

  &:active {
    transform: scale(0.95);
  }
`);

function Collection({ id, playingId, name, description, songCount, cover, play }) {
  return (
    <CollectionContainer to={`/featured/${id}`} className={`${id === playingId ? 'active' : ''}`}>
      <div className="collection-cover" style={{ background: `transparent url('${BASE_S3}${cover.s3_name}') 50% 50% / cover no-repeat` }}>
        <div className="collection-cover__overlay">
          <PlayPauseSVG
            onClick={(e) => { e.preventDefault(); play(id); }}
            playing={id === playingId}
          />
        </div>
      </div>

      <strong className="collection-title">{ name }</strong>
      <p className="collection-description">{ description }</p>
      <small className="collection-count">{`${songCount} SONG${Number.parseInt(songCount, 10) > 1 ? 'S' : ''}`}</small>
    </CollectionContainer>
  );
}

Collection.propTypes = {
  id: string,
  playingId: string,
  name: string,
  description: string,
  songCount: string,
  cover: shape({}),
  play: func.isRequired,
};

Collection.defaultProps = {
  id: -1,
  playingId: -1,
  name: '',
  description: '',
  songCount: 0,
  cover: {},
};

module.exports = Collection;
