import React from 'react';
import { arrayOf, shape, bool, number, func } from 'prop-types';
import styled from 'emotion/react';

import Divider from '@app/component/styled/Divider';
import PlaylistHeader from '@app/component/presentational/PlaylistHeader';
import Song from '@app/component/presentational/Song';

const SurpriseWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;

  .song {
    flex: 1 1 auto;

    & > *:last-child {
      margin-bottom: 1px;
    }
  }
`;

const Surprise = ({
  playing,
  current,
  surpriseList,
  duration,
  playingSurprise,
  togglePlayPauseAll,
  togglePlayPauseSong,
}) => (
  <SurpriseWrapper>
    <PlaylistHeader
      {...surpriseList}
      duration={duration}
      playing={(playing && playingSurprise)}
      togglePlayPause={togglePlayPauseAll}
    />

    <Divider />

    <div className="song">
      {
        surpriseList.songs.map((song, index) => (
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
  </SurpriseWrapper>
);

Surprise.propTypes = {
  playing: bool,
  current: shape({}),
  surpriseList: arrayOf(shape({})),
  duration: shape({
    hours: number,
    minutes: number,
    seconds: number,
  }),
  playingSurprise: bool,
  togglePlayPauseAll: func.isRequired,
  togglePlayPauseSong: func.isRequired,
};

Surprise.defaultProps = {
  playing: false,
  current: null,
  surpriseList: [],
  duration: {
    hours: 0,
    minutes: 0,
    seconds: 0,
  },
  playingSurprise: false,
};

module.exports = Surprise;
