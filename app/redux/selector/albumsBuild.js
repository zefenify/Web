import { createSelector } from 'reselect';
import cloneDeep from 'lodash/cloneDeep';

import { human } from '@app/util/time';
import trackListSame from '@app/util/trackListSame';
import track from '@app/util/track';

// eslint-disable-next-line
module.exports = createSelector([props => props.song, props => props.user, props => props.queueInitial, props => props.match.params.id], (song, user, queueInitial, id) => {
  if (song === null || user === null || Object.hasOwnProperty.call(song.included, 'album') === false) {
    return {
      albums: [],
      albumsPlayingId: '',
      albumPlaying: false,
      duration: {
        hours: 0,
        minutes: 0,
        seconds: 0,
      },
    };
  }

  const included = cloneDeep(song.included);
  const albums = id === undefined ? Object.values(included.album) : Object.values(included.album).filter(album => album.album_id === id);
  const savedTrackIds = song.data.song_track;
  let albumsPlayingId = '';

  // fix your face, I'm going to be mutating albums...
  // removing tracks that are not saved in album relationship...
  albums.forEach((album) => {
    // albums -> removing tracks that are not saved -> passing to track for referencing...
    // eslint-disable-next-line
    album.relationships.track = track(album.relationships.track.filter(trackId => savedTrackIds.includes(trackId)).map(trackId => included.track[trackId]), included);
    // album artist mapping...
    // eslint-disable-next-line
    album.album_artist = album.album_artist.map(artistId => included.artist[artistId]);
    // eslint-disable-next-line
    album.album_cover = included.s3[album.album_cover];
  });

  if (id === undefined && queueInitial.length > 0) {
    // finding `albumsPlayingIndex`...
    albums.forEach((album) => {
      if (trackListSame(album.relationships.track, queueInitial) === true) {
        albumsPlayingId = album.album_id;
      }
    });
  }

  if (albums.length === 1 && id !== undefined) {
    // building `duration` and `albumPlaying` for album view...
    return {
      albums,
      albumsPlayingId,
      duration: human(albums[0].relationships.track.reduce((totalD, t) => totalD + t.track_track.s3_meta.duration, 0), true),
      albumPlaying: trackListSame(albums[0].relationships.track, queueInitial),
    };
  }

  return {
    albums,
    albumsPlayingId,
    albumPlaying: false,
    duration: {
      hours: 0,
      minutes: 0,
      seconds: 0,
    },
  };
});
