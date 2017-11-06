import React from 'react';
import { bool, number, string, arrayOf, shape, func } from 'prop-types';
import styled from 'react-emotion';

import { BASE_S3 } from '@app/config/api';

import DJKhaled from '@app/component/hoc/DJKhaled';
import ArtistList from '@app/component/presentational/ArtistList';
import Button from '@app/component/styled/Button';
import { Share } from '@app/component/presentational/SVG';
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
    border-radius: 6px;
    border: 1px solid ${props => props.theme.listDivider};
  }

  .info {
    margin-left: 1em;
  }

  .info-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    max-width: calc(100vw - (400px + 5em));

    &__type {
      margin: 0;
      text-transform: uppercase;
    }

    &__title {
      margin: 0;
      flex: 1 0 auto;
      text-transform: capitalize;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    &__by {
      margin: 0;
      font-size: 1em;
      margin-top: 0.5em;

      a {
        font-size: 1.25em;
        text-decoration: none;
        color: inherit;
      }
    }

    &__duration {
      margin: 0;
      margin-top: 0.5em;
      color: ${props => props.theme.controlMute};
    }

    .play-share {
      margin-top: 1em;
    }
  }

  .text-muted {
    color: ${props => props.theme.controlMute};
  }
`;

const Songs = styled.div`
  flex: 1 0 auto;

  & > *:last-child {
    margin-bottom: 1px;
  }
`;

const HeaderSongs = ({
  title,
  cover,
  artist,
  songs,
  current,
  playing,
  albumPlaying,
  duration,
  albumPlayPause,
  songPlayPause,
  contextMenuAlbum,
  contextMenuSong,
}) => {
  const { hours, minutes, seconds } = duration;

  return (
    <HeaderSongsContainer>
      <Header>
        <div className="image" style={{ background: `transparent url('${BASE_S3}${cover.s3_name}') 50% 50% / cover no-repeat` }} />
        <div className="info info-container">
          <p className="info-container__type">ALBUM</p>
          <h1 className="info-container__title">{ title }</h1>
          <p className="info-container__by">
            <span className="text-muted">By&nbsp;</span>
            <ArtistList artists={artist} />
          </p>
          <p className="info-container__duration">{`${songs.length} song${songs.length > 1 ? 's' : ''}, ${hours > 0 ? `${hours} hr` : ''} ${minutes} min ${hours > 0 ? '' : `${seconds} sec`}`}</p>

          <div className="play-share">
            <Button className="play-share__play-big" onClick={albumPlayPause}>{`${albumPlaying && playing ? 'PAUSE' : 'PLAY'}`}</Button>
            <Button className="play-share__share" outline noPadding onClick={contextMenuAlbum}><Share /></Button>
          </div>
        </div>
      </Header>

      <Divider />

      <Songs>
        {
          songs.map((song, index) => (
            <Song
              fullDetail={false}
              key={song.track_id}
              currentSongId={current === null ? '' : current.track_id}
              trackNumber={index + 1}
              togglePlayPause={songPlayPause}
              playing={playing}
              songId={song.track_id}
              songName={song.track_name}
              songFeaturing={song.track_featuring}
              songDuration={song.track_track.s3_meta.duration}
              songAlbum={song.track_album}
              contextMenuSong={contextMenuSong}
            />
          ))
        }
      </Songs>
    </HeaderSongsContainer>
  );
};

HeaderSongs.propTypes = {
  cover: shape({}),
  title: string,
  artist: arrayOf(shape({})),
  current: shape({}),
  songs: arrayOf(shape({})),
  duration: shape({
    hours: number,
    minutes: number,
    seconds: number,
  }),
  playing: bool,
  albumPlaying: bool,
  albumPlayPause: func.isRequired,
  songPlayPause: func.isRequired,
  contextMenuAlbum: func.isRequired,
  contextMenuSong: func.isRequired,
};

HeaderSongs.defaultProps = {
  cover: {},
  title: '',
  artist: [],
  current: null,
  songs: [],
  duration: {
    hours: 0,
    minutes: 0,
    seconds: 0,
  },
  playing: false,
  albumPlaying: false,
};

module.exports = DJKhaled(HeaderSongs);
