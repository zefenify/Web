import React from 'react';
import { func, shape, bool, number, arrayOf } from 'prop-types';
import styled from 'react-emotion';

import Track from '@app/component/presentational/Track';
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

  .track {
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
  historyPlaying,
  historyPlayPause,
  trackPlayPause,
  contextMenuTrack,
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
        <Button className="recently-played__button" onClick={historyPlayPause}>{`${(playing && historyPlaying) ? 'PAUSE' : 'PLAY'}`}</Button>
      </div>

      <Divider />

      <div className="track">
        {
          history.map((track, index) => (
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
  historyPlaying: bool,
  historyPlayPause: func.isRequired,
  trackPlayPause: func.isRequired,
  contextMenuTrack: func.isRequired,
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
  historyPlaying: false,
};

module.exports = Recent;
