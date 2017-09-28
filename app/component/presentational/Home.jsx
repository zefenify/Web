import React from 'react';
import { func, number, arrayOf, shape } from 'prop-types';
import styled from 'react-emotion';
import { withTheme } from 'theming';

import Playlist from '@app/component/presentational/Playlist';

const HomeContainer = withTheme(styled.div`
  display: flex;
  flex-direction: column;
  flex: 0 0 auto;
  ovefflow-y: auto;

  .title {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    box-shadow: 0 0 4px ${props => props.theme.listBoxShadow};
    height: 60px;
    padding: 0 2em;
  }

  .list {
    position: absolute;
    top: 60px;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    overflow-y: auto;
    padding: 1em 1em;
  }
`);

const Home = ({ featured, featuredPlayingId, playFeatured }) => (
  <HomeContainer>
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
  </HomeContainer>
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

module.exports = Home;
