import React from 'react';
import { shape, bool, number, func } from 'prop-types';
import styled from 'emotion/react';

import { BASE } from '@app/config/api';

import Divider from '@app/component/styled/Divider';
import Song from '@app/component/presentational/Song';
import Button from '@app/component/styled/Button';

const ArtistWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 0 0 auto;

  .artist {
    flex: 1 0 auto;
    display: flex;
    flex-direction: row;
    margin-bottom: 2em;

    &__image {
      flex: 0 0 200px;
      height: 200px;
      width: 200px;
      border: 1px solid rgba(51, 51, 51, 0.25);
      border-radius: 50%;
    }

    &__info {
      flex: 1 0 auto;
      display: flex;
      flex-direction: column;
      margin-left: 1em;
      justify-content: center;

      & > * {
        margin: 0;
      }

      & > p:not(:first-child) {
        color: ${props => props.theme.controlMute};
      }

      button {
        width: 175px;
        margin-top: 1em;
      }
    }
  }

  .album-list {
    &__album {
      margin-top: 2em;
      padding-bottom: 1px;
    }
  }

  .album {
    &__song-list {
      margin-top: 1em;
    }
  }

  .album-cover {
    display: flex;
    flex-direction: row;
    align-items: center;

    &__cover {
      width: 150px;
      height: 150px;
      flex: 0 0 150px;
      border: 1px solid rgba(51, 51, 51, 0.25);
    }

    &__info {
      flex: 1 0 auto;
      padding-left: 1em;
    }
  }

  .album-info {
    display: flex;
    flex-direction: column;
    flex: 1 0 auto;
    max-width: 64vw;

    &__name {
      flex: 0 1 100%;
      font-size: 3em;
      padding: 0;
      margin: 0;
      margin-bottom: 0.25em;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    &__button {
      width: 125px;
    }
  }

  .song-list {
    display: flex;
    flex-direction: column;
  }
`;

const Arist = ({
  artist,
  current,
  playing,
  songCount,
  albumPlayingIndex,
  playingArist,
  togglePlayPauseArtist,
  togglePlayPauseSong,
  togglePlayPauseAlbum,
}) => (
  <ArtistWrapper>
    <div className="artist">
      <div className="artist__image" style={{ background: `transparent url('${BASE}${artist.thumbnail}') 50% 50% / cover no-repeat` }} />
      <div className="artist__info">
        <p>ARTIST</p>
        <h1>{ artist.artistName }</h1>
        <p style={{ marginTop: '0.5em' }}>{`${artist.albums.length} album${artist.albums.length > 1 ? 's' : ''}, ${songCount} song${songCount > 1 ? 's' : ''}`}</p>
        <Button onClick={togglePlayPauseArtist}>{`${playing && playingArist && albumPlayingIndex === -1 ? 'PAUSE' : 'PLAY'}`}</Button>
      </div>
    </div>

    <Divider />

    <div className="album-list">
      <h2>Albums</h2>

      {
        artist.albums.map((album, albumIndex) => (
          <div className="album-list__album album" key={`${artist.artistId}-${album.albumName}`}>
            <div className="album-cover">
              <div className="album-cover__cover" style={{ background: `transparent url('${BASE}${album.albumPurl}') 50% 50% / cover no-repeat` }} />
              <div className="album-cover__info album-info">
                <h1 className="album-info__name">{ album.albumName }</h1>
                <Button className="album-info__button" onClick={() => togglePlayPauseAlbum(album, albumIndex)}>{`${playing && albumPlayingIndex === albumIndex ? 'PAUSE' : 'PLAY'}`}</Button>
              </div>
            </div>

            <div className="album__song-list song-list">
              {
                album.songs.map((song, songIndex) => (
                  <Song
                    fullDetail={false}
                    key={song.songId}
                    currentSongId={current === null ? -1 : current.songId}
                    trackNumber={songIndex + 1}
                    togglePlayPause={togglePlayPauseSong}
                    playing={playing}
                    {...song}
                  />
                ))
              }
            </div>
          </div>
        ))
      }
    </div>
  </ArtistWrapper>
);

Arist.propTypes = {
  artist: shape({}),
  current: shape({}),
  playing: bool,
  songCount: number,
  albumPlayingIndex: number,
  playingArist: bool,
  togglePlayPauseArtist: func.isRequired,
  togglePlayPauseSong: func.isRequired,
  togglePlayPauseAlbum: func.isRequired,
};

Arist.defaultProps = {
  artist: null,
  current: null,
  playing: false,
  songCount: 0,
  albumPlayingIndex: -1,
  playingArist: false,
};

module.exports = Arist;
