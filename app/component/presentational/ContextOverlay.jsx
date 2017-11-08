import React from 'react';
import { func } from 'prop-types';
import styled from 'react-emotion';

const ContextOverlayContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 98;
`;

const ContextOverlay = ({ closeContextMenu }) => <ContextOverlayContainer id="context-overlay-container" onClick={closeContextMenu} />;

ContextOverlay.propTypes = {
  closeContextMenu: func.isRequired,
};

module.exports = ContextOverlay;
