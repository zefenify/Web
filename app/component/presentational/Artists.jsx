import React from 'react';
import { Link } from 'react-router-dom';
import {
  func,
  string,
  number,
  shape,
  bool,
  arrayOf,
} from 'prop-types';
import styled from 'react-emotion';

import { BASE_S3 } from '@app/config/api';
import PlayPause from '@app/component/svg/PlayPause';
import HeaderView from '@app/component/styled/HeaderView';
import ImageContainer from '@app/component/styled/ImageContainer';
import Button from '@app/component/styled/Button';
import Artist from '@app/component/presentational/Artist';


const ArtistContainer = styled.div`
  position: relative;
  flex: 0 0 25%;
  text-decoration: none;
  transition: transform 256ms;
  will-change: transform;

  &.active {
    color: ${props => props.theme.PRIMARY_4};

    .__artist-name {
      color: ${props => props.theme.PRIMARY_4};
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

  .__artist-cover {
    position: relative;

    &__overlay {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-color: rgba(51, 51, 51, 0.75);
      color: inherit;
      border-radius: 50%;

      svg {
        color: inherit;
        width: 64px;
        height: 64px;
      }
    }

    .__artist-cover__overlay {
      opacity: 0;
    }

    &:hover .__artist-cover__overlay {
      opacity: 1;
    }
  }

  .__artist-name {
    color: ${props => props.theme.NATURAL_2};
    text-align: center;
  }

  &:active {
    transform: scale3d(0.95, 0.95, 1);
  }
`;

const Artists = ({
  current,
  playing,
  artistId,
  user,
  artist,
  trackCount,
  albumPlayingId,
  artistPlayingId,
  artistPlayPause,
  trackPlayPause,
  albumPlayPause,
  contextMenuArtist,
  contextMenuAlbum,
  contextMenuTrack,
}) => {
  if (user === null) {
    return (
      <div className="d-flex flex-column flex-grow-1 flex-shrink-0 align-items-center justify-content-center">
        <h2>You Need to Be Logged in to View Saved Artists</h2>
        <Link to="/settings"><Button>Go to Settings</Button></Link>
      </div>
    );
  }

  if (artist.length === 0) {
    return (
      <div className="d-flex flex-column flex-grow-1 flex-shrink-0 align-items-center justify-content-center">
        <h2>You Have No Saved Artists...Yet</h2>
      </div>
    );
  }

  if (artistId !== undefined && artist.length === 1) {
    return (
      <Artist
        artist={artist[0]}
        current={current}
        playing={playing}
        aristPlaying={artistPlayingId === artist[0].artist_id}
        trackCount={trackCount}
        albumPlayingId={albumPlayingId}
        playingArist={false}
        artistPlayPause={artistPlayPause}
        trackPlayPause={trackPlayPause}
        albumPlayPause={albumPlayPause}
        contextMenuArtist={contextMenuArtist}
        contextMenuAlbum={contextMenuAlbum}
        contextMenuTrack={contextMenuTrack}
      />
    );
  }

  return (
    <HeaderView>
      <div className="__header">
        <h1>Artists</h1>
      </div>

      <div className="__view">
        {
          artist.map(_artist => (
            <ArtistContainer key={_artist.artist_id} className={`d-flex flex-column flex-shrink-0 py-0 px-3 ${_artist.artist_id === artistPlayingId ? 'active' : ''}`}>
              <div className="__artist-cover">
                <ImageContainer borderRadius="50%">
                  <img src={`${BASE_S3}${_artist.artist_cover.s3_name}`} alt={_artist.artist_name} />
                </ImageContainer>

                <Link to={`/artists/${_artist.artist_id}`} className="d-flex align-items-center justify-content-center __artist-cover__overlay">
                  <PlayPause
                    strokeWidth="1px"
                    onClick={(event) => { event.preventDefault(); artistPlayPause(_artist.artist_id); }}
                    playing={playing && _artist.artist_id === artistPlayingId}
                  />
                </Link>
              </div>

              <h2 className="__artist-name m-0 p-0 mt-2 mb-5">{ _artist.artist_name }</h2>
            </ArtistContainer>
          ))
        }
      </div>
    </HeaderView>
  );
};

Artists.propTypes = {
  artistId: string,
  current: shape({}),
  user: shape({}),
  artist: arrayOf(shape({})),
  playing: bool,
  albumPlayingId: string,
  trackCount: number,
  artistPlayingId: string,
  artistPlayPause: func.isRequired,
  trackPlayPause: func.isRequired,
  albumPlayPause: func.isRequired,
  contextMenuArtist: func.isRequired,
  contextMenuAlbum: func.isRequired,
  contextMenuTrack: func.isRequired,
};

Artists.defaultProps = {
  artistId: '',
  current: null,
  user: null,
  artist: [],
  playing: false,
  artistPlayingId: '',
  albumPlayingId: '',
  trackCount: 0,
};

export default Artists;
