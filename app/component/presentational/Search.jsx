import React, { memo } from 'react';
import {
  string,
  func,
  bool,
  shape,
} from 'prop-types';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import isEqual from 'react-fast-compare';

import { BASE_S3 } from '@app/config/api';
import Track from '@app/component/presentational/Track';
import ImageContainer from '@app/component/styled/ImageContainer';


const SearchContainer = styled.div`
  .SearchContainer__search {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    flex: 0 0 95px;
    height: 94px;
    padding: 1em 2em 0.25em 2em;
    flex-direction: column;
    background-color: ${props => props.theme.BACKGROUND_MAIN};
    box-shadow: 0 0 4px 2px ${props => props.theme.SHADOW};

    &__label {
      font-size: 1em;
      margin-bottom: 0.5em;
      color: ${props => props.theme.NATURAL_4};
    }

    &__input {
      font-size: 42px;
      font-weight: bold;
      border: none;
      color: ${props => props.theme.NATURAL_2};
      background-color: transparent;
    }
  }

  .SearchContainer__result {
    position: absolute;
    top: 95px;
    right: 0;
    bottom: 0;
    left: 0;
    overflow-y: auto;

    &__item {
      flex: 0 0 20%;
      text-decoration: none;
      color: ${props => props.theme.NATURAL_4};
    }

    &__image {
      flex: 0 0 250px;
      height: 250px;
      width: 250px;
    }
  }
`;


const Search = ({
  q,
  inputSearchRef,
  match,
  current,
  playing,
  onChange,
  trackPlayPause,
  contextMenuTrack,
}) => {
  // initial component mount
  if (match === null) {
    return (
      <SearchContainer className="d-flex flex-column">
        <div className="SearchContainer__search">
          <div className="SearchContainer__search__label">Search for an Artist, Song, Album or Playlist</div>
          <input
            className="SearchContainer__search__input"
            placeholder="Search"
            value={q}
            onChange={onChange}
            ref={inputSearchRef}
          />
        </div>
      </SearchContainer>
    );
  }

  // no matches found
  if (isEqual(match, {
    album: [],
    artist: [],
    playlist: [],
    track: [],
  })) {
    return (
      <SearchContainer className="d-flex flex-column">
        <div className="SearchContainer__search">
          <div className="SearchContainer__search__label">Search for an Artist, Song, Album or Playlist</div>
          <input
            className="SearchContainer__search__input"
            placeholder="Search"
            value={q}
            onChange={onChange}
            ref={inputSearchRef}
          />
        </div>

        <div className="d-flex flex-row align-items-center justify-content-center SearchContainer__result">
          <h2>No Results</h2>
        </div>
      </SearchContainer>
    );
  }

  // search has result...
  return (
    <SearchContainer>
      <div className="SearchContainer__search">
        <div className="SearchContainer__search__label">Search for an Artist, Song, Album or Playlist</div>
        <input
          className="SearchContainer__search__input"
          placeholder="Search"
          value={q}
          onChange={onChange}
          ref={inputSearchRef}
        />
      </div>

      <div className="d-flex flex-column px-3 pt-0 pb-0 SearchContainer__result">
        {/* artist */}
        {
          match.artist.length === 0 ? null : (
            <div className="mb-5">
              <h1 className="m-0 p-0 px-3 my-2">Artists</h1>

              {
                match.artist.length > 0 ? (
                  <div className="d-flex flex-row flex-nowrap mx-3" style={{ overflowX: 'auto' }}>
                    {
                      match.artist.map(artist => (
                        <Link key={artist.artist_id} to={`artist/${artist.artist_id}`} className="d-flex flex-column align-items-center pr-4 SearchContainer__result__item">
                          <ImageContainer borderRadius="50%" className="SearchContainer__result__image">
                            <img alt={`${artist.artist_name}`} src={`${BASE_S3}${artist.artist_cover.s3_name}`} />
                          </ImageContainer>

                          <h2 className="m-0 p-0 mt-2">{ artist.artist_name }</h2>
                        </Link>
                      ))
                    }
                  </div>
                ) : null
              }
            </div>
          )
        }
        {/* ./ artist */}

        {/* album */}
        {
          match.album.length === 0 ? null : (
            <div className="mb-5">
              <h1 className="m-0 p-0 px-3 my-2">Albums</h1>

              {
                match.album.length > 0 ? (
                  <div className="d-flex flex-row flex-nowrap mx-3" style={{ overflowX: 'auto' }}>
                    {
                      match.album.map(album => (
                        <Link key={album.album_id} to={`album/${album.album_id}`} className="d-flex flex-column align-items-center pr-4 SearchContainer__result__item">
                          <ImageContainer className="SearchContainer__result__image">
                            <img alt={`${album.album_name}`} src={`${BASE_S3}${album.album_cover.s3_name}`} />
                          </ImageContainer>

                          <h2 className="m-0 p-0 mt-2">{ album.album_name }</h2>
                        </Link>
                      ))
                    }
                  </div>
                ) : null
              }
            </div>
          )
        }
        {/* ./ album */}

        {/* playlist */}
        {
          match.playlist.length === 0 ? null : (
            <div className="mb-5">
              <h1 className="m-0 p-0 px-3 my-2">Playlists</h1>

              {
                match.playlist.length > 0 ? (
                  <div className="d-flex flex-row flex-nowrap mx-3" style={{ overflowX: 'auto' }}>
                    {
                      match.playlist.map(playlist => (
                        <Link key={playlist.playlist_id} to={`playlist/${playlist.playlist_id}`} className="d-flex flex-column align-items-center pr-4 SearchContainer__result__item">
                          <ImageContainer className="SearchContainer__result__image">
                            <img alt={`${playlist.playlist_name}`} src={`${BASE_S3}${playlist.playlist_cover.s3_name}`} />
                          </ImageContainer>

                          <h2 className="m-0 p-0 mt-2">{ playlist.playlist_name }</h2>
                        </Link>
                      ))
                    }
                  </div>
                ) : null
              }
            </div>
          )
        }
        {/* ./ playlist */}

        {/* track */}
        {
          match.track.length === 0 ? null : (
            <div>
              <h1 className="m-0 p-0 px-3 my-2">Tracks</h1>

              <div className="px-3">
                {
                  match.track.map((track, index) => (
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
            </div>
          )
        }
        {/* ./ track */}
      </div>
    </SearchContainer>
  );
};

Search.propTypes = {
  q: string,
  inputSearchRef: shape({}),
  match: shape({}),
  current: shape({}),
  playing: bool,
  onChange: func.isRequired,
  trackPlayPause: func.isRequired,
  contextMenuTrack: func.isRequired,
};

Search.defaultProps = {
  q: '',
  inputSearchRef: null,
  match: null,
  current: null,
  playing: false,
};

export default memo(Search, (previousProps, nextProps) => isEqual({
  q: previousProps.q,
  match: previousProps.match,
  current: previousProps.current,
  playing: previousProps.playing,
}, {
  q: nextProps.q,
  match: nextProps.match,
  current: nextProps.current,
  playing: nextProps.playing,
}));
