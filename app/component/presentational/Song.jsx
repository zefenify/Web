import React from 'react';
import { func, number, string } from 'prop-types';
import styled from 'styled-components';

import { human } from '@app/util/time';

const SongContainer = styled.div`
  display: flex;
  flex-direction: row;

  div {
    flex: 1 1 auto;
    padding: 0.8em 0;
    border-bottom: 1px solid ${props => props.theme.controlBackground};
  }

  div {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .name {
    flex: 0 0 40%;
    padding-left: 2em;
  }

  .artist-name {
    flex: 0 0 30%;
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
  }
`;

function Song({ currentId, artistName, songId, songName, playtime, albumName, playSong }) {
  return (
    <SongContainer className={`${currentId === songId ? 'active' : ''}`} onDoubleClick={() => playSong(songId)}>
      <div className="name">{ songName }</div>
      <div className="artist-name">{ artistName }</div>
      <div className="album-name">{ albumName }</div>
      <div className="duration">{ human(playtime) }</div>
    </SongContainer>
  );
}

Song.propTypes = {
  currentId: number.isRequired,
  playSong: func.isRequired,
  artistName: string.isRequired,
  songId: number.isRequired,
  songName: string.isRequired,
  playtime: number.isRequired,
  albumName: string.isRequired,
};

module.exports = Song;
