import React from 'react';
import { bool, func, string, arrayOf, shape } from 'prop-types';

import Playlist from '@app/component/presentational/Playlist';
import FixedHeaderList from '@app/component/styled/FixedHeaderList';

const Home = ({
  playing,
  featured,
  featuredPlayingId,
  featuredPlay,
}) => (
  <FixedHeaderList>
    <div className="header">
      <h2>Featured</h2>
    </div>

    <div className="list">
      {
        featured.map(f => (
          <Playlist
            key={f.playlist_id}
            playing={playing}
            play={featuredPlay}
            playingId={featuredPlayingId}
            type="featured"
            id={f.playlist_id}
            name={f.playlist_name}
            description={f.playlist_description}
            cover={f.playlist_cover}
            trackCount={f.playlist_track.length}
          />
        ))
      }
    </div>
  </FixedHeaderList>
);

Home.propTypes = {
  playing: bool,
  featured: arrayOf(shape({})),
  featuredPlayingId: string,
  featuredPlay: func.isRequired,
};

Home.defaultProps = {
  playing: false,
  featured: [],
  featuredPlayingId: '',
};

module.exports = Home;
