import React from 'react';
import { Link } from 'react-router-dom';
import { func, number, shape, bool, arrayOf } from 'prop-types';
import styled from 'react-emotion';

import { BASE_S3 } from '@app/config/api';

import DJKhaled from '@app/component/hoc/DJKhaled';
import FixedHeaderList from '@app/component/styled/FixedHeaderList';
import PlayPauseSVG from '@app/component/presentational/PlayPauseSVG';
import ArtistList from '@app/component/presentational/ArtistList';
import Button from '@app/component/styled/Button';

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
    color: ${props => props.theme.controlMute};
  }
`;

const AlbumContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 0 0 25%;
  min-height: 25vh;
  padding: 0 1em;
  margin-bottom: 3em;
  text-decoration: none;
  color: #fff;

  &.active {
    color: ${props => props.theme.primary};

    .playlist-title {
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
    width: 100%;
    height: auto;
    min-height: 225px;
    border-radius: 6px;
    border: 1px solid ${props => props.theme.listDivider};

    @media(min-width: 1284px) {
      height: 300px;
    }

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
        font-size: 80px;
        width: 80px;
        height: 80px;
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
  }

  .album-artist {
    padding: 0;
    margin: 0;
    margin-top: 0.5em;

    a {
      text-decoration: none;
      color: ${props => props.theme.controlMute};
    }
  }

  &:active {
    transform: scale(0.95);
  }
`;

const Albums = ({
  user,
  albums,
  albumsPlayingId,
  playing,
  togglePlayPauseAlbum,
}) => {
  if (user === null) {
    return (
      <AlbumsContainer className="center-content">
        <h2 className="mute">You need to be logged in to view saved albums</h2>
        <Link to="/setting"><Button outline>Go to Settings</Button></Link>
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

  return (
    <FixedHeaderList>
      <div className="title">
        <h2>Albums</h2>
      </div>

      <div className="list">
        {
          albums.map(album => (
            <AlbumContainer className={album.album_id === albumsPlayingId ? 'active' : ''}>
              <div className="album-cover" style={{ background: `transparent url('${BASE_S3}${album.album_cover.s3_name}') 50% 50% / cover no-repeat` }}>
                <Link to={`/albums/${album.album_id}`} className="album-cover__overlay">
                  <PlayPauseSVG
                    onClick={(e) => { e.preventDefault(); togglePlayPauseAlbum(album); }}
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
  user: shape({}),
  albumsPlayingId: number,
  togglePlayPauseAlbum: func.isRequired,
};

Albums.defaultProps = {
  playing: false,
  albums: [],
  user: null,
  albumsPlayingId: -1,
};

module.exports = DJKhaled(Albums);
