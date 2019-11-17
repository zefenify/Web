import React, { memo } from 'react';
import {
  bool,
  func,
  string,
  arrayOf,
  shape,
} from 'prop-types';
import isEqual from 'react-fast-compare';

import Playlist from '@app/component/presentational/Playlist';
import HeaderView from '@app/component/styled/HeaderView';


const Home = ({
  playing,
  featured,
  featuredPlayingId,
  featuredPlay,
}) => (
  <HeaderView>
    <div className="__header">
      <h1 className="m-0">Featured</h1>
    </div>

    <div className="__view">
      {
        featured.map(_featured => (
          <Playlist
            type="featured"
            key={_featured.id}
            id={_featured.id}
            playing={playing && featuredPlayingId === _featured.id}
            active={featuredPlayingId === _featured.id}
            play={featuredPlay}
            name={_featured.name}
            description={_featured.description}
            cover={_featured.cover}
            trackCount={_featured.track.length}
          />
        ))
      }
    </div>
  </HeaderView>
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

export default memo(Home, (previousProps, nextProps) => isEqual({
  playing: previousProps.playing,
  featured: previousProps.featured,
  featuredPlayingId: previousProps.featuredPlayingId,
}, {
  playing: nextProps.playing,
  featured: nextProps.featured,
  featuredPlayingId: nextProps.featuredPlayingId,
}));
