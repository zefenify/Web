import React from 'react';
import { shape, bool, number, string, func } from 'prop-types';
import styled from 'react-emotion';

import { BASE_S3 } from '@app/config/api';

import ImageContainer from '@app/component/styled/ImageContainer';
import Divider from '@app/component/styled/Divider';
import Album from '@app/component/presentational/Album';
import Button from '@app/component/styled/Button';
import Share from '@app/component/svg/Share';


const ArtistContainer = styled.div`
  .ArtistContainer__artist {
    &__cover {
      flex: 0 0 250px;
      height: 250px;
      width: 250px;
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
        <div className="d-flex flex-column flex-shrink-0 mt-5">
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
  </ArtistContainer>
);

/*
    <div className="artist">
      <div className="artist__image" style={{ background: `transparent url('${BASE_S3}${artist.artist_cover.s3_name}') 50% 50% / cover no-repeat` }} />
      <div className="artist__info">
        <p>ARTIST</p>
        <h1>{ artist.artist_name }</h1>
        <p style={{ marginTop: '0.25em' }}>
          {`${artist.relationships.album.length} album${artist.relationships.album.length > 1 ? 's' : ''}, ${trackCount} song${trackCount > 1 ? 's' : ''}`}
        </p>
        <div className="play-share">
          <Button className="play-share__play-big" onClick={() => artistPlayPause(artist.artist_id)}>
            {`${playing && aristPlaying ? 'PAUSE' : 'PLAY'}`}
          </Button>
          <Button className="play-share__share" border themeColor backgroundColor="transparent" padding="0" onClick={contextMenuArtist}>
            <Share />
          </Button>
        </div>
      </div>
    </div>


    {
      artist.relationships.album.length === 0 ? null : (
        <div className="album-list">
          <h2><Divider text>Albums&nbsp;</Divider></h2>

          {
            artist.relationships.album.map(album => (
              <div className="album-list__album album" key={`${artist.artist_id}-${album.album_id}`}>
                <div className="album-cover">
                  <Link to={`/album/${album.album_id}`} className="album-cover__cover" style={{ background: `transparent url('${BASE_S3}${album.album_cover.s3_name}') 50% 50% / cover no-repeat` }} />
                  <div className="album-cover__info album-info">
                    <p className="album-info__year">{ album.album_year }</p>
                    <Link className="album-info__name" to={`/album/${album.album_id}`}>{ album.album_name }</Link>
                    <div className="play-share">
                      <Button outline border themeColor backgroundColor="transparent" className="play-share__play-small" onClick={() => albumPlayPause(album.album_id)}>{`${playing && albumPlayingId === album.album_id ? 'PAUSE' : 'PLAY'}`}</Button>
                      <Button className="play-share__share" border themeColor backgroundColor="transparent" padding="0" onClick={() => contextMenuAlbum(album.album_id)}><Share /></Button>
                    </div>
                  </div>
                </div>

                <div className="album__track-list track-list">
                  <Divider />
                  {
                    album.relationships.track.map((track, index) => (
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
                        trackAlbum={album}
                        trackDuration={track.track_track.s3_meta.duration}
                        contextMenuTrack={contextMenuTrack}
                      />
                    ))
                  }
                </div>
              </div>
            ))
          }
        </div>
      )
    }

    {
      artist.relationships.track.length === 0 ? null : <div style={{ marginTop: '2em' }}>
        <h2><Divider text>Appears On&nbsp;</Divider></h2>

        <div className="appears-container">
          <div className="appears-container__list appears-list">
            {
              artist.relationships.track.map(track => (
                <Link key={track.track_id} to={`/album/${track.track_album.album_id}`} className="appears-list__album appears-album">
                  <ImageContainer>
                    <img src={`${BASE_S3}${track.track_album.album_cover.s3_name}`} alt={track.track_album.album_name} />
                  </ImageContainer>

                  <p className="appears-album__name">{track.track_album.album_name}</p>
                  <p className="appears-album__year">{track.track_album.album_year}</p>
                </Link>
              ))
            }
          </div>
        </div>
      </div>
    }
    */

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

export default Arist;
