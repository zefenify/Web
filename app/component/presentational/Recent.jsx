import React from 'react';
import { func, shape, bool, number, arrayOf } from 'prop-types';
import styled from 'react-emotion';

import DJKhaled from '@app/component/hoc/DJKhaled';
import Song from '@app/component/presentational/Song';
import Divider from '@app/component/styled/Divider';
import Button from '@app/component/styled/Button';

const RecentContainer = styled.div`
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

  .recently-played {
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

const Recent = ({
  playing,
  current,
  history,
  totalDuration,
  playingHistory,
  togglePlayPauseHistory,
  togglePlayPauseSong,
  contextMenuSong,
}) => {
  if (history.length === 0) {
    return (
      <RecentContainer className="center-content">
        <h2 className="mute">You have no recently played songs...yet</h2>
      </RecentContainer>
    );
  }

  const { hours, minutes, seconds } = totalDuration;

  return (
    <RecentContainer>
      <div className="recently-played">
        <h1 className="recently-played__title">Recently Played</h1>
        <p className="recently-played__info">{`${history.length} song${history.length > 1 ? 's' : ''}, ${hours > 0 ? `${hours} hr` : ''} ${minutes} min ${hours > 0 ? '' : `${seconds} sec`}`}</p>
        <Button className="recently-played__button" onClick={() => togglePlayPauseHistory(playingHistory, history)}>{`${(playing && playingHistory) ? 'PAUSE' : 'PLAY'}`}</Button>
      </div>

      <Divider />

      <div className="song">
        {
          history.map((song, index) => (
            <Song
              key={song.track_id}
              currentSongId={current === null ? -1 : current.track_id}
              trackNumber={index + 1}
              togglePlayPause={() => togglePlayPauseSong(index, song, current, history)}
              playing={playing && playingHistory}
              songId={song.track_id}
              songName={song.track_name}
              songFeaturing={song.track_featuring}
              songDuration={song.track_track.s3_meta.duration}
              songAlbum={song.track_album}
              contextMenuSong={songId => contextMenuSong(songId, history)}
            />
          ))
        }
      </div>
    </RecentContainer>
  );
};

Recent.propTypes = {
  playing: bool,
  current: shape({}),
  history: arrayOf(shape({})),
  totalDuration: shape({
    hours: number,
    minutes: number,
    seconds: number,
  }),
  playingHistory: bool,
  togglePlayPauseHistory: func.isRequired,
  togglePlayPauseSong: func.isRequired,
  contextMenuSong: func.isRequired,
};

Recent.defaultProps = {
  playing: false,
  current: null,
  history: [],
  totalDuration: {
    hours: 0,
    minutes: 0,
    seconds: 0,
  },
  playingHistory: false,
};

module.exports = DJKhaled(Recent);
