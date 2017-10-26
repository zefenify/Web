import React from 'react';
import { func } from 'prop-types';
import styled from 'react-emotion';

const ContextMenuContainer = styled.div`
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  width: 250px;
  z-index: 999;
  overflow-y: scroll;
  background-color: ${props => props.theme.navbarBackground};
  color: ${props => props.theme.navbarText};
  box-shadow: -2px 0 2px 0 ${props => props.theme.navBarBoxShadow};
  transform: translateX(264px);
  transition: transform 250ms;

  display: flex;
  padding: 1em;
  flex-direction: column;

  .close-SVG-container {
    position: absolute;
    left: 1em;
    top: 1em;
  }
`;

const CloseSVG = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#ff6d5e"
    strokeWidth="1"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

const ContextMenu = ({ closeContextMenu }) => (
  <ContextMenuContainer id="context-menu-container">
    <div className="close-SVG-container" onClick={closeContextMenu}><CloseSVG /></div>
  </ContextMenuContainer>
);

ContextMenu.propTypes = {
  closeContextMenu: func.isRequired,
};

module.exports = ContextMenu;
