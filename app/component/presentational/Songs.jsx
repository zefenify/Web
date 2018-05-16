import React from 'react';
import { Link } from 'react-router-dom';
import { func, shape, bool, number, arrayOf } from 'prop-types';
import styled from 'react-emotion';

import Track from '@app/component/presentational/Track';
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
    color: ${props => props.theme.mute};
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
      color: ${props => props.theme.mute};
    }

    &__button {
      width: 175px;
      margin-bottom: 1em;
    }
  }

  .track {
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
  songsPlaying,
  songsPlayPause,
  trackPlayPause,
  contextMenuTrack,
}) => {
  if (user === null) {
    return (
      <SongsContainer className="center-content">
        <h2 className="mute">You need to be logged in to view saved songs</h2>
        <Link to="/settings"><Button border themeColor backgroundColor="transparent">Go to Settings</Button></Link>
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
        <Button className="songs__button" onClick={songsPlayPause}>{`${(playing && songsPlaying) ? 'PAUSE' : 'PLAY'}`}</Button>
      </div>

      <Divider />

      <div className="track">
        {
          songs.map((track, index) => (
            <Track
              key={track.track_id}
              currentTrackId={current === null ? '' : current.track_id}
              trackNumber={index + 1}
              trackPlayPause={trackPlayPause}
              playing={playing}
              trackId={track.track_id}
              trackName={track.track_name}
              trackFeaturing={track.track_featuring}
              trackDuration={track.track_track.s3_meta.duration}
              trackAlbum={track.track_album}
              contextMenuTrack={contextMenuTrack}
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
  songsPlaying: bool,
  songsPlayPause: func.isRequired,
  trackPlayPause: func.isRequired,
  contextMenuTrack: func.isRequired,
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
  songsPlaying: false,
};

module.exports = Songs;
