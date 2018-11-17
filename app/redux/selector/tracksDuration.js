import { createSelector } from 'reselect';

import { human } from '@app/util/time';

export default createSelector([state => state.tracks], tracks => human(tracks.reduce((totalDuration, track) => totalDuration + track.track_track.s3_meta.duration, 0), true));
