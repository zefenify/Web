import React from 'react';
import { func, number, string, bool, arrayOf, shape } from 'prop-types';
import styled from 'react-emotion';
import { Link } from 'react-router-dom';

import { human } from '@app/util/time';

import ArtistList from '@app/component/presentational/ArtistList';
import Share from '@app/component/svg/Share';

const PlayPause = ({ onClick, playing, className }) => (
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
    className={className}
  >
    {
      playing ?
        <g>
          <rect x="6" y="4" width="4" height="16" fill="currentColor" />
          <rect x="14" y="4" width="4" height="16" fill="currentColor" />
        </g>
        : <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />
    }
  </svg>
);

PlayPause.propTypes = {
  onClick: func.isRequired,
  playing: bool,
  className: string,
};

PlayPause.defaultProps = {
  playing: false,
  className: '',
};

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
  display: flex;
  flex-direction: row;
  width: 100%;
  border-bottom: 1px solid ${props => props.theme.divider};

  & > * {
    flex: 1 1 auto;
    padding: 0.8em 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  & a {
    text-decoration: none;
    color: inherit;

    &:hover {
      color: ${props => props.theme.primary};
    }
  }

  & .track-number-icon {
    position: relative;
    flex: 0 0 5%;
    padding-left: 0.5em;

    &__number {
      display: block;
    }

    &__icon {
      display: none;
      position: absolute;
      left: 0;
      top: 6px;
      width: 1em;
      font-size: 2em;
    }
  }

  &.full-detail .name {
    flex: 0 0 38%;
  }

  & .name {
    flex: 1 0 auto;

    &__featuring {
      color: ${props => props.theme.mute};
    }
  }

  & .artist-name {
    flex: 0 0 25%;
  }

  & .album-name {
    flex: 0 0 20%;
  }

  & .share {
    flex: 0 0 4%;
    padding: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  & .duration {
    padding-right: 0.5em;
    flex: 0 0 8%;
    text-align: right;
  }

  &.active {
    color: ${props => props.theme.primary};

    &.active_playing {
      & .track-number-icon__number {
        display: none;
      }

      &:hover .track-number-icon_volume {
        display: none !important;
      }
    }
  }

  &:hover {
    background-color: ${props => props.theme.hover};

    & .track-number-icon {
      &__number {
        display: none;
      }

      &__icon {
        display: block;
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
}) => {
  if (fullDetail === false) {
    return (
      <TrackContainer onContextMenu={(e) => { e.preventDefault(); contextMenuTrack(trackId); }} className={`${currentTrackId === trackId ? 'active' : ''} ${(currentTrackId === trackId && playing) ? 'active_playing' : ''}`} onDoubleClick={() => trackPlayPause(trackId)}>
        <div className="track-number-icon">
          <span className="track-number-icon__number">{ trackNumber }</span>
          <PlayPause
            className="track-number-icon__icon"
            playing={currentTrackId === trackId && playing}
            onClick={() => trackPlayPause(trackId)}
          />
          <Volume className="track-number-icon__icon track-number-icon_volume" style={{ display: `${(currentTrackId === trackId && playing) ? 'block' : 'none'}` }} />
        </div>
        <div className="name">
          <span>{ trackName }</span>
          {
            trackFeaturing.length > 0
              ? <span className="name__featuring"> - <ArtistList artists={trackFeaturing} /></span>
              : null
          }
        </div>
        <div className="share" onClick={() => contextMenuTrack(trackId)}><Share /></div>
        <div className="duration">{ human(trackDuration) }</div>
      </TrackContainer>
    );
  }

  return (
    <TrackContainer onContextMenu={(e) => { e.preventDefault(); contextMenuTrack(trackId); }} className={`full-detail ${currentTrackId === trackId ? 'active' : ''} ${(currentTrackId === trackId && playing) ? 'active_playing' : ''}`} onDoubleClick={() => trackPlayPause(trackId)}>
      <div className="track-number-icon">
        <span className="track-number-icon__number">{ trackNumber }</span>
        <PlayPause
          className="track-number-icon__icon"
          playing={currentTrackId === trackId && playing}
          onClick={() => trackPlayPause(trackId)}
        />
        <Volume className="track-number-icon__icon track-number-icon_volume" style={{ display: `${(currentTrackId === trackId && playing) ? 'block' : 'none'}` }} />
      </div>
      <div className="name">
        <span>{ trackName }</span>
        {
          trackFeaturing.length > 0
            ? <span className="name__featuring"> - <ArtistList artists={trackFeaturing} /></span>
            : null
        }
      </div>
      <ArtistList className="artist-name" artists={trackAlbum.album_artist} />
      <Link to={`/album/${trackAlbum.album_id}`} className="album-name">{ trackAlbum.album_name }</Link>
      <div className="share" onClick={() => contextMenuTrack(trackId)}><Share /></div>
      <div className="duration">{ human(trackDuration) }</div>
    </TrackContainer>
  );
};

Track.propTypes = {
  fullDetail: bool,
  currentTrackId: string.isRequired,
  trackId: string.isRequired,
  trackNumber: number.isRequired,
  trackName: string.isRequired,
  trackFeaturing: arrayOf(shape({})).isRequired,
  trackAlbum: shape({}).isRequired,
  trackDuration: number.isRequired,
  trackPlayPause: func.isRequired,
  contextMenuTrack: func.isRequired,
  playing: bool.isRequired,
};

Track.defaultProps = {
  fullDetail: true,
};

module.exports = Track;
