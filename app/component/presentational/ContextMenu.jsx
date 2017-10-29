import React from 'react';
import { func } from 'prop-types';
import styled from 'react-emotion';

import { CloseSVG } from '@app/component/presentational/SVG';

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

  &.context-menu-active {
    transform: translateX(0px);
  }

  display: flex;
  padding: 1em;
  flex-direction: column;

  .close-SVG-container {
    position: absolute;
    left: 1em;
    top: 1em;
  }
`;


ContextMenu.propTypes = {
  closeContextMenu: func.isRequired,
};

module.exports = ContextMenu;
