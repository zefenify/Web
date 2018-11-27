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


const Queue = ({
  playing,
  current,
  queueNext,
  durationTotal,
  queueNextPlay,
  trackPlayPause,
  contextMenuTrack,
}) => {
  if (queueNext.length === 0) {
    return (
      <div className="d-flex flex-column flex-grow-1 flex-shrink-0 align-items-center justify-content-center">
        <h2 className="mute">Queue Is Empty...Spice It up እንጂ</h2>
      </div>
    );
  }

  const { hour, minute, second } = durationTotal;

  return (
    <HeaderView>
      <div className="__header">
        <h1>Queue</h1>
      </div>

      <div className="__view">
        <div className="d-flex flex-column align-items-start flex-grow-1 px-3">
          <p className="m-0 p-0 mt-3">{`${queueNext.length} Song${queueNext.length > 1 ? 's' : ''} • ${hour > 0 ? `${hour} hr` : ''} ${minute} min ${hour > 0 ? '' : `${second} sec`}`}</p>
          <Button className="mt-2 mb-3" style={{ width: '125px' }} onClick={queueNextPlay}>PLAY</Button>

          {
            queueNext.map((track, index) => (
              <Track
                key={track.track_id}
                currentTrackId={current === null ? '' : current.track_id}
                trackNumber={index + 1}
                trackPlayPause={trackPlayPause}
                playing={playing}
                trackId={track.track_id}
                trackName={track.track_name}
                trackFeaturing={track.track_featuring}
                trackDuration={track.track_track.s3_meta.duration}
                trackAlbum={track.track_album}
                contextMenuTrack={contextMenuTrack}
              />
            ))
          }
        </div>
      </div>
    </HeaderView>
  );
};

Queue.propTypes = {
  playing: bool,
  current: shape({}),
  queueNext: arrayOf(shape({})),
  durationTotal: shape({
    hour: number,
    minute: number,
    second: number,
  }),
  queueNextPlay: func.isRequired,
  trackPlayPause: func.isRequired,
  contextMenuTrack: func.isRequired,
};

Queue.defaultProps = {
  playing: false,
  current: null,
  queueNext: [],
  durationTotal: {
    hour: 0,
    minute: 0,
    second: 0,
  },
};

export default memo(Queue, (previousProps, nextProps) => isEqual({
  playing: previousProps.playing,
  current: previousProps.current,
  queueNext: previousProps.queueNext,
}, {
  playing: nextProps.playing,
  current: nextProps.current,
  queueNext: nextProps.queueNext,
}));
