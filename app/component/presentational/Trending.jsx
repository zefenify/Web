import React from 'react';
import { arrayOf, shape, func, number, bool, string } from 'prop-types';
import { NavLink } from 'react-router-dom';
import styled from 'react-emotion';

import Song from '@app/component/presentational/Song';
import Divider from '@app/component/styled/Divider';
import Button from '@app/component/styled/Button';

const TrendingContainer = styled.div`
  .title {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    height: 60px;
    padding: 0 1em;
    box-shadow: 0 0 4px 2px ${props => props.theme.navBarBoxShadow};
  }

  .list {
    position: absolute;
    top: 60px;
    right: 0;
    bottom: 0;
    left: 0;
    overflow-y: auto;
    padding: 2em;
    padding-bottom: 0;
  }
`;

const TrendingListContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 0 0 auto;

  &.center-content {
    flex: 1 0 auto;
    justify-content: center;
    align-items: center;
  }

  .mute {
    color: ${props => props.theme.controlMute};
  }

  .trending {
    display: flex;
    flex-direction: column;
    flex: 0 0 auto;
    margin-bottom: 1em;

    &__title {
      margin: 0;
      margin-bottom: -0.15em;
    }

    &__info {
      color: ${props => props.theme.controlMute};
    }

    &__button {
      width: 175px;
      margin-bottom: 1em;
    }
  }

  .song {
    flex: 1 1 auto;

    & > *:last-child {
      margin-bottom: 1px;
    }
  }
`;

const NavLinkStyled = styled(NavLink)`
  color: ${props => props.theme.navbarText};
  padding: 0 1em;
  font-size: 1.2em;
  font-weight: bold;
  text-decoration: none;
  border-bottom: 2px solid transparent;
  cursor: default;
  display: flex;
  flex-direction: column;
  justify-content: center;

  &:hover {
    color: ${props => props.theme.navbarTextActive};
  }

  &.active {
    color: ${props => props.theme.navbarTextActive};
    border-bottom: 2px solid ${props => props.theme.primary};
    background-color: ${props => props.theme.listBackgroundHover};
  }
`;

const Trending = ({
  trending,
  current,
  playing,
  duration,
  trendingPlayPause,
  trendingPlaying,
  songPlayPause,
  contextMenuSong,
  category,
}) => {
  if (trending === null) {
    // repeating block to avoid the ? : in the _actual_ render
    return (
      <TrendingContainer>
        <div className="title">
          <NavLinkStyled to="/trending/today">Today</NavLinkStyled>
          <NavLinkStyled to="/trending/yesterday">Yesterday</NavLinkStyled>
          <NavLinkStyled to="/trending/week">Week</NavLinkStyled>
          <NavLinkStyled to="/trending/popularity">All Time</NavLinkStyled>
        </div>
      </TrendingContainer>
    );
  }

  const { hours, minutes, seconds } = duration;
  // eslint-disable-next-line
  const trendingTitle = category === 'yesterday' ? 'Trending Yesterday' : category === 'today' ? 'Trending Today' : category === 'week' ? 'Trending This Week' : 'Popular Tracks of All Time';

  return (
    <TrendingContainer>
      <div className="title">
        <NavLinkStyled to="/trending/today">Today</NavLinkStyled>
        <NavLinkStyled to="/trending/yesterday">Yesterday</NavLinkStyled>
        <NavLinkStyled to="/trending/week">Week</NavLinkStyled>
        <NavLinkStyled to="/trending/popularity">All Time</NavLinkStyled>
      </div>

      <div className="list">
        <TrendingListContainer>
          <div className="trending">
            <h1 className="trending__title">{ trendingTitle }</h1>
            <p className="trending__info">{`${trending.length} song${trending.length > 1 ? 's' : ''}, ${hours > 0 ? `${hours} hr` : ''} ${minutes} min ${hours > 0 ? '' : `${seconds} sec`}`}</p>
            <Button className="trending__button" onClick={trendingPlayPause}>{`${(playing && trendingPlaying) ? 'PAUSE' : 'PLAY'}`}</Button>
          </div>

          <Divider />

          <div className="song">
            {
              trending.map((song, index) => (
                <Song
                  key={song.track_id}
                  currentSongId={current === null ? '' : current.track_id}
                  trackNumber={index + 1}
                  togglePlayPause={songPlayPause}
                  playing={playing && trendingPlaying}
                  songId={song.track_id}
                  songName={song.track_name}
                  songFeaturing={song.track_featuring}
                  songDuration={song.track_track.s3_meta.duration}
                  songAlbum={song.track_album}
                  contextMenuSong={contextMenuSong}
                />
              ))
            }
          </div>
        </TrendingListContainer>
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
    hours: number,
    minutes: number,
    seconds: number,
  }),
  trendingPlaying: bool,
  trendingPlayPause: func.isRequired,
  songPlayPause: func.isRequired,
  contextMenuSong: func.isRequired,
};

Trending.defaultProps = {
  category: 'yesterday',
  trending: null,
  current: null,
  playing: false,
  duration: {
    hours: 0,
    minutes: 0,
    seconds: 0,
  },
  trendingPlaying: false,
};

module.exports = Trending;
