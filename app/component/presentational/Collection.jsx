import React from 'react';
import { string, func } from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'emotion/react';
import { withTheme } from 'theming';

import { BASE } from '@app/config/api';

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
    i {
      color: #fff !important;
    }
  }

  @media(min-width: 1282px) {
    flex: 0 0 20%;
  }

  & .collection-cover {
    position: relative;
    width: 100%;
    height: 225px;
    border: 1px solid rgba(51, 51, 51, 0.25);
    border-radius: 6px;

    @media(min-width: 1284px) {
      height: 300px;
    }

    &__overlay {
      position: absolute;
      top: -1px;
      right: -1px;
      bottom: -1px;
      left: -1px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(51, 51, 51, 0.75);
      border-radius: 6px;

      & i {
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

function Collection({ id, playingId, name, description, songCnt, thumbnail, play }) {
  return (
    <CollectionContainer to={`/featured/${id}`} className={`${id === playingId ? 'active' : ''}`}>
      <div className="collection-cover" style={{ background: `transparent url('${BASE}${thumbnail}') 50% 50% / cover no-repeat` }}>
        <div className="collection-cover__overlay">
          <i onClick={(e) => { e.preventDefault(); play(id); }} className={`icon-ion-ios-${id === playingId ? 'pause' : 'play'}`} />
        </div>
      </div>

      <strong className="collection-title">{ name }</strong>
      <p className="collection-description">{ description }</p>
      <small className="collection-count">{`${songCnt} SONG${Number.parseInt(songCnt, 10) > 1 ? 'S' : ''}`}</small>
    </CollectionContainer>
  );
}

Collection.propTypes = {
  id: string,
  playingId: string,
  name: string,
  description: string,
  songCnt: string,
  thumbnail: string,
  play: func.isRequired,
};

Collection.defaultProps = {
  id: '-1',
  playingId: '-1',
  name: '',
  description: '',
  songCnt: '',
  thumbnail: '',
};

module.exports = Collection;
