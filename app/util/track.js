/**
 * given a list of tracks [0 depth] and included, returns a track that has references in-line
 *
 * @param  {Array} tracks
 * @param  {Array} included
 * @return {Array}
 */
module.exports = (tracks = [], included = []) => tracks.map(track => Object.assign({}, {
  track_id: track.track_id,
  track_number: track.track_number,
  track_name: track.track_name,
  track_explicit: track.track_explicit,
  track_track: included.s3[track.track_track],
  track_featuring: track.track_featuring.map(artistId => included.artist[artistId]),
  track_album: Object.assign({}, {
    album_id: included.album[track.track_album].album_id,
    album_name: included.album[track.track_album].album_name,
    album_year: included.album[track.track_album].album_year,
    album_artist: included.album[track.track_album].album_artist.map(artistId => included.artist[artistId]),
    album_cover: included.s3[included.album[track.track_album].album_cover],
  }),
}));
