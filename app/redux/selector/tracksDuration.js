import { createSelector } from 'reselect';

import time from '@app/util/time';

export default createSelector([state => state.tracks], tracks => time(tracks.reduce((totalDuration, track) => totalDuration + track.track.meta.duration, 0), true));
