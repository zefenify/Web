import React from 'react';
import { bool, number, string, arrayOf, shape, func } from 'prop-types';
import styled from 'react-emotion';

import { BASE_S3 } from '@app/config/api';

import Button from '@app/component/styled/Button';
import Share from '@app/component/svg/Share';
import Divider from '@app/component/styled/Divider';
import Track from '@app/component/presentational/Track';

const HeaderTracksContainer = styled.div`
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
    border: 1px solid ${props => props.theme.divider};
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
      flex: 1 0 auto;
      text-transform: capitalize;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      margin: 0;
    }

    &__description {
      margin: 0;
      font-size: 1.2em;
      line-height: 1.25em;
      color: ${props => props.theme.mute};
    }

    &__duration {
      margin: 0;
      margin-top: 0.25em;
      color: ${props => props.theme.mute};
    }

    .play-share {
      margin-top: 1em;
    }
  }
`;

const Tracks = styled.div`
  flex: 1 0 auto;

  & > *:last-child {
    margin-bottom: 1px;
  }
`;

const HeaderTracks = ({
  type,
  title,
  description,
  cover,
  current,
  playing,
  tracksPlaying,
  tracks,
  duration,
  tracksPlayPause,
  trackPlayPause,
  contextMenuPlaylist,
  contextMenuTrack,
}) => {
  const { hours, minutes, seconds } = duration;

  return (
    <HeaderTracksContainer>
      <Header>
        <div className="image" style={{ background: `transparent url('${BASE_S3}${cover.s3_name}') 50% 50% / cover no-repeat` }} />
        <div className="info info-container">
          <p className="info-container__type">{type}</p>
          <h1 className="info-container__title">{title}</h1>
          <p className="info-container__description">{description}</p>
          <p className="info-container__duration">{`${tracks.length} song${tracks.length > 1 ? 's' : ''}, ${hours > 0 ? `${hours} hr` : ''} ${minutes} min ${hours > 0 ? '' : `${seconds} sec`}`}</p>
          <div className="play-share">
            <Button className="play-share__play-big" onClick={tracksPlayPause}>{`${tracksPlaying ? 'PAUSE' : 'PLAY'}`}</Button>
            <Button className="play-share__share" border themeColor backgroundColor="transparent" padding="0" onClick={contextMenuPlaylist}><Share /></Button>
          </div>
        </div>
      </Header>

      <Divider />

      <Tracks>
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
      </Tracks>
    </HeaderTracksContainer>
  );
};

HeaderTracks.propTypes = {
  type: string,
  cover: shape({}),
  title: string,
  description: string,
  current: shape({}),
  tracks: arrayOf(shape({})),
  duration: shape({
    hours: number,
    minutes: number,
    seconds: number,
  }),
  playing: bool,
  tracksPlaying: bool,
  tracksPlayPause: func.isRequired,
  trackPlayPause: func.isRequired,
  contextMenuPlaylist: func.isRequired,
  contextMenuTrack: func.isRequired,
};

HeaderTracks.defaultProps = {
  type: 'playlist',
  cover: {},
  title: '',
  description: '',
  current: null,
  tracks: [],
  duration: {
    hours: 0,
    minutes: 0,
    seconds: 0,
  },
  playing: false,
  tracksPlaying: false,
};

module.exports = HeaderTracks;
