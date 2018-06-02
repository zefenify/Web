/**
 * a component that renders
 * > Title
 * > Duration
 * > Play / Pause
 * > [<Track />]
 */

import React from 'react';
import { func, shape, bool, number, string, arrayOf } from 'prop-types';
import styled from 'react-emotion';

import Track from '@app/component/presentational/Track';
import Divider from '@app/component/styled/Divider';
import Button from '@app/component/styled/Button';

const Tracks = styled.div`
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

  .tracks {
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

const Recent = ({
  titleMain,
  titleEmpty,
  playing,
  current,
  tracks,
  durationTotal,
  tracksPlaying,
  tracksPlayPauseButtonShow,
  tracksPlayPause,
  trackPlayPause,
  contextMenuTrack,
}) => {
  if (tracks.length === 0) {
    return (
      <Tracks className="center-content">
        <h2 className="mute">{ titleEmpty }</h2>
      </Tracks>
    );
  }

  const { hours, minutes, seconds } = durationTotal;

  return (
    <Tracks>
      <div className="tracks">
        <h1 className="tracks__title">{ titleMain }</h1>
        <p className="tracks__info">{`${tracks.length} song${tracks.length > 1 ? 's' : ''}, ${hours > 0 ? `${hours} hr` : ''} ${minutes} min ${hours > 0 ? '' : `${seconds} sec`}`}</p>
        {
          tracksPlayPauseButtonShow
            ? <Button className="tracks__button" onClick={tracksPlayPause}>{`${(playing && tracksPlaying) ? 'PAUSE' : 'PLAY'}`}</Button>
            : null
        }
      </div>

      <Divider />

      <div className="track">
        {
          tracks.map((track, index) => (
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
    </Tracks>
  );
};

Recent.propTypes = {
  titleMain: string,
  titleEmpty: string,
  playing: bool,
  current: shape({}),
  tracks: arrayOf(shape({})),
  durationTotal: shape({
    hours: number,
    minutes: number,
    seconds: number,
  }),
  tracksPlaying: bool,
  tracksPlayPauseButtonShow: bool,
  tracksPlayPause: func.isRequired,
  trackPlayPause: func.isRequired,
  contextMenuTrack: func.isRequired,
};

Recent.defaultProps = {
  titleMain: '',
  titleEmpty: '',
  playing: false,
  current: null,
  tracks: [],
  durationTotal: {
    hours: 0,
    minutes: 0,
    seconds: 0,
  },
  tracksPlaying: false,
  tracksPlayPauseButtonShow: true,
};

module.exports = Recent;
