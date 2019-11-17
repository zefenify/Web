import { createSelector } from 'reselect';
import cloneDeep from 'lodash/cloneDeep';

import time from '@app/util/time';
import trackListSame from '@app/util/trackListSame';
import track from '@app/util/track';


// eslint-disable-next-line
export default createSelector([props => props.song, props => props.user, props => props.queueInitial, props => props.match.params.id], (song, user, queueInitial, albumId) => {
  if (song === null || user === null || Object.hasOwnProperty.call(song.included, 'album') === false) {
    return {
      album: [],
      albumPlayingId: '',
      albumPlaying: false,
      duration: {
        hour: 0,
        minute: 0,
        second: 0,
      },
    };
  }

  const included = cloneDeep(song.included);
  const albumList = albumId === undefined ? Object.values(included.album) : Object.values(included.album).filter(album => album.album_id === albumId);
  const savedTrackIds = song.data.song_track;
  let albumPlayingId = '';

  // fix your face, I'm going to be mutating albumList...
  // removing tracks that are not saved in album relationship...
  albumList.forEach((album) => {
    // albumList -> removing tracks that are not saved -> passing to track for referencing...
    // eslint-disable-next-line
    album.relationships.track = track(album.relationships.track.filter(trackId => savedTrackIds.includes(trackId)).map(trackId => included.track[trackId]), included);
    // album artist mapping...
    // eslint-disable-next-line
    album.album_artist = album.album_artist.map(artistId => included.artist[artistId]);
    // eslint-disable-next-line
    album.album_cover = included.s3[album.album_cover];
  });

  if (albumId === undefined && queueInitial.length > 0) {
    // finding `albumPlayingIndex` for album view...
    albumList.forEach((album) => {
      if (trackListSame(album.relationships.track, queueInitial) === true) {
        albumPlayingId = album.album_id;
      }
    });
  }

  if (albumList.length === 1 && albumId !== undefined) {
    // building `duration` and `albumPlaying` for single album view...
    return {
      album: albumList,
      albumPlayingId,
      albumPlaying: trackListSame(albumList[0].relationships.track, queueInitial),
      duration: time(albumList[0].relationships.track.reduce((totalDuration, _track) => totalDuration + _track.track_track.s3_meta.duration, 0), true),
    };
  }

  return {
    album: albumList,
    albumPlayingId,
    albumPlaying: false,
    duration: {
      hour: 0,
      minute: 0,
      second: 0,
    },
  };
});
