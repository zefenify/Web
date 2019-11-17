import React, { memo } from 'react';
import {
  func,
  shape,
  bool,
  number,
  arrayOf,
} from 'prop-types';
import isEqual from 'react-fast-compare';

import Track from '@app/component/presentational/Track';
import Button from '@app/component/styled/Button';
import HeaderView from '@app/component/styled/HeaderView';


const Recent = ({
  playing,
  current,
  track,
  durationTotal,
  tracksPlaying,
  tracksPlayPause,
  trackPlayPause,
  contextMenuTrack,
}) => {
  if (track.length === 0) {
    return (
      <div className="d-flex flex-column flex-grow-1 flex-shrink-0 align-items-center justify-content-center">
        <h2>{ 'ኦ ማይ ጋድ, You Haven\'t Played Any Track...Yet' }</h2>
      </div>
    );
  }

  const { hour, minute, second } = durationTotal;

  return (
    <HeaderView>
      <div className="__header">
        <h1>Recently Played</h1>
      </div>

      <div className="__view">
        <div className="d-flex flex-column align-items-start flex-grow-1 px-3">
          <p className="m-0 p-0 mt-3">{`${track.length} Song${track.length > 1 ? 's' : ''} • ${hour > 0 ? `${hour} hr` : ''} ${minute} min ${hour > 0 ? '' : `${second} sec`}`}</p>
          <Button className="mt-2 mb-3" style={{ width: '125px' }} onClick={tracksPlayPause}>{`${(playing && tracksPlaying) ? 'PAUSE' : 'PLAY'}`}</Button>

          {
            track.map((_track, index) => (
              <Track
                key={_track.id}
                currentTrackId={current === null ? 'ZEFENIFY' : current.id}
                trackNumber={index + 1}
                trackPlayPause={trackPlayPause}
                playing={playing}
                trackId={_track.id}
                trackName={_track.name}
                trackFeaturing={_track.featuring}
                trackDuration={_track.track.meta.duration}
                trackAlbum={_track.album}
                contextMenuTrack={contextMenuTrack}
              />
            ))
          }
        </div>
      </div>
    </HeaderView>
  );
};

Recent.propTypes = {
  playing: bool,
  tracksPlaying: bool,
  current: shape({}),
  track: arrayOf(shape({})),
  durationTotal: shape({
    hour: number,
    minute: number,
    second: number,
  }),
  trackPlayPause: func.isRequired,
  tracksPlayPause: func.isRequired,
  contextMenuTrack: func.isRequired,
};

Recent.defaultProps = {
  playing: false,
  tracksPlaying: false,
  current: null,
  track: [],
  durationTotal: {
    hour: 0,
    minute: 0,
    second: 0,
  },
};

export default memo(Recent, (previousProps, nextProps) => isEqual({
  playing: previousProps.playing,
  tracksPlaying: previousProps.tracksPlaying,
  current: previousProps.current,
  track: previousProps.track,
}, {
  playing: nextProps.playing,
  tracksPlaying: nextProps.tracksPlaying,
  current: nextProps.current,
  track: nextProps.track,
}));
