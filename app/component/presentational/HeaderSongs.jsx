import React from 'react';
import { bool, number, string, arrayOf, shape, func } from 'prop-types';
import styled from 'emotion/react';

import { BASE } from '@app/config/api';

import DJKhaled from '@app/component/hoc/DJKhaled';

import Button from '@app/component/styled/Button';
import Divider from '@app/component/styled/Divider';
import Song from '@app/component/presentational/Song';

const HeaderSongsContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 0 0 auto;
`;

const Header = styled.div`
  flex: 1 0 auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 2em;

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

  .info-container {
    display: flex;
    flex-direction: column;
    justify-content: center;

    &__button {
      margin-top: 1em;
      width: 175px;
    }
  }
`;

const Songs = styled.div`
  flex: 1 0 auto;

  & > *:last-child {
    margin-bottom: 1px;
  }
`;

const HeaderSongs = ({
  playlist,
  thumbnail,
  title,
  current,
  playing,
  playingSongs,
  songs,
  duration,
  togglePlayPauseAll,
  togglePlayPauseSong,
}) => {
  const { hours, minutes, seconds } = duration;

  return (
    <HeaderSongsContainer>
      <Header>
        <div className="image" style={{ background: `transparent url('${BASE}${thumbnail}') 50% 50% / cover no-repeat` }} />
        <div className="info info-container">
          <p>{`${playlist ? 'PLAYLIST' : 'FEATURED'}`}</p>
          <h1>{ title }</h1>
          <p style={{ marginTop: '0.5em' }}>{`${songs.length} song${songs.length > 1 ? 's' : ''}, ${hours > 0 ? `${hours} hr` : ''} ${minutes} min ${hours > 0 ? '' : `${seconds} sec`}`}</p>
          <Button className="info-container__button" onClick={togglePlayPauseAll}>{`${playingSongs ? 'PAUSE' : 'PLAY'}`}</Button>
        </div>
      </Header>

      <Divider />

      <Songs>
        {
          songs.map((song, index) => (
            <Song
              key={song.songId}
              currentSongId={current === null ? -1 : current.songId}
              trackNumber={index + 1}
              togglePlayPause={togglePlayPauseSong}
              playing={playing}
              {...song}
            />
          ))
        }
      </Songs>
    </HeaderSongsContainer>
  );
};

HeaderSongs.propTypes = {
  playlist: bool,
  thumbnail: string,
  title: string,
  current: shape({}),
  songs: arrayOf(shape({})),
  duration: shape({
    hours: number,
    minutes: number,
    seconds: number,
  }),
  playing: bool,
  playingSongs: bool,
  togglePlayPauseAll: func.isRequired,
  togglePlayPauseSong: func.isRequired,
};

HeaderSongs.defaultProps = {
  playlist: true,
  thumbnail: '',
  title: '',
  current: null,
  songs: [],
  duration: {
    hours: 0,
    minutes: 0,
    seconds: 0,
  },
  playing: false,
  playingSongs: false,
};

module.exports = DJKhaled()(HeaderSongs);
