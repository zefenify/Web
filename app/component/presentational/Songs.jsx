import React from 'react';
import { Link } from 'react-router-dom';
import { func, shape, bool, number, arrayOf } from 'prop-types';
import styled from 'react-emotion';

import DJKhaled from '@app/component/hoc/DJKhaled';
import Song from '@app/component/presentational/Song';
import Divider from '@app/component/styled/Divider';
import Button from '@app/component/styled/Button';

const SongsContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 0 0 auto;

  &.center-content {
    flex: 1 0 auto;
    justify-content: center;
    align-items: center;
  }

  .mute {
    color: ${props => props.theme.controlMute};
  }

  .songs {
    display: flex;
    flex-direction: column;
    flex: 0 0 auto;
    margin-bottom: 1em;

    &__title {
      margin: 0;
      margin-bottom: -0.15em;
    }

    &__info {
      color: ${props => props.theme.controlMute};
    }

    &__button {
      width: 175px;
      margin-bottom: 1em;
    }
  }

  .song {
    flex: 1 1 auto;

    & > *:last-child {
      margin-bottom: 1px;
    }
  }
`;

const Songs = ({
  playing,
  current,
  user,
  songs,
  totalDuration,
  playingSongs,
  togglePlayPauseSongs,
  togglePlayPauseSong,
  contextMenuSong,
}) => {
  if (user === null) {
    return (
      <SongsContainer className="center-content">
        <h2 className="mute">You need to be logged in to view saved songs</h2>
        <Link to="/setting"><Button outline>Go to Settings</Button></Link>
      </SongsContainer>
    );
  }

  if (songs.length === 0) {
    return (
      <SongsContainer className="center-content">
        <h2 className="mute">You have no saved songs...yet</h2>
      </SongsContainer>
    );
  }

  const { hours, minutes, seconds } = totalDuration;

  return (
    <SongsContainer>
      <div className="songs">
        <h1 className="songs__title">Songs</h1>
        <p className="songs__info">{`${songs.length} song${songs.length > 1 ? 's' : ''}, ${hours > 0 ? `${hours} hr` : ''} ${minutes} min ${hours > 0 ? '' : `${seconds} sec`}`}</p>
        <Button className="songs__button" onClick={() => togglePlayPauseSongs(playingSongs, songs)}>{`${(playing && playingSongs) ? 'PAUSE' : 'PLAY'}`}</Button>
      </div>

      <Divider />

      <div className="song">
        {
          songs.map((song, index) => (
            <Song
              key={song.track_id}
              currentSongId={current === null ? '' : current.track_id}
              trackNumber={index + 1}
              togglePlayPause={() => togglePlayPauseSong(index, song, current, songs)}
              playing={playing && playingSongs}
              songId={song.track_id}
              songName={song.track_name}
              songFeaturing={song.track_featuring}
              songDuration={song.track_track.s3_meta.duration}
              songAlbum={song.track_album}
              contextMenuSong={songId => contextMenuSong(songId, songs)}
            />
          ))
        }
      </div>
    </SongsContainer>
  );
};

Songs.propTypes = {
  playing: bool,
  current: shape({}),
  user: shape({}),
  songs: arrayOf(shape({})),
  totalDuration: shape({
    hours: number,
    minutes: number,
    seconds: number,
  }),
  playingSongs: bool,
  togglePlayPauseSongs: func.isRequired,
  togglePlayPauseSong: func.isRequired,
  contextMenuSong: func.isRequired,
};

Songs.defaultProps = {
  playing: false,
  current: null,
  user: null,
  songs: [],
  totalDuration: {
    hours: 0,
    minutes: 0,
    seconds: 0,
  },
  playingSongs: false,
};

module.exports = DJKhaled(Songs);
