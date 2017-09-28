import React from 'react';
import { bool, number, string, arrayOf, shape, func } from 'prop-types';
import styled from 'react-emotion';
import { withTheme } from 'theming';

import { BASE_S3 } from '@app/config/api';

import DJKhaled from '@app/component/hoc/DJKhaled';

import Button from '@app/component/styled/Button';
import Divider from '@app/component/styled/Divider';
import Song from '@app/component/presentational/Song';

const HeaderSongsContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 0 0 auto;
`;

const Header = withTheme(styled.div`
  flex: 1 0 auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 2em;

  & .image {
    flex: 0 0 200px;
    height: 200px;
    width: 200px;
    border-radius: 4px;
  }

  & .info {
    margin-left: 1em;

    & > * {
      margin: 0;
    }
  }

  & .info-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    max-width: calc(100vw - (400px + 5em));

    &__type {
      text-transform: uppercase;
    }

    &__title {
      flex: 1 0 auto;
      text-transform: capitalize;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    &__description {
      font-size: 1.2em;
      line-height: 1.25em;
      color: ${props => props.theme.controlMute};
    }

    &__duration {
      margin-top: 0.5em;
      color: ${props => props.theme.controlMute};
    }

    &__button {
      margin-top: 1em;
      width: 175px;
    }
  }
`);

const Songs = styled.div`
  flex: 1 0 auto;

  & > *:last-child {
    margin-bottom: 1px;
  }
`;

const HeaderSongs = ({
  type,
  title,
  description,
  cover,
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
        <div className="image" style={{ background: `transparent url('${BASE_S3}${cover.s3_name}') 50% 50% / cover no-repeat` }} />
        <div className="info info-container">
          <p className="info-container__type">{type}</p>
          <h1 className="info-container__title">{title}</h1>
          <p className="info-container__description">{description}</p>
          <p className="info-container__duration">{`${songs.length} song${songs.length > 1 ? 's' : ''}, ${hours > 0 ? `${hours} hr` : ''} ${minutes} min ${hours > 0 ? '' : `${seconds} sec`}`}</p>
          <Button className="info-container__button" onClick={togglePlayPauseAll}>{`${playingSongs ? 'PAUSE' : 'PLAY'}`}</Button>
        </div>
      </Header>

      <Divider />

      <Songs>
        {
          songs.map((song, index) => (
            <Song
              key={song.track_id}
              currentSongId={current === null ? -1 : current.track_id}
              trackNumber={index + 1}
              togglePlayPause={togglePlayPauseSong}
              playing={playing}
              songId={song.track_id}
              songName={song.track_name}
              songFeaturing={song.track_featuring}
              songDuration={song.track_track.s3_meta.duration}
              songAlbum={song.track_album}
            />
          ))
        }
      </Songs>
    </HeaderSongsContainer>
  );
};

HeaderSongs.propTypes = {
  type: string,
  cover: shape({}),
  title: string,
  description: string,
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
  type: 'playlist',
  cover: {},
  title: '',
  description: '',
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
