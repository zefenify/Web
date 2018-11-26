import React from 'react';
import {
  arrayOf,
  shape,
  func,
  number,
  bool,
  string,
} from 'prop-types';
import { NavLink } from 'react-router-dom';
import styled from 'react-emotion';

import Track from '@app/component/presentational/Track';
import Button from '@app/component/styled/Button';

const TrendingContainer = styled.div`
  .TrendingContainer {
    &__header {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      height: 60px;
      padding: 0 2em;
      box-shadow: 0 0 4px 2px ${props => props.theme.SHADOW};
    }

    &__view {
      position: absolute;
      top: 60px;
      right: 0;
      bottom: 0;
      left: 0;
      overflow-y: auto;
      padding: 1rem 2rem 0 2rem;
      padding-bottom: 0;
    }

    &__duration {
      color: ${props => props.theme.NATURAL_4};
    }
  }
`;


const NavLinkStyled = styled(NavLink)`
  color: ${props => props.theme.NATURAL_2};
  padding: 0 1rem;
  font-size: 1.2rem;
  font-weight: bold;
  text-decoration: none;
  border-bottom: 2px solid transparent;
  cursor: default;
  display: flex;
  flex-direction: column;
  justify-content: center;

  &:hover {
    color: ${props => props.theme.NATURAL_2};
  }

  &.active {
    color: ${props => props.theme.PRIMARY_4};
    border-bottom: 2px solid ${props => props.theme.PRIMARY_4};
    background-color: ${props => props.theme.NATURAL_7};
  }
`;


const Trending = ({
  trending,
  current,
  playing,
  duration,
  trendingPlayPause,
  trendingPlaying,
  trackPlayPause,
  contextMenuTrack,
  category,
}) => {
  if (trending === null) {
    // repeating block to avoid the ? : in the _actual_ render
    return (
      <TrendingContainer>
        <div className="TrendingContainer__header">
          <NavLinkStyled to="/trending/today">Today</NavLinkStyled>
          <NavLinkStyled to="/trending/yesterday">Yesterday</NavLinkStyled>
          <NavLinkStyled to="/trending/week">Week</NavLinkStyled>
          <NavLinkStyled to="/trending/popularity">All Time</NavLinkStyled>
        </div>
      </TrendingContainer>
    );
  }

  const { hour, minute, second } = duration;
  // eslint-disable-next-line
  const trendingTitle = category === 'yesterday' ? 'Trending Yesterday' : category === 'today' ? 'Trending Today' : category === 'week' ? 'Trending This Week' : 'Popular Tracks of All Time';

  return (
    <TrendingContainer>
      <div className="TrendingContainer__header">
        <NavLinkStyled to="/trending/today">Today</NavLinkStyled>
        <NavLinkStyled to="/trending/yesterday">Yesterday</NavLinkStyled>
        <NavLinkStyled to="/trending/week">Week</NavLinkStyled>
        <NavLinkStyled to="/trending/popularity">All Time</NavLinkStyled>
      </div>

      <div className="TrendingContainer__view">
        <div className="d-flex flex-column align-items-start mb-3">
          <h1 className="m-0 p-0 mt-3">{ trendingTitle }</h1>
          <p className="m-0 p-0 mt-2 TrendingContainer__duration">{`${trending.length} song${trending.length > 1 ? 's' : ''}, ${hour > 0 ? `${hour} hr` : ''} ${minute} min ${hour > 0 ? '' : `${second} sec`}`}</p>
          <Button className="mt-2" style={{ width: '125px' }} onClick={trendingPlayPause}>{`${(playing && trendingPlaying) ? 'PAUSE' : 'PLAY'}`}</Button>
        </div>

        {
          trending.map((track, index) => (
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
    </TrendingContainer>
  );
};

Trending.propTypes = {
  trending: arrayOf(shape({})),
  current: shape({}),
  playing: bool,
  category: string,
  duration: shape({
    hour: number,
    minute: number,
    second: number,
  }),
  trendingPlaying: bool,
  trendingPlayPause: func.isRequired,
  trackPlayPause: func.isRequired,
  contextMenuTrack: func.isRequired,
};

Trending.defaultProps = {
  category: 'yesterday',
  trending: null,
  current: null,
  playing: false,
  duration: {
    hour: 0,
    minute: 0,
    second: 0,
  },
  trendingPlaying: false,
};

export default Trending;
