import React from 'react';
import { arrayOf, shape, bool, number, func } from 'prop-types';
import styled from 'emotion/react';

import Divider from '@app/component/styled/Divider';
import Song from '@app/component/presentational/Song';
import PlaylistHeader from '@app/component/presentational/PlaylistHeader';

const FeaturedWrapper = styled.div`
  display: flex;
  flex-direction: column;

  .song {
    flex: 1 0 auto;

    & > *:last-child {
      margin-bottom: 1px;
    }
  }
`;

const Featured = ({
  featured,
  current,
  playing,
  duration,
  playingFeatured,
  togglePlayPauseAll,
  togglePlayPauseSong,
}) => (
  <FeaturedWrapper>
    <PlaylistHeader
      {...featured}
      duration={duration}
      playlist={false}
      playing={(playing && playingFeatured)}
      togglePlayPause={togglePlayPauseAll}
    />

    <Divider />

    <div className="song">
      {
        featured.songs.map((song, index) => (
          <Song
            key={song.songId}
            currentSongId={current === null ? -1 : current.songId}
            trackNumber={index + 1}
            togglePlayPause={togglePlayPauseSong}
            playing={playing}
            {...song}
          />
        ))
      }
    </div>
  </FeaturedWrapper>
);

Featured.propTypes = {
  featured: arrayOf(shape({})),
  current: shape({}),
  playing: bool,
  duration: shape({
    hours: number,
    minutes: number,
    seconds: number,
  }),
  playingFeatured: bool,
  togglePlayPauseAll: func.isRequired,
  togglePlayPauseSong: func.isRequired,
};

Featured.defaultProps = {
  featured: null,
  current: null,
  playing: false,
  duration: {
    hours: 0,
    minutes: 0,
    seconds: 0,
  },
  playingFeatured: false,
};

module.exports = Featured;
