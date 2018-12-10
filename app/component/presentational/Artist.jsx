import React, { memo, Fragment } from 'react';
import { Link } from 'react-router-dom';
import {
  shape,
  bool,
  number,
  string,
  func,
} from 'prop-types';
import styled from 'react-emotion';
import isEqual from 'react-fast-compare';

import { BASE_S3 } from '@app/config/api';
import ImageContainer from '@app/component/styled/ImageContainer';
import Album from '@app/component/presentational/Album';
import Button from '@app/component/styled/Button';
import Share from '@app/component/svg/Share';


const ArtistContainer = styled.div`
  .ArtistContainer {
    &__artist {
      &__cover {
        flex: 0 0 250px;
        height: 250px;
        width: 250px;
      }
    }

    &__album-container {
      & > div:not(:last-child) {
        margin-bottom: 3rem;
      }
    }

    &__appears {
      a {
        flex: 0 0 25%;
        text-decoration: none;
        color: ${props => props.theme.NATURAL_2};

        @media(min-width: 1282px) {
          flex: 0 0 20%;
        }
      }
    }
  }
`;


const Arist = ({
  artist,
  current,
  playing,
  trackCount,
  albumPlayingId,
  aristPlaying,
  artistPlayPause,
  trackPlayPause,
  albumPlayPause,
  contextMenuArtist,
  contextMenuAlbum,
  contextMenuTrack,
}) => (
  <ArtistContainer className="d-flex flex-column flex-shrink-0">
    {/* artist info */}
    <div className="d-flex flex-column align-items-center ArtistContainer__artist">
      <ImageContainer className="ArtistContainer__artist__cover" borderRadius="50%">
        <img src={`${BASE_S3}${artist.artist_cover.s3_name}`} alt={artist.artist_name} />
      </ImageContainer>

      <div className="d-flex flex-column align-items-center">
        <h1 className="m-0 p-0 mt-3">{ artist.artist_name }</h1>

        <p className="m-0 p-0 mt-2">
          {`${artist.relationships.album.length} Album${artist.relationships.album.length > 1 ? 's' : ''} • ${trackCount} Song${trackCount > 1 ? 's' : ''}`}
        </p>

        <div className="d-flex flex-row align-items-center mt-4">
          <Button className="mr-3" style={{ width: '125px' }} onClick={() => artistPlayPause(artist.artist_id)}>
            {`${playing && aristPlaying ? 'PAUSE' : 'PLAY'}`}
          </Button>

          <Button
            className="p-0"
            style={{ backgroundColor: 'transparent', width: '38px' }}
            aria-label="more"
            themeColor
            themeBorder
            noShadow
            onClick={contextMenuArtist}
          >
            <Share />
          </Button>
        </div>
      </div>
    </div>
    {/* ./ artist info */}

    {/* artist album */}
    {
      artist.relationships.album.length === 0 ? null : (
        <div className="d-flex flex-column flex-shrink-0 mt-5 ArtistContainer__album-container">
          <h1 className="m-0 mb-3">{ `Album${artist.relationships.album.length > 1 ? 's' : ''}` }</h1>

          {
            artist.relationships.album.map(album => (
              <Album
                key={album.album_id}
                albumId={album.album_id}
                title={album.album_name}
                year={album.album_year}
                cover={album.album_cover}
                artist={album.album_artist}
                tracks={album.relationships.track}
                duration={album.duration}
                current={current}
                playing={playing}
                albumPlaying={albumPlayingId === album.album_id}
                albumPlayPause={() => albumPlayPause(album.album_id)}
                contextMenuAlbum={() => contextMenuAlbum(album.album_id)}
                trackPlayPause={trackPlayPause}
                contextMenuTrack={contextMenuTrack}
              />
            ))
          }
        </div>
      )
    }
    {/* ./ artist album */}

    {/* track */}
    {
      artist.relationships.track.length === 0 ? null : (
        <Fragment>
          <h1 className="m-0 p-0 mt-5 mb-3">Appears On</h1>

          {/* the -ve margin accounts for __view padding */}
          <div className="d-flex flex-row flex-wrap ArtistContainer__appears mb-3" style={{ margin: '0 -1rem' }}>
            {
              artist.relationships.track.map(track => (
                <Link key={track.track_id} to={`/album/${track.track_album.album_id}`} className="mb-5 px-3">
                  <ImageContainer>
                    <img src={`${BASE_S3}${track.track_album.album_cover.s3_name}`} alt={track.track_album.album_name} />
                  </ImageContainer>

                  <h2 className="m-0 p-0 mt-2">{ track.track_album.album_name }</h2>
                  <p className="m-0 p-0 mt-1">{ track.track_album.album_year }</p>
                </Link>
              ))
            }
          </div>
        </Fragment>
      )
    }
    {/* ./ track */}
  </ArtistContainer>
);

Arist.propTypes = {
  artist: shape({}),
  current: shape({}),
  playing: bool,
  trackCount: number,
  albumPlayingId: string,
  aristPlaying: bool,
  artistPlayPause: func.isRequired,
  trackPlayPause: func.isRequired,
  albumPlayPause: func.isRequired,
  contextMenuArtist: func.isRequired,
  contextMenuAlbum: func.isRequired,
  contextMenuTrack: func.isRequired,
};

Arist.defaultProps = {
  artist: null,
  current: null,
  playing: false,
  trackCount: 0,
  albumPlayingId: '',
  aristPlaying: false,
};

export default memo(Arist, (previousProps, nextProps) => isEqual({
  artist: previousProps.artist,
  current: previousProps.current,
  playing: previousProps.playing,
  albumPlayingId: previousProps.albumPlayingId,
  aristPlaying: previousProps.aristPlaying,
}, {
  artist: nextProps.artist,
  current: nextProps.current,
  playing: nextProps.playing,
  albumPlayingId: nextProps.albumPlayingId,
  aristPlaying: nextProps.aristPlaying,
}));
