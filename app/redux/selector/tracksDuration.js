import { createSelector } from 'reselect';

import time from '@app/util/time';

export default createSelector([state => state.tracks], tracks => time(tracks.reduce((totalDuration, track) => totalDuration + track.track_track.s3_meta.duration, 0), true));
