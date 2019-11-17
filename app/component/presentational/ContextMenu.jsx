import React, { memo } from 'react';
import { func, arrayOf, shape } from 'prop-types';
import styled from '@emotion/styled';
import isEqual from 'react-fast-compare';

import {
  CONTEXT_TRACK,
  CONTEXT_ALBUM,
  CONTEXT_ARTIST,
  CONTEXT_PLAYLIST,
} from '@app/redux/constant/contextMenu';
import { BASE_S3, BASE_SHARE } from '@app/config/api';
import Close from '@app/component/svg/Close';
import ImageContainer from '@app/component/styled/ImageContainer';
import { ClearButton } from '@app/component/styled/Button';


const ContextMenuContainer = styled.div`
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  width: 250px;
  z-index: 999;
  overflow-y: auto;
  color: ${props => props.theme.NATURAL_2};
  background-color: ${props => props.theme.BACKGROUND_NAVIGATION};
  box-shadow: -2px 0 2px 0 ${props => props.theme.SHADOW};
  transform: translate3d(264px, 0, 0);
  transition: transform 256ms;

  .ContextMenuContainer {
    &__image {
      flex: 0 0 200px;
      height: 200px;
      width: 200px;
    }

    &__title {
      color: ${props => props.theme.NATURAL_2};
    }

    &__link {
      text-decoration: none;
      color: ${props => props.theme.NATURAL_3};

      &:not([disabled]):hover {
        background-color: ${props => props.theme.NATURAL_7};
        color: ${props => props.theme.NATURAL_2};
      }

      &[disabled] {
        color: ${props => props.theme.NATURAL_5};
      }
    }

    &__small {
      font-size: 0.75rem;

      &--mute {
        color: ${props => props.theme.NATURAL_5};
      }
    }
  }

  svg {
    width: 32px;
    height: 32px;
    color: ${props => props.theme.PRIMARY_4};
  }

  &.context-menu-active {
    transform: translate3d(0, 0, 0);
  }
`;


