import React from 'react';
import { string, func, bool, shape } from 'prop-types';
import styled from 'emotion/react';

import { BASE } from '@app/config/api';

import Song from '@app/component/presentational/Song';

const SearchWrapper = styled.div`
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

    &__artwork {
      flex: 0 0 225px;
      height: 225px;
      border: 1px solid rgba(51, 51, 51, 0.25);
      border-radius: 6px;
    }

    &__list {
      padding-left: 1em;
      flex: 1 1 auto;
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
      <SearchWrapper>
        <div className="search">
          <div className="search__label">Search for an Artist, Song or Album</div>
          <input
            className="search__input"
            placeholder="አኩኩሉ..."
            value={q}
            onChange={handleChange}
          />
        </div>
      </SearchWrapper>
    );
  }

  // no matches found
  if (matches.songs.length === 0) {
    return (
      <SearchWrapper>
        <div className="search">
          <div className="search__label">Search for an Artist, Song or Album</div>
          <input
            className="search__input"
            placeholder="አኩኩሉ..."
            value={q}
            onChange={handleChange}
          />
        </div>

        <div className="result no-matches">
          <h2>{`ጉራ ብቻ - የለም match ለ "${q}"...`}</h2>
        </div>
      </SearchWrapper>
    );
  }

  // search has result...
  return (
    <SearchWrapper>
      <div className="search">
        <div className="search__label">Search for an Artist, Song or Album</div>
        <input
          className="search__input"
          placeholder="አኩኩሉ..."
          value={q}
          onChange={handleChange}
        />
      </div>

      <div className="result">
        <div className="result__artwork" style={{ background: `transparent url('${BASE}${matches.thumbnail}') 50% 50% / cover no-repeat` }} />

        <div className="result__list">
          {
            matches.songs.map((song, index) => (
              <Song
                key={song.songId}
                currentSongId={current === null ? -1 : current.songId}
                trackNumber={index + 1}
                togglePlayPause={togglePlayPauseSong}
                playing={playing}
                {...song}
              />
            ))
          }
        </div>
      </div>
    </SearchWrapper>
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
