import React from 'react';
import { func, number, arrayOf, shape } from 'prop-types';

import DJKhaled from '@app/component/hoc/DJKhaled';
import Playlist from '@app/component/presentational/Playlist';
import FixedHeaderList from '@app/component/styled/FixedHeaderList';

const Home = ({ featured, featuredPlayingId, playFeatured }) => (
  <FixedHeaderList>
    <div className="title">
      <h2>Featured</h2>
    </div>

    <div className="list">
      {
        featured.map(f => (
          <Playlist
            key={f.playlist_id}
            play={playFeatured}
            playingId={featuredPlayingId}
            type="featured"
            id={f.playlist_id}
            name={f.playlist_name}
            description={f.playlist_description}
            cover={f.playlist_cover}
            songCount={f.playlist_track.length}
          />
        ))
      }
    </div>
  </FixedHeaderList>
);

Home.propTypes = {
  featured: arrayOf(shape({})),
  featuredPlayingId: number,
  playFeatured: func.isRequired,
};

Home.defaultProps = {
  featured: [],
  featuredPlayingId: -1,
};

module.exports = DJKhaled(Home);
