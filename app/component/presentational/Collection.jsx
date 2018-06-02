import React from 'react';
import { Link } from 'react-router-dom';
import { func, string, bool, oneOfType, arrayOf, shape } from 'prop-types';
import styled from 'react-emotion';

import { BASE_S3 } from '@app/config/api';
import ImageContainer from '@app/component/styled/ImageContainer';
import FixedHeaderList from '@app/component/styled/FixedHeaderList';
import Playlist from '@app/component/presentational/Playlist';

const CollectionContainer = styled(Link)`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 0 0 25%;
  padding: 0 1em;
  margin-bottom: 3em;
  text-decoration: none;
  color: inherit;
  transition: transform 128ms;
  will-change: transform;

  &.active {
    color: ${props => props.theme.primary};

    .collection-name {
      color: ${props => props.theme.primary};
    }
  }

  &:not(.active) {
    svg {
      color: #fff !important;
    }
  }

  @media(min-width: 1282px) {
    flex: 0 0 20%;
  }

  .collection-name {
    padding: 0;
    margin: 0;
    line-height: 125%;
    font-size: 1.25em;
    font-weight: bold;
    margin-top: 0.5em;
  }

  .collection-playlist-count {
    padding: 0;
    margin: 0;
    margin-top: 0.5em;
    color: ${props => props.theme.mute};
  }

  &:active {
    transform: scale3d(0.95, 0.95, 1);
  }
`;

const Collection = ({
  playing,
  collectionId,
  collection,
  playlistPlay,
  collectionName,
  playlistPlayingId,
}) => {
  if (collection === null) {
    return null;
  }

  // collection list...
  if (collectionId === '') {
    return (
      <FixedHeaderList>
        <div className="title">
          <h2>{ collectionName }</h2>
        </div>

        <div className="list">
          {
            collection.map(c => (
              <CollectionContainer key={c.collection_id} to={`/collection/${c.collection_id}`}>
                <ImageContainer>
                  <img alt={c.collection_name} src={`${BASE_S3}${c.collection_cover.s3_name}`} />
                </ImageContainer>

                <strong className="collection-name">{ c.collection_name }</strong>
                <small className="collection-playlist-count">{`${c.collection_playlist.length} PLAYLIST${c.collection_playlist.length > 1 ? 'S' : ''}`}</small>
              </CollectionContainer>
            ))
          }

        </div>
      </FixedHeaderList>
    );
  }

  return (
    <FixedHeaderList>
      <div className="title">
        <h2>{ collectionName }</h2>
      </div>

      <div className="list">
        {
          collection.collection_playlist.map(p => (
            <Playlist
              key={p.playlist_id}
              playing={playing}
              play={playlistPlay}
              playingId={playlistPlayingId}
              type="playlist"
              id={p.playlist_id}
              name={p.playlist_name}
              description={p.playlist_description}
              cover={p.playlist_cover}
              trackCount={p.playlist_track.length}
            />
          ))
        }
      </div>
    </FixedHeaderList>
  );
};

Collection.propTypes = {
  playing: bool,
  collectionId: string,
  collection: oneOfType([shape({}), arrayOf(shape({}))]),
  playlistPlay: func.isRequired,
  collectionName: string,
  playlistPlayingId: string,
};

Collection.defaultProps = {
  playing: false,
  collection: null,
  collectionId: '',
  collectionName: 'Genre and Moods',
  playlistPlayingId: '',
};

module.exports = Collection;
