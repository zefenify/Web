import React from 'react';
import { Link } from 'react-router-dom';
import { func, string, number, shape, bool, arrayOf, oneOfType } from 'prop-types';
import styled from 'react-emotion';

import { BASE_S3 } from '@app/config/api';

import ImageContainer from '@app/component/styled/ImageContainer';
import FixedHeaderList from '@app/component/styled/FixedHeaderList';
import PlayPause from '@app/component/svg/PlayPause';
import ArtistList from '@app/component/presentational/ArtistList';
import Button from '@app/component/styled/Button';

import Album from '@app/component/presentational/Album';

const AlbumsContainer = styled.div`
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
`;

const AlbumContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 0 0 25%;
  padding: 0 1em;
  margin-bottom: 3em;
  text-decoration: none;
  color: #fff;
  transition: transform 256ms;
  will-change: transform;

  &.active {
    color: ${props => props.theme.primary};

    .album-title {
      color: ${props => props.theme.primary};
    }
  }

  &:not(.active) {
    svg {
      color: #fff !important;
    }
  }

  @media(min-width: 1282px) {
    flex: 0 0 20%;
  }

  .album-cover {
    position: relative;

    &__overlay {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(51, 51, 51, 0.75);
      border-radius: 6px;
      color: inherit;

      svg {
        display: flex;
        justify-content: center;
        align-items: center;
        color: inherit;
        width: 64px;
        height: 64px;
      }
    }

    .album-cover__overlay {
      opacity: 0;
    }

    &:hover .album-cover__overlay {
      opacity: 1;
    }
  }

  .album-title {
    padding: 0;
    margin: 0;
    line-height: 125%;
    margin-top: 0.5em;
    font-size: 1.25em;
    color: ${props => props.theme.text};
  }

  .album-artist {
    padding: 0;
    margin: 0;
    margin-top: 0.5em;

    a {
      text-decoration: none;
      color: ${props => props.theme.mute};
    }
  }

  &:active {
    transform: scale3d(0.95, 0.95, 1);
  }
`;

const Albums = ({
  current,
  playing,
  user,
  albumId,
  albums,
  albumPlaying,
  duration,
  albumsPlayPause,
  trackPlayPause,
  contextMenuAlbum,
  contextMenuTrack,
  albumsPlayingId,
  albumPlayPause,
}) => {
  if (user === null) {
    return (
      <AlbumsContainer className="center-content">
        <h2 className="mute">You need to be logged in to view saved albums</h2>
        <Link to="/settings"><Button border themeColor backgroundColor="transparent">Go to Settings</Button></Link>
      </AlbumsContainer>
    );
  }

  if (albums.length === 0) {
    return (
      <AlbumsContainer className="center-content">
        <h2 className="mute">You have no saved albums...yet</h2>
      </AlbumsContainer>
    );
  }

  if (albumId !== undefined && albums.length === 1) {
    return (
      <Album
        title={albums[0].album_name}
        cover={albums[0].album_cover}
        artist={albums[0].album_artist}
        tracks={albums[0].relationships.track}
        current={current}
        playing={playing}
        albumPlaying={albumPlaying}
        duration={duration}
        albumPlayPause={albumsPlayPause}
        trackPlayPause={trackPlayPause}
        contextMenuAlbum={contextMenuAlbum}
        contextMenuTrack={contextMenuTrack}
      />
    );
  }

  return (
    <FixedHeaderList>
      <div className="title">
        <h2>Albums</h2>
      </div>

      <div className="list">
        {
          albums.map(album => (
            <AlbumContainer key={album.album_id} className={album.album_id === albumsPlayingId ? 'active' : ''}>
              <div className="album-cover">
                <ImageContainer>
                  <img src={`${BASE_S3}${album.album_cover.s3_name}`} alt={album.album_name} />
                </ImageContainer>

                <Link to={`/albums/${album.album_id}`} className="album-cover__overlay">
                  <PlayPause
                    onClick={(e) => { e.preventDefault(); albumPlayPause(album.album_id); }}
                    playing={playing && album.album_id === albumsPlayingId}
                  />
                </Link>
              </div>

              <strong className="album-title">{ album.album_name }</strong>
              <ArtistList className="album-artist" artists={album.album_artist} />
            </AlbumContainer>
          ))
        }
      </div>
    </FixedHeaderList>
  );
};

Albums.propTypes = {
  playing: bool,
  albums: arrayOf(shape({})),
  albumId: oneOfType([shape({}), string]),
  user: shape({}),
  albumPlaying: bool,
  albumsPlayingId: string,
  albumPlayPause: func.isRequired,
  current: shape({}),
  duration: shape({
    hours: number,
    minutes: number,
    seconds: number,
  }),
  albumsPlayPause: func.isRequired,
  trackPlayPause: func.isRequired,
  contextMenuAlbum: func.isRequired,
  contextMenuTrack: func.isRequired,
};

Albums.defaultProps = {
  playing: false,
  current: null,
  albumPlaying: false,
  albums: [],
  albumId: undefined,
  user: null,
  albumsPlayingId: '',
  duration: {
    hours: 0,
    minutes: 0,
    seconds: 0,
  },
};

module.exports = Albums;
