import React from 'react';
import {
  bool,
  number,
  string,
  arrayOf,
  shape,
  func,
} from 'prop-types';
import styled from 'react-emotion';

import { BASE_S3 } from '@app/config/api';
import ArtistList from '@app/component/presentational/ArtistList';
import Button from '@app/component/styled/Button';
import Share from '@app/component/svg/Share';
import Track from '@app/component/presentational/Track';
import ImageContainer from '@app/component/styled/ImageContainer';


const AlbumContainer = styled.div`
  .AlbumContainer__album-info {
    flex: 0 0 250px;
    height: 250px;
    width: 250px;
  }

  .AlbumContainer__artist-list a {
    color: ${props => props.theme.NATURAL_3};
    text-decoration: none;
    font-size: 1.125rem;
  }

  .AlbumContainer__album-year-track-count {
    color: ${props => props.theme.NATURAL_4};
  }
`;


const Album = ({
  title,
  cover,
  year,
  artist,
  tracks,
  current,
  playing,
  albumPlaying,
  duration,
  albumPlayPause,
  trackPlayPause,
  contextMenuAlbum,
  contextMenuTrack,
}) => {
  const { hour, minute, second } = duration;

  return (
    <AlbumContainer className="d-flex flex-row flex-shrink-0">
      <div className="AlbumContainer__album-info">
        <ImageContainer borderRadius="6px">
          <img src={`${BASE_S3}${cover.s3_name}`} alt={`Album cover for ${title}`} />
        </ImageContainer>

        <div className="d-flex flex-column align-items-center">
          <h2 className="m-0 p-0 mt-3">{ title }</h2>

          <div className="AlbumContainer__artist-list mt-2">
            <ArtistList artist={artist} />
          </div>

          <div className="AlbumContainer__album-year-track-count d-flex flex-column align-items-center mt-3">
            <span>{`${year} • ${tracks.length} SONG${tracks.length > 1 ? 'S' : ''} • ${hour > 0 ? `${hour} hr` : ''} ${minute} min ${hour > 0 ? '' : `${second} sec`}`}</span>
          </div>

          <div className="d-flex flex-row justify-content-center mt-4">
            <Button className="mr-3" style={{ width: '125px' }} onClick={albumPlayPause}>{`${albumPlaying && playing ? 'PAUSE' : 'PLAY'}`}</Button>
            <Button
              className="p-0"
              style={{ backgroundColor: 'transparent', width: '38px' }}
              themeColor
              themeBorder
              onClick={contextMenuAlbum}
            >
              <Share />
            </Button>
          </div>
        </div>
      </div>

      <div className="d-flex flex-column flex-grow-1" style={{ paddingLeft: '2rem' }}>
        {
          tracks.map((track, index) => (
            <Track
              fullDetail={false}
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
    </AlbumContainer>
  );
};

Album.propTypes = {
  cover: shape({}),
  title: string,
  year: number,
  artist: arrayOf(shape({})),
  current: shape({}),
  tracks: arrayOf(shape({})),
  duration: shape({
    hour: number,
    minute: number,
    second: number,
  }),
  playing: bool,
  albumPlaying: bool,
  albumPlayPause: func.isRequired,
  trackPlayPause: func.isRequired,
  contextMenuAlbum: func.isRequired,
  contextMenuTrack: func.isRequired,
};

Album.defaultProps = {
  cover: {},
  title: '',
  year: 1991,
  artist: [],
  current: null,
  tracks: [],
  duration: {
    hour: 0,
    minute: 0,
    second: 0,
  },
  playing: false,
  albumPlaying: false,
};

export default Album;
