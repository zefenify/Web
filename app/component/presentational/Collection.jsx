import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import {
  func,
  string,
  bool,
  oneOfType,
  arrayOf,
  shape,
} from 'prop-types';
import styled from '@emotion/styled';
import isEqual from 'react-fast-compare';

import { BASE_S3 } from '@app/config/api';
import ImageContainer from '@app/component/styled/ImageContainer';
import HeaderView from '@app/component/styled/HeaderView';
import Playlist from '@app/component/presentational/Playlist';


const CollectionContainer = styled(Link)`
  flex: 0 0 25%;
  text-decoration: none;
  color: inherit;
  transition: transform 128ms;

  .CollectionContainer__name {
    font-size: 1.25em;
    font-weight: bold;
    color: ${props => props.theme.NATURAL_2};
  }

  .CollectionContainer__count {
    color: ${props => props.theme.NATURAL_4};
  }

  @media(min-width: 1282px) {
    flex: 0 0 20%;
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
      <HeaderView>
        <div className="__header">
          <h1>{ collectionName }</h1>
        </div>

        <div className="__view">
          {
            collection.map(_collection => (
              <CollectionContainer className="d-flex flex-column flex-grow-0 py-0 px-3 mb-4" key={_collection.id} to={`/collection/${_collection.id}`}>
                <ImageContainer>
                  <img alt={_collection.name} src={`${BASE_S3}${_collection.cover.name}`} />
                </ImageContainer>

                <strong className="m-0 p-0 mt-2 CollectionContainer__name">{ _collection.name }</strong>
                <small className="m-0 p-0 mt-1 CollectionContainer__count">{`${_collection.playlist.length} PLAYLIST${_collection.playlist.length > 1 ? 'S' : ''}`}</small>
              </CollectionContainer>
            ))
          }

        </div>
      </HeaderView>
    );
  }

  return (
    <HeaderView>
      <div className="__header">
        <h1>{ collectionName }</h1>
      </div>

      <div className="__view">
        {
          collection.playlist.map(playlist => (
            <Playlist
              type="playlist"
              key={playlist.id}
              playing={playing && playlistPlayingId === playlist.id}
              active={playlistPlayingId === playlist.id}
              play={playlistPlay}
              playingId={playlistPlayingId}
              id={playlist.id}
              name={playlist.name}
              description={playlist.description}
              cover={playlist.cover}
              trackCount={playlist.track.length}
            />
          ))
        }
      </div>
    </HeaderView>
  );
};

Collection.propTypes = {
  collectionName: string,
  playlistPlayingId: string,
  playing: bool,
  collectionId: string,
  collection: oneOfType([shape({}), arrayOf(shape({}))]),
  playlistPlay: func.isRequired,
};

Collection.defaultProps = {
  playing: false,
  collection: null,
  collectionId: '',
  collectionName: 'Genre and Moods',
  playlistPlayingId: '',
};

export default memo(Collection, (previousProps, nextProps) => isEqual({
  collectionName: previousProps.collectionName,
  playlistPlayingId: previousProps.playlistPlayingId,
  playing: previousProps.playing,
  collectionId: previousProps.collectionId,
  collection: previousProps.collection,
}, {
  collectionName: nextProps.collectionName,
  playlistPlayingId: nextProps.playlistPlayingId,
  playing: nextProps.playing,
  collectionId: nextProps.collectionId,
  collection: nextProps.collection,
}));
