import React, { memo } from 'react';
import {
  bool,
  number,
  string,
  arrayOf,
  shape,
  func,
} from 'prop-types';
import styled from 'react-emotion';
import { withRouter } from 'react-router';
import isEqual from 'react-fast-compare';

import { BASE_S3 } from '@app/config/api';
import Button from '@app/component/styled/Button';
import Share from '@app/component/svg/Share';
import Track from '@app/component/presentational/Track';
import ImageContainer from '@app/component/styled/ImageContainer';


const PlaylistTrackContainer = styled.div`
  .PlaylistTrackContainer__header {
    flex: 0 0 250px;

    img {
      height: 250px;
      width: 250px;
    }
  }

  .PlaylistTrackContainer {
    &__type {
      text-transform: capitalize;
      color: ${props => props.theme.NATURAL_4};
    }

    &__title {
      color: ${props => props.theme.NATURAL_2};
    }

    &__description {
      color: ${props => props.theme.NATURAL_3};
    }

    &__duration {
      color: ${props => props.theme.NATURAL_4};
    }
  }
`;


const PlaylistTrack = ({
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
  match,
}) => {
  const { hour, minute, second } = duration;

  return (
    <PlaylistTrackContainer className="d-flex flex-row flex-shrink-0">
      <div className="PlaylistTrackContainer__header mb-5">
        <ImageContainer borderRadius="6px">
          <img src={`${BASE_S3}${cover.s3_name}`} alt={`Album cover for ${title}`} />
        </ImageContainer>

        <div className="d-flex flex-row justify-content-center mt-4">
          <Button className="mr-3" style={{ width: '125px' }} onClick={tracksPlayPause}>{`${tracksPlaying ? 'PAUSE' : 'PLAY'}`}</Button>
          <Button
            className="p-0"
            style={{ backgroundColor: 'transparent', width: '38px' }}
            themeColor
            themeBorder
            noShadow
            onClick={contextMenuPlaylist}
          >
            <Share />
          </Button>
        </div>
      </div>

      <div className="d-flex flex-column flex-grow-1" style={{ paddingLeft: '2rem' }}>
        <h3 className="m-0 p-0 PlaylistTrackContainer__type">{ match.params.type }</h3>
        <h1 className="m-0 p-0 mt-1 PlaylistTrackContainer__title">{ title }</h1>
        <p className="m-0 p-0 mt-2 PlaylistTrackContainer__description">{ description }</p>
        <p className="m-0 p-0 my-2 PlaylistTrackContainer__duration">{`${tracks.length} song${tracks.length > 1 ? 's' : ''}, ${hour > 0 ? `${hour} hr` : ''} ${minute} min ${hour > 0 ? '' : `${second} sec`}`}</p>

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
    </PlaylistTrackContainer>
  );
};

PlaylistTrack.propTypes = {
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
  match: shape({
    url: string,
    params: shape({
      id: string,
    }),
  }).isRequired,
  playing: bool,
  tracksPlaying: bool,
  tracksPlayPause: func.isRequired,
  trackPlayPause: func.isRequired,
  contextMenuPlaylist: func.isRequired,
  contextMenuTrack: func.isRequired,
};

PlaylistTrack.defaultProps = {
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

export default withRouter(memo(PlaylistTrack, (previousProps, nextProps) => isEqual({
  type: previousProps.type,
  cover: previousProps.cover,
  title: previousProps.title,
  description: previousProps.description,
  current: previousProps.current,
  tracks: previousProps.tracks,
  playing: previousProps.playing,
  tracksPlaying: previousProps.tracksPlaying,
}, {
  type: nextProps.type,
  cover: nextProps.cover,
  title: nextProps.title,
  description: nextProps.description,
  current: nextProps.current,
  tracks: nextProps.tracks,
  playing: nextProps.playing,
  tracksPlaying: nextProps.tracksPlaying,
})));
