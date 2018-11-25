import React from 'react';
import { Link } from 'react-router-dom';
import {
  func,
  shape,
  bool,
  number,
  arrayOf,
} from 'prop-types';

import Track from '@app/component/presentational/Track';
import Button from '@app/component/styled/Button';
import HeaderView from '@app/component/styled/HeaderView';

const Songs = ({
  playing,
  current,
  user,
  song,
  totalDuration,
  songPlaying,
  songPlayPause,
  trackPlayPause,
  contextMenuTrack,
}) => {
  if (user === null) {
    return (
      <div className="d-flex flex-column flex-grow-1 flex-shrink-0 align-items-center justify-content-center">
        <h2>You Need to Be Logged in to View Saved Songs</h2>
        <Link to="/settings" style={{ textDecoration: 'none' }}><Button>Go to Settings</Button></Link>
      </div>
    );
  }

  if (song.length === 0) {
    return (
      <div className="d-flex flex-column flex-grow-1 flex-shrink-0 align-items-center justify-content-center">
        <h2 className="mute">You Have No Saved Songs...Yet</h2>
      </div>
    );
  }

  const { hour, minute, second } = totalDuration;

  return (
    <HeaderView>
      <div className="__header">
        <h1>Songs</h1>
      </div>

      <div className="__view">
        <div className="d-flex flex-column align-items-start flex-grow-1 px-3">
          <p className="m-0 p-0 mt-3">{`${song.length} Song${song.length > 1 ? 's' : ''} • ${hour > 0 ? `${hour} hr` : ''} ${minute} min ${hour > 0 ? '' : `${second} sec`}`}</p>
          <Button className="mt-2 mb-3" style={{ width: '125px' }} onClick={songPlayPause}>{`${(playing && songPlaying) ? 'PAUSE' : 'PLAY'}`}</Button>

          {
            song.map((track, index) => (
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

Songs.propTypes = {
  playing: bool,
  current: shape({}),
  user: shape({}),
  song: arrayOf(shape({})),
  totalDuration: shape({
    hour: number,
    minute: number,
    second: number,
  }),
  songPlaying: bool,
  songPlayPause: func.isRequired,
  trackPlayPause: func.isRequired,
  contextMenuTrack: func.isRequired,
};

Songs.defaultProps = {
  playing: false,
  current: null,
  user: null,
  song: [],
  totalDuration: {
    hour: 0,
    minute: 0,
    second: 0,
  },
  songPlaying: false,
};

export default Songs;
