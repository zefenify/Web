import { createSelector } from 'reselect';
import flatten from 'lodash/flatten';
import cloneDeep from 'lodash/cloneDeep';
import sortBy from 'lodash/sortBy';
import reverse from 'lodash/reverse';
import uniqBy from 'lodash/uniqBy';

import trackListSame from '@app/util/trackListSame';
import track from '@app/util/track';

// eslint-disable-next-line
module.exports = createSelector([props => props.song, props => props.user, props => props.queueInitial, props => props.match.params.id], (song, user, queueInitial, id) => {
  if (song === null || user === null || Object.hasOwnProperty.call(song.included, 'album') === false) {
    return {
      artists: [],
      artistPlayingId: '',
      albumPlayingId: '',
      trackCount: 0,
    };
  }

  let albumsWithTracksFilteredAndYearOrdered = cloneDeep(Object.values(song.included.album)).map((album) => {
    // I'm going to be mutating the *copy* so hold your horses...

    // eslint-disable-next-line
    album.relationships.track = album.relationships.track.filter(trackId => song.data.song_track.includes(trackId));
    // eslint-disable-next-line
    album.relationships.track = album.relationships.track.map(trackId => song.included.track[trackId]);
    // eslint-disable-next-line
    album.relationships.track = track(album.relationships.track, song.included);
    // eslint-disable-next-line
    album.album_artist = album.album_artist.map(artistId => song.included.artist[artistId]);
    // eslint-disable-next-line
    album.album_cover = song.included.s3[album.album_cover];

    return album;
  });

  albumsWithTracksFilteredAndYearOrdered = reverse(sortBy(albumsWithTracksFilteredAndYearOrdered, album => album.album_year));

  const tracks = track(song.data.song_track.map(trackId => song.included.track[trackId]), song.included);
  const artistsWithFeaturingRemoved = {};

  uniqBy(flatten(tracks.map(t => t.track_album.album_artist)), 'artist_id').forEach((artist) => {
    artistsWithFeaturingRemoved[artist.artist_id] = Object.assign({}, song.included.artist[artist.artist_id], {
      artist_cover: song.included.s3[artist.artist_cover],
      relationships: {
        album: [],
        track: [],
      },
    });
  });

  albumsWithTracksFilteredAndYearOrdered.forEach((album) => {
    album.album_artist.forEach((artist) => {
      artistsWithFeaturingRemoved[artist.artist_id].relationships.album.push(album);
    });
  });

  let artistPlayingId = '';
  let albumPlayingId = '';
  Object.values(artistsWithFeaturingRemoved).forEach((artist) => {
    if (trackListSame(flatten(artist.relationships.album.map(album => album.relationships.track)), queueInitial) === true) {
      artistPlayingId = artist.artist_id;
    }

    artist.relationships.album.forEach((album) => {
      if (trackListSame(album.relationships.track, queueInitial) === true) {
        albumPlayingId = album.album_id;
      }
    });
  });

  if (id !== undefined) {
    if (artistsWithFeaturingRemoved[id] === undefined) {
      return {
        artists: artistsWithFeaturingRemoved[id] === undefined ? [] : [artistsWithFeaturingRemoved[id]],
        albumPlayingId,
        artistPlayingId,
        trackCount: 0,
      };
    }

    const artistTracksFlat = [];
    artistsWithFeaturingRemoved[id].relationships.album.forEach((album) => {
      artistTracksFlat.push(...album.relationships.track);
    });

    return {
      artists: artistsWithFeaturingRemoved[id] === undefined ? [] : [artistsWithFeaturingRemoved[id]],
      albumPlayingId,
      artistPlayingId,
      trackCount: artistTracksFlat.length,
    };
  }

  return {
    artists: Object.values(artistsWithFeaturingRemoved),
    albumPlayingId,
    artistPlayingId,
    trackCount: 0,
  };
});
