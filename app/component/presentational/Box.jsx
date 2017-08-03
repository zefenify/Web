import React from 'react';
import { string, func } from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'emotion/react';

import { BASE } from '@app/config/api';

const BoxContainer = styled(Link)`
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

  // non-full screen view
  @media(max-width: 992px) {
    flex: 0 0 33.333%;
  }

  // big screens
  @media(min-width: 1281px) {
    flex: 0 0 20%;
  }

  .box-cover {
    position: relative;
    width: 100%;
    height: 225px;
    border: 1px solid rgba(51, 51, 51, 0.25);
    border-radius: 6px;

    // no-full screen view
    @media(max-width: 992px) {
      height: 175px;
    }

    // big screens
    @media(min-width: 1281px) {
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

      i {
        display: flex;
        justify-content: center;
        align-items: center;
        color: inherit;
        font-size: 80px;
        width: 80px;
        height: 80px;
      }
    }

    & .box-cover__overlay {
      opacity: 0;
    }

    &:hover .box-cover__overlay {
      opacity: 1;
    }
  }

  .box-title {
    padding: 0;
    margin: 0;
    font-size: 1.25em;
    margin-top: 0.5em;
  }

  &:active {
    transform: scale(0.95);
  }
`;

function Box({ title, thumbnail, data, boxPlayingData, play }) {
  return (
    <BoxContainer to={`/genre/${data}`} className={`${boxPlayingData === data ? 'active' : ''}`}>
      <div className="box-cover" style={{ background: `transparent url('${BASE}${thumbnail}') 50% 50% / cover no-repeat` }}>
        <div className="box-cover__overlay">
          <i onClick={(e) => { e.preventDefault(); play(data); }} className={`icon-ion-ios-${data === boxPlayingData ? 'pause' : 'play'}`} />
        </div>
      </div>

      <strong className="box-title">{ title }</strong>
    </BoxContainer>
  );
}

Box.propTypes = {
  title: string,
  thumbnail: string,
  data: string,
  boxPlayingData: string,
  play: func.isRequired,
};

Box.defaultProps = {
  title: '',
  thumbnail: '',
  data: '',
  boxPlayingData: '',
};

module.exports = Box;
