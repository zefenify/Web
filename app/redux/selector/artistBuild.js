import { createSelector } from 'reselect';
import flatten from 'lodash/flatten';
import cloneDeep from 'lodash/cloneDeep';
import sortBy from 'lodash/sortBy';
import reverse from 'lodash/reverse';
import uniqBy from 'lodash/uniqBy';

import trackListSame from '@app/util/trackListSame';
import track from '@app/util/track';

// eslint-disable-next-line
export default createSelector([props => props.song, props => props.user, props => props.queueInitial, props => props.match.params.id], (song, user, queueInitial, artistId) => {
  if (song === null || user === null || Object.hasOwnProperty.call(song.included, 'album') === false) {
    return {
      artist: [],
      artistPlayingId: '',
      albumPlayingId: '',
      trackCount: 0,
    };
  }

  let albumListWithTrackFilteredAndYearOrdered = cloneDeep(Object.values(song.included.album)).map((album) => {
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

  albumListWithTrackFilteredAndYearOrdered = reverse(sortBy(albumListWithTrackFilteredAndYearOrdered, album => album.album_year));

  const trackList = track(song.data.song_track.map(trackId => song.included.track[trackId]), song.included);
  const artistWithFeaturingRemoved = {};

  uniqBy(flatten(trackList.map(_track => _track.track_album.album_artist)), 'artist_id').forEach((artist) => {
    artistWithFeaturingRemoved[artist.artist_id] = Object.assign({}, song.included.artist[artist.artist_id], {
      artist_cover: song.included.s3[artist.artist_cover],
      relationships: {
        album: [],
        track: [],
      },
    });
  });

  albumListWithTrackFilteredAndYearOrdered.forEach((album) => {
    album.album_artist.forEach((artist) => {
      artistWithFeaturingRemoved[artist.artist_id].relationships.album.push(album);
    });
  });

  let artistPlayingId = '';
  let albumPlayingId = '';
  Object.values(artistWithFeaturingRemoved).forEach((artist) => {
    if (trackListSame(flatten(artist.relationships.album.map(album => album.relationships.track)), queueInitial) === true) {
      artistPlayingId = artist.artist_id;
    }

    artist.relationships.album.forEach((album) => {
      if (trackListSame(album.relationships.track, queueInitial) === true) {
        albumPlayingId = album.album_id;
      }
    });
  });

  if (artistId !== undefined) {
    if (artistWithFeaturingRemoved[artistId] === undefined) {
      return {
        artist: artistWithFeaturingRemoved[artistId] === undefined ? [] : [artistWithFeaturingRemoved[artistId]],
        albumPlayingId,
        artistPlayingId,
        trackCount: 0,
      };
    }

    const artistTracksFlat = [];
    artistWithFeaturingRemoved[artistId].relationships.album.forEach((album) => {
      artistTracksFlat.push(...album.relationships.track);
    });

    return {
      artist: artistWithFeaturingRemoved[artistId] === undefined ? [] : [artistWithFeaturingRemoved[artistId]],
      albumPlayingId,
      artistPlayingId,
      trackCount: artistTracksFlat.length,
    };
  }

  return {
    artist: Object.values(artistWithFeaturingRemoved),
    albumPlayingId,
    artistPlayingId,
    trackCount: 0,
  };
});
