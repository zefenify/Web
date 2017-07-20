import React from 'react';
import { bool, number, string, arrayOf, shape, func } from 'prop-types';
import styled from 'emotion/react';

import { BASE } from '@app/config/api';

import Button from '@app/component/styled/Button';

const Featured = styled.div`
  flex: 1 0 auto;
  display: flex;
  flex-direction: row;
  padding: 1em 2em;

  .image {
    flex: 0 0 200px;
    height: 200px;
    width: 200px;
    border: 1px solid rgba(51, 51, 51, 0.25);
    border-radius: 50%;
  }

  .info {
    margin-left: 1em;

    & > * {
      margin: 0;
    }

    & > p:not(:first-child) {
      color: ${props => props.theme.controlMute};
    }
  }

  .featured-info {
    display: flex;
    flex-direction: column;
    justify-content: center;

    &__button {
      margin-top: 1em;
      width: 175px;
    }
  }
`;

const PlaylistHeader = ({
  playlist,
  thumbnail,
  title,
  songs,
  duration,
  playing,
  togglePlayPause,
}) => {
  const { hours, minutes, seconds } = duration;

  return (
    <Featured>
      <div className="image" style={{ background: `transparent url('${BASE}${thumbnail}') 50% 50% / cover no-repeat` }} />
      <div className="info featured-info">
        <p>{`${playlist ? 'PLAYLIST' : 'FEATURED'}`}</p>
        <h1>{ title }</h1>
        <p style={{ marginTop: '0.5em' }}>{`${songs.length} song${songs.length > 1 ? 's' : ''}, ${hours > 0 ? `${hours} hr` : ''} ${minutes} min ${hours > 0 ? '' : `${seconds} sec`}`}</p>
        <Button className="featured-info__button" onClick={togglePlayPause}>{`${playing ? 'PAUSE' : 'PLAY'}`}</Button>
      </div>
    </Featured>
  );
};

PlaylistHeader.propTypes = {
  playlist: bool,
  thumbnail: string,
  title: string,
  songs: arrayOf(shape({})),
  duration: shape({
    hours: number,
    minutes: number,
    seconds: number,
  }),
  playing: bool,
  togglePlayPause: func.isRequired,
};

PlaylistHeader.defaultProps = {
  playlist: true,
  thumbnail: '',
  title: 'Title',
  songs: [],
  duration: {
    hours: 0,
    minutes: 0,
    seconds: 0,
  },
  playing: false,
};

module.exports = PlaylistHeader;
