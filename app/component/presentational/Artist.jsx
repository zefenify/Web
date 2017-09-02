import React from 'react';
import { shape, bool, number, func } from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'emotion/react';
import { withTheme } from 'theming';

import { BASE_S3 } from '@app/config/api';

import Divider from '@app/component/styled/Divider';
import Song from '@app/component/presentational/Song';
import Button from '@app/component/styled/Button';

const ArtistContainer = withTheme(styled.div`
  display: flex;
  flex-direction: column;
  flex: 0 0 auto;

  & .artist {
    flex: 1 0 auto;
    display: flex;
    flex-direction: row;
    margin-bottom: 2em;

    &__image {
      flex: 0 0 200px;
      height: 200px;
      width: 200px;
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

      & button {
        width: 175px;
        margin-top: 1em;
      }
    }
  }

  & .album-list {
    &__album {
      margin-top: 2em;
      padding-bottom: 1px;
    }

    margin-bottom: 2em;
  }

  & .album {
    &__song-list {
      margin-top: 1em;
    }
  }

  & .album-cover {
    display: flex;
    flex-direction: row;
    align-items: center;

    &__cover {
      width: 150px;
      height: 150px;
      flex: 0 0 150px;
      border-radius: 4px;
    }

    &__info {
      flex: 1 0 auto;
      padding-left: 1em;
    }
  }

  & .album-info {
    display: flex;
    flex-direction: column;
    flex: 1 0 auto;
    max-width: 64vw;

    &__year {
      font-size: 1.25em;
      color: ${props => props.theme.controlMute};
      margin: 0;
    }

    &__name {
      flex: 0 1 auto;
      font-size: 3em;
      font-weight: bold;
      padding: 0;
      margin: 0;
      margin-bottom: 0.25em;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      text-decoration: none;
      color: inherit;
    }

    &__button {
      width: 125px;
    }
  }

  & .song-list {
    display: flex;
    flex-direction: column;
  }

  & .appears-container {
    position: absolute;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    padding: 0 1em;

    &__title {
      padding: 0 1em;
    }

    &__list {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
    }
  }

  & .appears-list {
    &__album {
      flex: 0 0 25%;

      @media(min-width: 1282px) {
        flex: 0 0 20%;
      }
    }
  }

  & .appears-album {
    display: flex;
    flex-direction: column;
    padding: 0 1em;
    margin-bottom: 3em;
    text-decoration: none;
    color: inherit;

    &__cover {
      position: relative;
      width: 100%;
      height: auto;
      min-height: 225px;
      border-radius: 6px;

      @media(min-width: 1284px) {
        height: 300px;
      }
    }

    &__name {
      margin: 0.5em 0;
    }

    &__year {
      margin: 0;
      color: ${props => props.theme.controlMute};
    }
  }
`);

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
  <ArtistContainer>
    <div className="artist">
      <div className="artist__image" style={{ background: `transparent url('${BASE_S3}${artist.artist_cover.s3_name}') 50% 50% / cover no-repeat` }} />
      <div className="artist__info">
        <p>ARTIST</p>
        <h1>{ artist.artist_name }</h1>
        <p style={{ marginTop: '0.5em' }}>{`${artist.relationships.album.length} album${artist.relationships.album.length > 1 ? 's' : ''}, ${songCount} song${songCount > 1 ? 's' : ''}`}</p>
        <Button onClick={togglePlayPauseArtist}>{`${playing && playingArist && albumPlayingIndex === -1 ? 'PAUSE' : 'PLAY'}`}</Button>
      </div>
    </div>

    <Divider />

    {
      artist.relationships.album.length === 0 ? null : <div className="album-list">
        <h2>Albums</h2>

        {
          artist.relationships.album.map((album, albumIndex) => (
            <div className="album-list__album album" key={`${artist.artist_id}-${album.album_id}`}>
              <div className="album-cover">
                <Link to={`/album/${album.album_id}`} className="album-cover__cover" style={{ background: `transparent url('${BASE_S3}${album.album_cover.s3_name}') 50% 50% / cover no-repeat` }} />
                <div className="album-cover__info album-info">
                  <p className="album-info__year">{ album.album_year }</p>
                  <Link className="album-info__name" to={`/album/${album.album_id}`}>{ album.album_name }</Link>
                  <Button className="album-info__button" onClick={() => togglePlayPauseAlbum(album, albumIndex)}>{`${playing && albumPlayingIndex === albumIndex ? 'PAUSE' : 'PLAY'}`}</Button>
                </div>
              </div>

              <div className="album__song-list song-list">
                {
                  album.relationships.track.map((song, songIndex) => (
                    <Song
                      fullDetail={false}
                      key={song.track_id}
                      currentSongId={current === null ? -1 : current.track_id}
                      trackNumber={songIndex + 1}
                      togglePlayPause={togglePlayPauseSong}
                      playing={playing}
                      songId={song.track_id}
                      songName={song.track_name}
                      songFeaturing={song.track_featuring}
                      songAlbum={album}
                      songDuration={song.track_track.s3_meta.duration}
                    />
                  ))
                }
              </div>
            </div>
          ))
        }
      </div>
    }

    <div>
      {
        artist.relationships.track.length === 0 ? null : <div className="appears-container">
          <h2 className="appears-container__title">Appears On</h2>

          <div className="appears-container__list appears-list">
            {
              artist.relationships.track.map(track => (
                <Link to={`/album/${track.track_album.album_id}`} className="appears-list__album appears-album">
                  <div className="appears-album__cover" style={{ background: `transparent url('${BASE_S3}${track.track_album.album_cover.s3_name}') 50% 50% / cover no-repeat` }} />
                  <p className="appears-album__name">{track.track_album.album_name}</p>
                  <p className="appears-album__year">{track.track_album.album_year}</p>
                </Link>
              ))
            }
          </div>
        </div>
      }
    </div>
  </ArtistContainer>
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
