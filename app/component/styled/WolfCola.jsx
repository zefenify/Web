import styled from 'emotion/react';
import { withTheme } from 'theming';

const WolfColaContainer = withTheme(styled.div`
  ::-webkit-scrollbar {
    width: 4px;
  }

  ::-webkit-scrollbar-track {
    background-color: transparent;
    border-radius: 0;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 2px;
    background-color: ${props => props.theme.controlMute};
  }

  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
`);

const ControlsContainer = withTheme(styled.div`
  flex: 0 0 70px;
  background-color: ${props => props.theme.controlBackground};
  color: ${props => props.theme.controlText};
  display: flex;
  flex-direction: row;
`);

const NavListContainer = styled.div`
  flex: 1 0 auto;
  display: flex;
  flex-direction: row;
`;

const NavContainer = withTheme(styled.div`
  position: relative;
  flex: 0 0 220px;
  height: calc(100vh - 70px);
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.navbarBackground};
  color: ${props => props.theme.navbarText};
  overflow-y: auto;
  overflow-x: hidden;

  .brand {
    position: absolute;
    left: 0;
    right: 0;
    flex: 0 0 60px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    height: 60px;
    padding-left: 1.25em;
    font-weight: bold;
    font-size: 1.2em;
    text-decoration: none;
    color: inherit;
    box-shadow: 0 0 4px 2px ${props => props.theme.navBarBoxShadow};

    & > img.brand-image {
      width: 40px;
      height: 40px;
      border-radius: 3px;
      margin-right: 0.75em;
    }
  }

  .nav-list {
    position: absolute;
    display: flex;
    flex-direction: column;
    top: 60px;
    right: 0;
    bottom: 0;
    left: 0;
    overflow-y: auto;
  }

  .small-text {
    padding: 1em 0.5em;
    border-left: 1.25em solid transparent;
    font-size: 0.75em;
    margin-top: 2em;
    cursor: default;
  }
`);

const RouteContainer = withTheme(styled.div`
  position: relative;
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.listBackground};
  color: ${props => props.theme.listText};
  max-height: calc(100vh - 70px);
  overflow-y: auto;
  padding: 1em 2em;
  padding-bottom: 0;
  padding-top: 2em;
`);

module.exports = {
  WolfColaContainer,
  ControlsContainer,
  NavListContainer,
  NavContainer,
  RouteContainer,
};
