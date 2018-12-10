import React, { memo } from 'react';
import {
  func,
  number,
  string,
  bool,
  arrayOf,
  shape,
} from 'prop-types';
import styled from 'react-emotion';
import { Link } from 'react-router-dom';
import isEqual from 'react-fast-compare';

import { human } from '@app/util/time';
import ArtistList from '@app/component/presentational/ArtistList';
import Share from '@app/component/svg/Share';


const PlayPause = ({ onClick, playing, ...props }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="none"
    strokeWidth="1"
    strokeLinecap="round"
    strokeLinejoin="round"
    onClick={onClick}
    {...props}
  >
    {
      playing ? (
        <g>
          <rect x="6" y="4" width="4" height="16" fill="currentColor" />
          <rect x="14" y="4" width="4" height="16" fill="currentColor" />
        </g>
      ) : <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />
    }
  </svg>
);

PlayPause.propTypes = {
  onClick: func.isRequired,
  playing: bool,
};

PlayPause.defaultProps = {
  playing: false,
};


// this isn't inside `svg` folder because it would clash --- EH!? EH!?
const Volume = props => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
  </svg>
);


const TrackContainer = styled.div`
  position: relative;
  width: 100%;
  border-bottom: 1px solid ${props => props.theme.NATURAL_7};
  transition: background-color 128ms;

  /* the sketch makes way more sense for 'TrackContainer__control' rules */
  /* default state */
  .TrackContainer__control {
    min-width: 32px;

    &__track-number {
      opacity: 0;
    }

    &__play-pause {
      position: absolute;
      display: none;
    }

    &__volume {
      position: absolute;
      display: none;
    }
  }

  /* a track that's not being played AND not on hover */
  &:not(.active):not(:hover) {
    .TrackContainer__control {
      &__track-number {
        opacity: 1;
      }
    }
  }

  /* current track is equal to 'current' */
  &:not(:hover).active {
    .TrackContainer__control {
      &__volume {
        display: block;
      }
    }
  }

  /* non playing track is on hover */
  &:hover {
    background-color: ${props => props.theme.NATURAL_7};

    .TrackContainer__control {
      &__play-pause {
        display: block;
      }

      &__volume {
        display: none;
      }
    }
  }

  /* share ... */
  .TrackContainer__kdot {
    opacity: 0;
  }

  &:hover .TrackContainer__kdot {
    opacity: 1;
  }

  .TrackContainer__track-name {
    font-size: 1.125rem;
  }

  .TrackContainer__artist {
    color: ${props => props.theme.NATURAL_4};

    a {
      text-decoration: none;
      color: ${props => props.theme.NATURAL_3};
    }
  }

  &.active {
    color: ${props => props.theme.PRIMARY_4};

    .TrackContainer__artist {
      color: ${props => props.theme.PRIMARY_5};

      a {
        text-decoration: none;
        color: ${props => props.theme.PRIMARY_4};
      }
    }
  }
`;


const Track = ({
  fullDetail,
  currentTrackId,
  trackNumber,
  trackId,
  trackName,
  trackFeaturing,
  trackAlbum,
  trackDuration,
  trackPlayPause,
  playing,
  contextMenuTrack,
}) => (
  <TrackContainer
    onContextMenu={(e) => { e.preventDefault(); contextMenuTrack(trackId); }}
    className={`d-flex flex-row justify-content-center align-items-center flex-shrink-0 py-3 ${currentTrackId === trackId ? 'active' : ''}`}
    onDoubleClick={() => trackPlayPause(trackId)}
  >
    {/* track number */}
    <div className="TrackContainer__control d-flex justify-content-center align-items-center flex-grow-0 px-2">
      <span className="TrackContainer__control__track-number">{ trackNumber }</span>

      <PlayPause
        className="TrackContainer__control__play-pause"
        playing={currentTrackId === trackId && playing}
        onClick={() => trackPlayPause(trackId)}
      />

      <Volume className="TrackContainer__control__volume" />
    </div>
    {/* ./track number */}

    {/* track name / artist / album */}
    <div className="flex-grow-1 d-flex flex-column px-2">
      <p className="m-0 p-0 TrackContainer__track-name">{ trackName }</p>

      <div className="d-flex flex-row TrackContainer__artist">
        {
          fullDetail === true
            ? (<span className="mt-1 pr-2"><ArtistList artist={trackAlbum.album_artist} /></span>)
            : null
        }

        {
          trackFeaturing.length > 0
            ? (
              <span className="mt-1 pr-2">
                <span className="TrackContainer__themed-mute">feat.&nbsp;</span>
                <ArtistList artist={trackFeaturing} />
              </span>
            ) : null
        }

        {
          fullDetail === true ? (
            <span className="mt-1">
              <span className="pr-2 TrackContainer__themed-mute">•</span>
              <Link to={`/album/${trackAlbum.album_id}`}>{ trackAlbum.album_name }</Link>
            </span>
          ) : null
        }
      </div>
    </div>
    {/* ./ track name / artist / album */}

    {/* context menu + time */}
    <div className="flex-grow-0 d-flex flex-row align-items-center px-2">
      <div
        className="TrackContainer__kdot pr-3"
        tabIndex="0"
        role="button"
        aria-label="more"
        onKeyPress={() => contextMenuTrack(trackId)}
        onClick={() => contextMenuTrack(trackId)}
      >
        <Share />
      </div>
      <div>{ human(trackDuration) }</div>
    </div>
    {/* ./ context menu + time */}
  </TrackContainer>
);

Track.propTypes = {
  fullDetail: bool,
  playing: bool.isRequired,
  currentTrackId: string.isRequired,
  trackId: string.isRequired,
  trackNumber: number.isRequired,
  trackName: string.isRequired,
  trackFeaturing: arrayOf(shape({})).isRequired,
  trackAlbum: shape({}).isRequired,
  trackDuration: number.isRequired,
  trackPlayPause: func.isRequired,
  contextMenuTrack: func.isRequired,
};

Track.defaultProps = {
  fullDetail: true,
};

export default memo(Track, (previousProps, nextProps) => isEqual({
  fullDetail: previousProps.fullDetail,
  playing: previousProps.playing,
  currentTrackId: previousProps.currentTrackId,
  trackId: previousProps.trackId,
}, {
  fullDetail: nextProps.fullDetail,
  playing: nextProps.playing,
  currentTrackId: nextProps.currentTrackId,
  trackId: nextProps.trackId,
}));
