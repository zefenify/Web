import React from 'react';
import { func, shape } from 'prop-types';
import styled from 'react-emotion';

import { CONTEXT_SONG, CONTEXT_ALBUM, CONTEXT_ARTIST, CONTEXT_PLAYLIST, CONTEXT_UPLAYLIST } from '@app/redux/constant/contextMenu';
import { BASE_S3 } from '@app/config/api';

import DJKhaled from '@app/component/hoc/DJKhaled';
import { CloseSVG } from '@app/component/presentational/SVG';
import { ClearButton } from '@app/component/styled/Button';
import Divider from '@app/component/styled/Divider';

const ContextMenuContainer = styled.div`
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  width: 250px;
  z-index: 999;
  overflow-y: scroll;
  background-color: ${props => props.theme.navbarBackground};
  color: ${props => props.theme.navbarTextActive};
  box-shadow: -2px 0 2px 0 ${props => props.theme.navBarBoxShadow};
  transform: translateX(264px);
  transition: transform 250ms;

  &.context-menu-active {
    transform: translateX(0px);
  }

  display: flex;
  padding: 1em 0;
  padding-top: 64px;
  flex-direction: column;

  .close-SVG-container {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    padding-left: 1em;
    padding-top: 1em;

    svg {
      width: 32px;
      height: 32px;
    }
  }

  .link {
    flex: 0 0 auto;
    text-decoration: none;
    padding: 1em;
    color: ${props => props.theme.navbarText};

    &:not([disabled]):hover {
      background-color: ${props => props.theme.controlBackground};
      color: ${props => props.theme.navbarTextActive};
    }

    &[disabled] {
      color: ${props => props.theme.listDividerText};
    }
  }

  .song {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 1em;
    padding: 0 1em;
    flex: 0 0 auto;

    & > * {
      margin: 0;
    }

    &__album-image {
      width: 164px;
      height: 164px;
      border-radius: 6px;
      border: 1px solid ${props => props.theme.listDivider};
      margin-bottom: 0.75em;
    }

    &__name {
      font-size: 1.25em;
      margin-bottom: 0.25em;
    }

    &__album {
      color: ${props => props.theme.navbarText};
    }
  }
`;

const ContextMenu = ({
  contextMenu,
  user,
  song,
  closeContextMenu,
  history,
  songSave,
  songRemove,
}) => {
  if (contextMenu === null) {
    return (
      <ContextMenuContainer id="context-menu-container">
        <ClearButton className="close-SVG-container" onClick={closeContextMenu}>
          <CloseSVG />
        </ClearButton>
      </ContextMenuContainer>
    );
  }

  const { type, payload } = contextMenu;
  let songSaved = false;

  if (song !== null) {
    const savedTracks = song.data.song_track;
    const trackId = payload.track_id;
    songSaved = savedTracks.includes(trackId);
  }

  switch (type) {
    case CONTEXT_SONG:
      return (
        <ContextMenuContainer id="context-menu-container">
          <ClearButton className="close-SVG-container" onClick={closeContextMenu}>
            <CloseSVG />
          </ClearButton>

          <div className="song">
            <div className="song__album-image" style={{ background: `transparent url('${BASE_S3}${payload.track_album.album_cover.s3_name}') 50% 50% / cover no-repeat` }} />
            <p className="song__name">{ payload.track_name }</p>
            <p className="song__album">{ payload.track_album.album_name }</p>
          </div>

          <Divider padding="0 0 0 1em" fontSize="0.8em">Artist&nbsp;</Divider>
          <div className="artist">
            { payload.track_album.album_artist.map(artist => (<ClearButton className="link" disabled={`/artist/${artist.artist_id}` === history.location.pathname} onClick={() => { closeContextMenu(); history.push(`/artist/${artist.artist_id}`); }}>{ artist.artist_name }</ClearButton>)) }
            { payload.track_featuring.map(artist => (<ClearButton className="link" disabled={`/artist/${artist.artist_id}` === history.location.pathname} onClick={() => { closeContextMenu(); history.push(`/artist/${artist.artist_id}`); }}>{ artist.artist_name }</ClearButton>)) }
          </div>

          <Divider padding="0 0 0 1em" fontSize="0.8em">Album&nbsp;</Divider>
          <ClearButton className="link" disabled={`/album/${payload.track_album.album_id}` === history.location.pathname} onClick={() => { closeContextMenu(); history.push(`/album/${payload.track_album.album_id}`); }}>Go to Album</ClearButton>

          <Divider padding="0 0 0 1em" fontSize="0.8em">Your Library&nbsp;</Divider>
          {
            songSaved
              ? <ClearButton className="link" disabled={user === null} onClick={() => { closeContextMenu(); songRemove(payload); }}>Remove from Your Library</ClearButton>
              : <ClearButton className="link" disabled={user === null} onClick={() => { closeContextMenu(); songSave(payload); }}>Save to Your Library</ClearButton>
          }

          <Divider padding="0 0 0 1em" fontSize="0.8em">Share&nbsp;</Divider>
          <a onClick={closeContextMenu} href={`https://www.facebook.com/sharer.php?u=https://play.zefenify.com/album/${payload.track_album.album_id}/${payload.track_id}`} className="link" target="_blank">Facebook</a>
          <a onClick={closeContextMenu} href={`https://twitter.com/intent/tweet?url=https://play.zefenify.com/album/${payload.track_album.album_id}/${payload.track_id}&text=${payload.track_name}`} className="link" target="_blank">Twitter</a>
          <a onClick={closeContextMenu} href={`https://telegram.me/share/url?url=https://play.zefenify.com/album/${payload.track_album.album_id}/${payload.track_id}&text=${payload.track_name}`} className="link" target="_blank">Telegram</a>
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
  history: shape({}),
  closeContextMenu: func.isRequired,
  songSave: func.isRequired,
  songRemove: func.isRequired,
};

ContextMenu.defaultProps = {
  contextMenu: null,
  user: null,
  song: null,
  history: null,
};

module.exports = DJKhaled(ContextMenu);
