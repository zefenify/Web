import React from 'react';
import { string, func, bool, shape } from 'prop-types';
import styled from 'react-emotion';
import { Link } from 'react-router-dom';
import isEqual from 'lodash/fp/isEqual';

import { BASE_S3 } from '@app/config/api';

import Divider from '@app/component/styled/Divider';
import Song from '@app/component/presentational/Song';

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
    background-color: ${props => props.theme.controlBackground};
    box-shadow: 0 0 4px 2px ${props => props.theme.navBarBoxShadow};

    &__label {
      font-size: 1em;
      margin-bottom: 0.5em;
      color: ${props => props.theme.controlText};
    }

    &__input {
      font-size: 42px;
      font-weight: bold;
      border: none;
      color: ${props => props.theme.controlText};
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
        flex: 0 0 25%;
      }
    }
  }

  .artist {
    display: flex;
    flex-direction: column;
    text-decoration: none;
    color: inherit;

    &__cover {
      width: 100%;
      height: auto;
      border-radius: 50%;
      border: 1px solid ${props => props.theme.listDivider};
    }

    &__name {
      text-align: center;
    }
  }

  .apu {
    display: flex;
    flex-direction: column;
    text-decoration: none;
    color: inherit;

    &__cover {
      width: 100%;
      height: auto;
      border-radius: 6px;
      border: 1px solid ${props => props.theme.listDivider};
    }

    &__name {
      margin: 0.5em 0;
    }

    &__year {
      margin: 0;
      margin-bottom: 1em;
      color: ${props => props.theme.controlMute};
    }
  }
`;

const Search = ({
  q,
  matches,
  current,
  playing,
  handleChange,
  togglePlayPauseSong,
}) => {
  // initial component mount
  if (matches === null) {
    return (
      <SearchContainer>
        <div className="search">
          <div className="search__label">Search for Song, Artist, Album or Playlist</div>
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
  if (isEqual(matches)({
    album: [],
    artist: [],
    playlist: [],
    track: [],
  })) {
    return (
      <SearchContainer>
        <div className="search">
          <div className="search__label">Search for Song, Artist, Album or Playlist</div>
          <input
            className="search__input"
            placeholder="Search"
            value={q}
            onChange={handleChange}
          />
        </div>

        <div className="result no-matches">
          <h2>No matches</h2>
        </div>
      </SearchContainer>
    );
  }

  // search has result...
  return (
    <SearchContainer>
      <div className="search">
        <div className="search__label">Search for Song, Artist, Album or Playlist</div>
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
          { matches.artist.length > 0 ? <h2>Artists</h2> : null }
          {
            matches.artist.length > 0 ?
              <div className="result-match-list">
                { matches.artist.map(artist => (
                  <Link to={`artist/${artist.artist_id}`} className="result-match-list__match artist">
                    <img className="artist__cover" alt={`${artist.artist_name}`} src={`${BASE_S3}${artist.artist_cover.s3_name}`} />
                    <h3 className="artist__name">{ artist.artist_name }</h3>
                  </Link>))
                }
              </div> : null
          }
          { matches.artist.length > 0 ? <Divider /> : null }

          { /* album */ }
          { /* apu: album-playlist[-uplaylist] */ }
          { matches.album.length > 0 ? <h2>Albums</h2> : null }
          {
            matches.album.length > 0 ?
              <div className="result-match-list">
                { matches.album.map(album => (
                  <Link to={`album/${album.album_id}`} className="result-match-list__match apu">
                    <img className="apu__cover" alt={`${album.album_name}`} src={`${BASE_S3}${album.album_cover.s3_name}`} />
                    <h3 className="apu__name">{ album.album_name }</h3>
                    <p className="apu__year">{ album.album_year }</p>
                  </Link>))
                }
              </div> : null
          }
          { matches.album.length > 0 ? <Divider /> : null }

          { /* playlist */ }
          { matches.playlist.length > 0 ? <h2>Playlists</h2> : null }
          {
            matches.playlist.length > 0 ?
              <div className="result-match-list">
                { matches.playlist.map(playlist => (
                  <Link to={`playlist/${playlist.playlist_id}`} className="result-match-list__match apu">
                    <img className="apu__cover" alt={`${playlist.playlist_name}`} src={`${BASE_S3}${playlist.playlist_cover.s3_name}`} />
                    <h3 className="apu__name">{ playlist.playlist_name }</h3>
                  </Link>))
                }
              </div> : null
          }
          { matches.playlist.length > 0 ? <Divider /> : null }

          { /* track */ }
          { matches.track.length > 0 ? <h2>Tracks</h2> : null }
          {
            matches.track.length > 0 ?
              matches.track.map((song, index) => (
                <Song
                  key={song.track_id}
                  currentSongId={current === null ? -1 : current.track_id}
                  trackNumber={index + 1}
                  togglePlayPause={togglePlayPauseSong}
                  playing={playing}
                  songId={song.track_id}
                  songName={song.track_name}
                  songFeaturing={song.track_featuring}
                  songDuration={song.track_track.s3_meta.duration}
                  songAlbum={song.track_album}
                />
              )) : null
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
  togglePlayPauseSong: func.isRequired,
};

Search.defaultProps = {
  q: '',
  matches: null,
  current: null,
  playing: false,
};

module.exports = Search;