const ContextMenu = ({
  contextMenu,
  user,
  song,
  queueNext,
  contextMenuClose,
  history,
  songSave,
  songRemove,
  queueNextAdd,
  queueNextRemove,
}) => {
  if (contextMenu === null) {
    return (
      <ContextMenuContainer id="context-menu-container">
        <ClearButton aria-label="close" className="close-SVG-container" onClick={contextMenuClose}>
          <Close />
        </ClearButton>
      </ContextMenuContainer>
    );
  }

  const { type, payload } = contextMenu;
  let trackSaved = false;
  let trackIndexInQueueNext = -1;

  if (song !== null && type === CONTEXT_TRACK) {
    const savedTracks = song.data.song_track;
    const trackId = payload.track_id;
    trackSaved = savedTracks.includes(trackId);
  }

  if (queueNext.length > 0 && type === CONTEXT_TRACK) {
    const queueNextTrackIds = queueNext.map(track => track.id);
    trackIndexInQueueNext = queueNextTrackIds.findIndex(trackId => trackId === payload.id);
  }

  switch (type) {
    case CONTEXT_TRACK:
      return (
        <ContextMenuContainer id="context-menu-container">
          <div className="d-flex flex-row justify-content-start align-items-center p-3">
            <ClearButton onClick={contextMenuClose} style={{ width: '32px', height: '32px' }}>
              <Close strokeWidth="1px" />
            </ClearButton>

            <h3 className="m-0 p-0 pl-2 ContextMenuContainer__title">TRACK</h3>
          </div>

          <div className="d-flex flex-column align-items-center flex-shrink-0">
            <ImageContainer className="ContextMenuContainer__image">
              <img src={`${BASE_S3}${payload.album.cover.name}`} alt={payload.album.name} />
            </ImageContainer>

            <h2 className="m-0 p-0 mt-2">{ payload.name }</h2>
          </div>

          <div className="d-flex flex-column flex-shrink-0 mt-3">
            <div className="ContextMenuContainer__small ContextMenuContainer__small--mute px-3">Artist</div>
            {
              payload.album.artist.map(artist => (
                <ClearButton
                  key={artist.id}
                  className="p-3 ContextMenuContainer__link"
                  disabled={`/artist/${artist.id}` === history.location.pathname}
                  onClick={() => { contextMenuClose(); history.push(`/artist/${artist.id}`); }}
                >
                  { artist.name }
                </ClearButton>
              ))
            }

            {
              payload.featuring.map(artist => (
                <ClearButton
                  key={artist.id}
                  className="p-3 ContextMenuContainer__link"
                  disabled={`/artist/${artist.id}` === history.location.pathname}
                  onClick={() => { contextMenuClose(); history.push(`/artist/${artist.id}`); }}
                >
                  { artist.name }
                </ClearButton>
              ))
            }
          </div>

          <div className="d-flex flex-column flex-shrink-0 mt-2">
            <div className="ContextMenuContainer__small ContextMenuContainer__small--mute px-3">Album</div>
            <ClearButton className="p-3 ContextMenuContainer__link" disabled={`/album/${payload.album.id}` === history.location.pathname} onClick={() => { contextMenuClose(); history.push(`/album/${payload.album.id}`); }}>Go to Album</ClearButton>
          </div>

          <div className="d-flex flex-column flex-shrink-0 mt-2">
            <div className="ContextMenuContainer__small ContextMenuContainer__small--mute px-3">Queue</div>
            {
              trackIndexInQueueNext === -1
                ? <ClearButton className="p-3 ContextMenuContainer__link" onClick={() => { contextMenuClose(); queueNextAdd(payload); }}>Add to Queue</ClearButton>
                : <ClearButton className="p-3 ContextMenuContainer__link" onClick={() => { contextMenuClose(); queueNextRemove(trackIndexInQueueNext); }}>Remove from Queue</ClearButton>
            }
          </div>

          <div className="d-flex flex-column flex-shrink-0 mt-2">
            <div className="ContextMenuContainer__small ContextMenuContainer__small--mute px-3">Your Library</div>
            {
              trackSaved
                ? <ClearButton className="p-3 ContextMenuContainer__link" disabled={user === null} onClick={() => { contextMenuClose(); songRemove(payload); }}>Remove from Your Library</ClearButton>
                : <ClearButton className="p-3 ContextMenuContainer__link" disabled={user === null} onClick={() => { contextMenuClose(); songSave(payload); }}>Save to Your Library</ClearButton>
            }
          </div>

          <div className="d-flex flex-column flex-shrink-0 mt-2">
            <div className="ContextMenuContainer__small ContextMenuContainer__small--mute px-3">Share</div>
            <a onClick={contextMenuClose} href={`https://www.facebook.com/sharer.php?u=${BASE_SHARE}album/${payload.album.id}/${payload.id}`} className="p-3 ContextMenuContainer__link" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a onClick={contextMenuClose} href={`https://twitter.com/intent/tweet?url=${BASE_SHARE}album/${payload.album.id}/${payload.id}&text=${payload.name}`} className="p-3 ContextMenuContainer__link" target="_blank" rel="noopener noreferrer">Twitter</a>
            <a onClick={contextMenuClose} href={`https://telegram.me/share/url?url=${BASE_SHARE}album/${payload.album.id}/${payload.id}&text=${payload.name}`} className="p-3 ContextMenuContainer__link" target="_blank" rel="noopener noreferrer">Telegram</a>
          </div>
        </ContextMenuContainer>
      );

    case CONTEXT_ALBUM:
      return (
        <ContextMenuContainer id="context-menu-container">
          <div className="d-flex flex-row justify-content-start align-items-center p-3">
            <ClearButton onClick={contextMenuClose} style={{ width: '32px', height: '32px' }}>
              <Close strokeWidth="1px" />
            </ClearButton>

            <h3 className="m-0 p-0 pl-2 ContextMenuContainer__title">ALBUM</h3>
          </div>

          <div className="d-flex flex-column align-items-center flex-shrink-0">
            <ImageContainer className="ContextMenuContainer__image">
              <img src={`${BASE_S3}${payload.cover.name}`} alt={payload.name} />
            </ImageContainer>

            <h2 className="m-0 p-0 mt-2">{ payload.name }</h2>
          </div>

          <div className="d-flex flex-column flex-shrink-0 mt-3">
            <div className="ContextMenuContainer__small ContextMenuContainer__small--mute px-3">Artist</div>
            {
              payload.artist.map(artist => (
                <ClearButton
                  key={artist.id}
                  className="p-3 ContextMenuContainer__link"
                  disabled={`/artist/${artist.id}` === history.location.pathname}
                  onClick={() => { contextMenuClose(); history.push(`/artist/${artist.id}`); }}
                >
                  { artist.name }
                </ClearButton>
              ))
            }
          </div>

          <div className="d-flex flex-column flex-shrink-0 mt-2">
            <div className="ContextMenuContainer__small ContextMenuContainer__small--mute px-3">Share</div>
            <a onClick={contextMenuClose} href={`https://www.facebook.com/sharer.php?u=${BASE_SHARE}album/${payload.id}`} className="p-3 ContextMenuContainer__link" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a onClick={contextMenuClose} href={`https://twitter.com/intent/tweet?url=${BASE_SHARE}album/${payload.id}&text=${payload.name}`} className="p-3 ContextMenuContainer__link" target="_blank" rel="noopener noreferrer">Twitter</a>
            <a onClick={contextMenuClose} href={`https://telegram.me/share/url?url=${BASE_SHARE}album/${payload.id}&text=${payload.name}`} className="p-3 ContextMenuContainer__link" target="_blank" rel="noopener noreferrer">Telegram</a>
          </div>
        </ContextMenuContainer>
      );

    case CONTEXT_ARTIST:
      return (
        <ContextMenuContainer id="context-menu-container">
          <div className="d-flex flex-row justify-content-start align-items-center p-3">
            <ClearButton onClick={contextMenuClose} style={{ width: '32px', height: '32px' }}>
              <Close strokeWidth="1px" />
            </ClearButton>

            <h3 className="m-0 p-0 pl-2 ContextMenuContainer__title">ARTIST</h3>
          </div>

          <div className="d-flex flex-column align-items-center flex-shrink-0">
            <ImageContainer borderRadius="50%" className="ContextMenuContainer__image">
              <img src={`${BASE_S3}${payload.cover.name}`} alt={payload.name} />
            </ImageContainer>

            <h2 className="m-0 p-0 mt-2">{ payload.name }</h2>
          </div>

          <div className="d-flex flex-column flex-shrink-0 mt-2">
            <div className="ContextMenuContainer__small ContextMenuContainer__small--mute px-3">Share</div>
            <a onClick={contextMenuClose} href={`https://www.facebook.com/sharer.php?u=${BASE_SHARE}artist/${payload.id}`} className="p-3 ContextMenuContainer__link" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a onClick={contextMenuClose} href={`https://twitter.com/intent/tweet?url=${BASE_SHARE}artist/${payload.id}&text=${payload.name}`} className="p-3 ContextMenuContainer__link" target="_blank" rel="noopener noreferrer">Twitter</a>
            <a onClick={contextMenuClose} href={`https://telegram.me/share/url?url=${BASE_SHARE}artist/${payload.id}&text=${payload.name}`} className="p-3 ContextMenuContainer__link" target="_blank" rel="noopener noreferrer">Telegram</a>
          </div>
        </ContextMenuContainer>
      );

    case CONTEXT_PLAYLIST:
      return (
        <ContextMenuContainer id="context-menu-container">
          <div className="d-flex flex-row justify-content-start align-items-center p-3">
            <ClearButton onClick={contextMenuClose} style={{ width: '32px', height: '32px' }}>
              <Close strokeWidth="1px" />
            </ClearButton>

            <h3 className="m-0 p-0 pl-2 ContextMenuContainer__title">PLAYLIST</h3>
          </div>

          <div className="d-flex flex-column align-items-center flex-shrink-0">
            <ImageContainer className="ContextMenuContainer__image">
              <img src={`${BASE_S3}${payload.cover.name}`} alt={payload.name} />
            </ImageContainer>

            <h2 className="m-0 p-0 mt-2">{ payload.name }</h2>
          </div>

          <div className="d-flex flex-column flex-shrink-0 mt-2">
            <div className="ContextMenuContainer__small ContextMenuContainer__small--mute px-3">Share</div>
            <a onClick={contextMenuClose} href={`https://www.facebook.com/sharer.php?u=${BASE_SHARE}playlist/${payload.id}`} className="p-3 ContextMenuContainer__link" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a onClick={contextMenuClose} href={`https://twitter.com/intent/tweet?url=${BASE_SHARE}playlist/${payload.id}&text=${payload.name}`} className="p-3 ContextMenuContainer__link" target="_blank" rel="noopener noreferrer">Twitter</a>
            <a onClick={contextMenuClose} href={`https://telegram.me/share/url?url=${BASE_SHARE}playlist/${payload.id}&text=${payload.name}`} className="p-3 ContextMenuContainer__link" target="_blank" rel="noopener noreferrer">Telegram</a>
          </div>
        </ContextMenuContainer>
      );

    default:
      return null;
  }
};

ContextMenu.propTypes = {
  contextMenu: shape({}),
  user: shape({}),
  song: shape({}),
  queueNext: arrayOf(shape({})),
  history: shape({}),
  contextMenuClose: func.isRequired,
  songSave: func.isRequired,
  songRemove: func.isRequired,
  queueNextAdd: func.isRequired,
  queueNextRemove: func.isRequired,
};

ContextMenu.defaultProps = {
  contextMenu: null,
  user: null,
  song: null,
  queueNext: [],
  history: null,
};

export default memo(ContextMenu, (previousProps, nextProps) => isEqual({
  contextMenu: previousProps.contextMenu,
  user: previousProps.user,
  song: previousProps.song,
  queueNext: previousProps.queueNext,
  history: previousProps.history,
}, {
  contextMenu: nextProps.contextMenu,
  user: nextProps.user,
  song: nextProps.song,
  queueNext: nextProps.queueNext,
  history: nextProps.history,
}));
