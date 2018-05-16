import React from 'react';
import { string, func, bool, shape } from 'prop-types';
import styled from 'react-emotion';
import { Link } from 'react-router-dom';
import isEqual from 'react-fast-compare';

import { BASE_S3 } from '@app/config/api';

import Track from '@app/component/presentational/Track';
import Divider from '@app/component/styled/Divider';
import ImageContainer from '@app/component/styled/ImageContainer';

const SearchContainer = styled.div`
  display: flex;
  flex: 0 1 auto;
  flex-direction: column;

  .search {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    flex: 0 0 95px;
    height: 94px;
    padding: 1em 2em 0.25em 2em;
    flex-direction: column;
    background-color: ${props => props.theme.search__backgroundColor};
    box-shadow: 0 0 4px 2px ${props => props.theme.search__shadow};

    &__label {
      font-size: 1em;
      margin-bottom: 0.5em;
      color: ${props => props.theme.searchLabel__color};
    }

    &__input {
      font-size: 42px;
      font-weight: bold;
      border: none;
      color: ${props => props.theme.searchInput__color};
      background-color: transparent;
    }
  }

  .result {
    position: absolute;
    top: 95px;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    flex: 1 0 auto;
    flex-direction: row;
    overflow-y: auto;
    padding: 2em;
    padding-bottom: 0;
    margin-bottom: 1px;

    &.no-matches {
      bottom: 70px;
      flex: 1 0 auto;
      justify-content: center;
      align-items: center;
      font-size: 2em;
    }

    &__list {
      flex: 1 1 auto;

      & > h2:first-child {
        margin-top: 0;
      }
    }

    .result-match-list {
      display: flex;
      flex-direction: row;
      min-height: 225px;
      max-width: calc(100vw - (200px + 4em));
      overflow-x: scroll;

      &__match {
        padding-right: 2em;
        flex: 0 0 20%;
      }
    }
  }

  .artist {
    display: flex;
    flex-direction: column;
    text-decoration: none;
    color: inherit;

    &__name {
      text-align: center;
    }
  }

  .apu {
    display: flex;
    flex-direction: column;
    text-decoration: none;
    color: inherit;

    &__name {
      margin: 0.5em 0;
    }

    &__year {
      margin: 0;
      margin-bottom: 1em;
      color: ${props => props.theme.mute};
    }
  }
`;

const Search = ({
  q,
  matches,
  current,
  playing,
  handleChange,
  trackPlayPause,
  contextMenuTrack,
}) => {
  // initial component mount
  if (matches === null) {
    return (
      <SearchContainer>
        <div className="search">
          <div className="search__label">Search for an Artist, Song, Album or Playlist</div>
          <input
            className="search__input"
            placeholder="Search"
            value={q}
            onChange={handleChange}
          />
        </div>
      </SearchContainer>
    );
  }

  // no matches found
  if (isEqual(matches, {
    album: [],
    artist: [],
    playlist: [],
    track: [],
  })) {
    return (
      <SearchContainer>
        <div className="search">
          <div className="search__label">Search for an Artist, Song, Album or Playlist</div>
          <input
            className="search__input"
            placeholder="Search"
            value={q}
            onChange={handleChange}
          />
        </div>

        <div className="result no-matches">
          <h3>No Results</h3>
        </div>
      </SearchContainer>
    );
  }

  // search has result...
  return (
    <SearchContainer>
      <div className="search">
        <div className="search__label">Search for an Artist, Song, Album or Playlist</div>
        <input
          className="search__input"
          placeholder="Search"
          value={q}
          onChange={handleChange}
        />
      </div>

      <div className="result">
        <div className="result__list">
          { /* artist */ }
          { matches.artist.length > 0 ? <h2><Divider text>Artists&nbsp;</Divider></h2> : null }
          {
            matches.artist.length > 0 ?
              <div className="result-match-list">
                { matches.artist.map(artist => (
                  <Link key={artist.artist_id} to={`artist/${artist.artist_id}`} className="result-match-list__match artist">
                    <ImageContainer borderRadius="50%">
                      <img alt={`${artist.artist_name}`} src={`${BASE_S3}${artist.artist_cover.s3_name}`} />
                    </ImageContainer>
                    <h3 className="artist__name">{ artist.artist_name }</h3>
                  </Link>))
                }
              </div> : null
          }

          { /* album */ }
          { /* apu: album-playlist[-uplaylist] */ }
          { matches.album.length > 0 ? <h2><Divider text>Albums&nbsp;</Divider></h2> : null }
          {
            matches.album.length > 0 ?
              <div className="result-match-list">
                { matches.album.map(album => (
                  <Link key={album.album_id} to={`album/${album.album_id}`} className="result-match-list__match apu">
                    <ImageContainer>
                      <img alt={`${album.album_name}`} src={`${BASE_S3}${album.album_cover.s3_name}`} />
                    </ImageContainer>
                    <h3 className="apu__name">{ album.album_name }</h3>
                    <p className="apu__year">{ album.album_year }</p>
                  </Link>))
                }
              </div> : null
          }

          { /* playlist */ }
          { matches.playlist.length > 0 ? <h2><Divider text>Playlists&nbsp;</Divider></h2> : null }
          {
            matches.playlist.length > 0 ?
              <div className="result-match-list">
                { matches.playlist.map(playlist => (
                  <Link key={playlist.playlist_id} to={`playlist/${playlist.playlist_id}`} className="result-match-list__match apu">
                    <ImageContainer>
                      <img alt={`${playlist.playlist_name}`} src={`${BASE_S3}${playlist.playlist_cover.s3_name}`} />
                    </ImageContainer>
                    <h3 className="apu__name">{ playlist.playlist_name }</h3>
                  </Link>))
                }
              </div> : null
          }

          { /* track */ }
          { matches.track.length > 0 ? <h2><Divider text>Tracks&nbsp;</Divider></h2> : null }
          {
            matches.track.length > 0 ?
              <div>
                <Divider />
                {
                  matches.track.map((track, index) => (
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
              </div> : null
          }
        </div>
      </div>
    </SearchContainer>
  );
};

Search.propTypes = {
  q: string,
  matches: shape({}),
  current: shape({}),
  playing: bool,
  handleChange: func.isRequired,
  trackPlayPause: func.isRequired,
  contextMenuTrack: func.isRequired,
};

Search.defaultProps = {
  q: '',
  matches: null,
  current: null,
  playing: false,
};

module.exports = Search;
