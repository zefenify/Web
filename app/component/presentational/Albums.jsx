import React from 'react';
import { Link } from 'react-router-dom';
import {
  func,
  string,
  number,
  shape,
  bool,
  arrayOf,
  oneOfType,
} from 'prop-types';
import styled from 'react-emotion';

import { BASE_S3 } from '@app/config/api';
import PlayPause from '@app/component/svg/PlayPause';
import ImageContainer from '@app/component/styled/ImageContainer';
import HeaderView from '@app/component/styled/HeaderView';
import Button from '@app/component/styled/Button';
import ArtistList from '@app/component/presentational/ArtistList';
import Album from '@app/component/presentational/Album';


const AlbumContainer = styled.div`
  position: relative;
  flex: 0 0 25%;
  text-decoration: none;
  color: hsl(0, 0%, 100%);
  transition: transform 256ms;

  &.active {
    color: ${props => props.theme.PRIMARY_4}; /* this will be inherited by SVG */

    .AlbumContainer__album-title {
      color: ${props => props.theme.PRIMARY_4};
    }

    .AlbumContainer__album-artist a {
      color: ${props => props.theme.PRIMARY_5};
    }
  }

  &:not(.active) {
    svg {
      color: hsl(0, 0%, 100%) !important;
    }
  }

  @media(min-width: 1282px) {
    flex: 0 0 20%;
  }

  .AlbumContainer__album-cover {
    position: relative;

    &__overlay {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
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

    .AlbumContainer__album-cover__overlay {
      opacity: 0;
    }

    &:hover .AlbumContainer__album-cover__overlay {
      opacity: 1;
    }
  }

  .AlbumContainer__album-title {
    color: ${props => props.theme.NATURAL_2};
  }

  .AlbumContainer__album-artist a {
    text-decoration: none;
    color: ${props => props.theme.NATURAL_4};
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
  album,
  albumPlaying,
  duration,
  trackPlayPause,
  contextMenuAlbum,
  contextMenuTrack,
  albumPlayingId,
  albumPlayPause,
}) => {
  if (user === null) {
    return (
      <div className="d-flex flex-column flex-grow-1 flex-shrink-0 align-items-center justify-content-center">
        <h2>You Need to Be Logged in to View Saved Albums</h2>
        <Link to="/settings" style={{ textDecoration: 'none' }}><Button>Go to Settings</Button></Link>
      </div>
    );
  }

  if (album.length === 0) {
    return (
      <div className="d-flex flex-column flex-grow-1 flex-shrink-0 align-items-center justify-content-center">
        <h2>You Have No Saved Albums...Yet</h2>
      </div>
    );
  }

  if (albumId !== undefined && album.length === 1) {
    return (
      <Album
        showArtist
        albumId={album[0].album_id}
        title={album[0].album_name}
        year={album[0].album_year}
        cover={album[0].album_cover}
        artist={album[0].album_artist}
        tracks={album[0].relationships.track}
        current={current}
        playing={playing}
        albumPlaying={albumPlaying}
        duration={duration}
        albumPlayPause={() => albumPlayPause(album[0].album_id)}
        trackPlayPause={trackPlayPause}
        contextMenuAlbum={contextMenuAlbum}
        contextMenuTrack={contextMenuTrack}
      />
    );
  }

  return (
    <HeaderView>
      <div className="__header">
        <h1>Albums</h1>
      </div>

      <div className="__view">
        {
          album.map(_album => (
            <AlbumContainer key={_album.album_id} className={`d-flex flex-column px-3${_album.album_id === albumPlayingId ? ' active' : ''}`}>
              <div className="AlbumContainer__album-cover">
                <ImageContainer>
                  <img src={`${BASE_S3}${_album.album_cover.s3_name}`} alt={_album.album_name} />
                </ImageContainer>

                <Link to={`/albums/${_album.album_id}`} className="d-flex flex-column justify-content-center align-items-center AlbumContainer__album-cover__overlay">
                  <PlayPause
                    strokeWidth="1px"
                    onClick={(event) => { event.preventDefault(); albumPlayPause(_album.album_id); }}
                    playing={playing && _album.album_id === albumPlayingId}
                  />
                </Link>
              </div>

              <h2 className="m-0 p-0 mt-2 mb-1 AlbumContainer__album-title">{ _album.album_name }</h2>
              <div className="m-0 p-0 mb-5 AlbumContainer__album-artist">
                <ArtistList artist={_album.album_artist} />
              </div>
            </AlbumContainer>
          ))
        }
      </div>
    </HeaderView>
  );
};

Albums.propTypes = {
  playing: bool,
  user: shape({}),
  current: shape({}),
  album: arrayOf(shape({})),
  albumId: oneOfType([shape({}), string]),
  albumPlaying: bool,
  albumPlayingId: string,
  albumPlayPause: func.isRequired,
  duration: shape({
    hours: number,
    minutes: number,
    seconds: number,
  }),
  trackPlayPause: func.isRequired,
  contextMenuAlbum: func.isRequired,
  contextMenuTrack: func.isRequired,
};

Albums.defaultProps = {
  playing: false,
  current: null,
  albumPlaying: false,
  album: [],
  albumId: undefined,
  user: null,
  albumPlayingId: '',
  duration: {
    hour: 0,
    minute: 0,
    second: 0,
  },
};

export default Albums;
