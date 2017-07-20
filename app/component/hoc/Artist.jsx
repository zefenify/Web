/* eslint no-console: 0 */

import React, { Component } from 'react';
import { string, shape } from 'prop-types';
import styled from 'emotion/react';
import flatten from 'lodash/flatten';

import { BASE } from '@app/config/api';
import { PLAY, TOGGLE_PLAY_PAUSE } from '@app/redux/constant/wolfCola';

import sameSongList from '@app/util/sameSongList';
import api from '@app/util/api';
import store from '@app/redux/store';

import Divider from '@app/component/styled/Divider';
import Song from '@app/component/presentational/Song';
import Button from '@app/component/styled/Button';

const ArtistContainer = styled.div`
  display: flex;
  flex-direction: column;

  .artist {
    flex: 1 0 auto;
    display: flex;
    flex-direction: row;
    padding: 1em 2em;

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
    padding: 0 2em;

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

class Artist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      artist: null,
      current: null,
      playing: false,
      songCount: 0,
      albumPlayingIndex: -1, // controls queue set on album play
      playingArist: false, // checks the current initialQueue is filled with artists song [flat]
    };

    this.togglePlayPauseArtist = this.togglePlayPauseArtist.bind(this);
    this.togglePlayPauseSong = this.togglePlayPauseSong.bind(this);
    this.togglePlayPauseAlbum = this.togglePlayPauseAlbum.bind(this);
    this.afterFetch = this.afterFetch.bind(this);
  }

  componentDidMount() {
    api(`${BASE}/json/artist/${this.props.match.params.id}.json`)
      .then((data) => {
        this.afterFetch(data);
      }, (err) => {
        console.log(err);
      });

    this.unsubscribe = store.subscribe(() => {
      if (this.state.artist === null) {
        return;
      }

      const { playing, current, initialQueue } = store.getState();
      this.setState(() => ({ playing, current, initialQueue }));
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.id === this.props.match.params.id) {
      return;
    }

    api(`${BASE}/json/artist/${nextProps.match.params.id}.json`)
      .then((data) => {
        this.afterFetch(data);
      }, (err) => {
        console.log(err);
      });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  afterFetch(data) {
    // building a copy so each song containing `artistId`, `artistName` & `thumbnail`
    // also replace `albumPurl` `icon` with `cover`
    const restructuredData = Object.assign({}, data);
    restructuredData.albums = restructuredData.albums.map((album) => {
      const albumCopy = Object.assign({}, album);
      albumCopy.songs = albumCopy.songs.map(song => Object.assign(song, {
        artistId: restructuredData.artistId,
        artistName: restructuredData.artistName,
        albumName: albumCopy.albumName,
        playtime: song.songPlaytime,
        thumbnail: albumCopy.albumPurl.replace('_icon_', '_cover_'),
      }));
      albumCopy.albumPurl = albumCopy.albumPurl.replace('_icon_', '_cover_');

      return albumCopy;
    });

    const { initialQueue } = store.getState();
    const flattenSongs = flatten(restructuredData.albums.map(album => album.songs));

    const queueIsByArtist = (albums, queue) => {
      const queueIsBySingleArtist = queue.every(song => song.artistId === restructuredData.artistId);

      if (queueIsBySingleArtist === false) {
        return false;
      }

      // looking for album index to set `PAUSE`...
      let albumIndex = -1;
      const queueSongIdList = queue.map(song => song.songId);

      albums.forEach((album, index) => {
        if (albumIndex === -1 && album.songs.every(song => queueSongIdList.includes(song.songId))) {
          albumIndex = index;
        }
      });

      return albumIndex;
    };

    this.setState(() => ({
      artist: restructuredData,
      songCount: flattenSongs.length,
      playingArist: sameSongList(initialQueue, flattenSongs),
      albumPlayingIndex: sameSongList(initialQueue, flattenSongs) ? -1 : queueIsByArtist(restructuredData.albums, initialQueue),
    }));
  }

  togglePlayPauseArtist() {
    if (this.state.artist === null) {
      return;
    }

    // booting playlist...
    if (this.state.current === null || this.state.playingArist === false) {
      const flattenSongs = flatten(this.state.artist.albums.map(album => album.songs));

      store.dispatch({
        type: PLAY,
        payload: {
          play: flattenSongs[0],
          queue: flattenSongs,
          initialQueue: flattenSongs,
        },
      });

      this.setState(() => ({
        albumPlayingIndex: -1,
        playingArist: true,
      }));
      // resuming / pausing playlist
    } else if (this.state.current !== null) {
      store.dispatch({
        type: TOGGLE_PLAY_PAUSE,
      });
    }
  }

  togglePlayPauseAlbum(album, albumIndex) {
    if (this.state.current === null || this.state.albumPlayingIndex !== albumIndex) {
      store.dispatch({
        type: PLAY,
        payload: {
          play: album.songs[0],
          queue: album.songs,
          initialQueue: album.songs,
        },
      });

      this.setState(() => ({
        albumPlayingIndex: albumIndex,
        playingArist: true,
      }));

      return;
    }

    if (this.state.albumPlayingIndex === albumIndex) {
      store.dispatch({
        type: TOGGLE_PLAY_PAUSE,
      });
    }
  }

  togglePlayPauseSong(songId) {
    const flattenSongs = flatten(this.state.artist.albums.map(album => album.songs));
    const songIndex = flattenSongs.findIndex(song => song.songId === songId);

    if (this.state.current !== null && this.state.current.songId === songId) {
      store.dispatch({
        type: TOGGLE_PLAY_PAUSE,
      });

      return;
    }

    store.dispatch({
      type: PLAY,
      payload: {
        play: flattenSongs[songIndex],
        queue: flattenSongs,
        initialQueue: flattenSongs,
      },
    });

    this.setState(() => ({
      albumPlayingIndex: -1,
      playingArist: true,
    }));
  }

  render() {
    if (this.state.artist === null) {
      return null;
    }

    return (
      <ArtistContainer>
        <div className="artist">
          <div className="artist__image" style={{ background: `transparent url('${BASE}${this.state.artist.thumbnail}') 50% 50% / cover no-repeat` }} />
          <div className="artist__info">
            <p>ARTIST</p>
            <h1>{ this.state.artist.artistName }</h1>
            <p style={{ marginTop: '0.5em' }}>{`${this.state.artist.albums.length} album${this.state.artist.albums.length > 1 ? 's' : ''}, ${this.state.songCount} song${this.state.songCount > 1 ? 's' : ''}`}</p>
            <Button onClick={this.togglePlayPauseArtist}>{`${this.state.playing && this.state.playingArist && this.state.albumPlayingIndex === -1 ? 'PAUSE' : 'PLAY'}`}</Button>
          </div>
        </div>

        <Divider />

        <div className="album-list">
          <h2>Albums</h2>

          {
            this.state.artist.albums.map((album, albumIndex) => (
              <div className="album-list__album album" key={`${this.state.artist.artistId}-${album.albumName}`}>
                <div className="album-cover">
                  <div className="album-cover__cover" style={{ background: `transparent url('${BASE}${album.albumPurl}') 50% 50% / cover no-repeat` }} />
                  <div className="album-cover__info album-info">
                    <h1 className="album-info__name">{ album.albumName }</h1>
                    <Button className="album-info__button" onClick={() => this.togglePlayPauseAlbum(album, albumIndex)}>{`${this.state.playing && this.state.albumPlayingIndex === albumIndex ? 'PAUSE' : 'PLAY'}`}</Button>
                  </div>
                </div>

                <div className="album__song-list song-list">
                  {
                    album.songs.map((song, songIndex) => (
                      <Song
                        fullDetail={false}
                        key={song.songId}
                        currentSongId={this.state.current === null ? -1 : this.state.current.songId}
                        trackNumber={songIndex + 1}
                        togglePlayPause={this.togglePlayPauseSong}
                        playing={this.state.playing}
                        {...song}
                      />
                    ))
                  }
                </div>
              </div>
            ))
          }
        </div>
      </ArtistContainer>
    );
  }
}

Artist.propTypes = {
  match: shape({
    params: shape({
      id: string,
    }),
  }).isRequired,
};

module.exports = Artist;
