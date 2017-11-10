import styled from 'react-emotion';

// #context-overlay-container = [98, 100]
// #context-menu-container = 999
// #mobile = 1000
const WolfColaContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  z-index: 99;
  opacity: 1;
  filter: blur(0px);
  transform: scale(1);
  transition: all 250ms;

  &.context-menu-active {
    opacity: 0.92;
    filter: blur(4px);
    transform: scale(0.92);
  }
`;

const ControlsContainer = styled.div`
  flex: 0 0 70px;
  background-color: ${props => props.theme.controlBackground};
  color: ${props => props.theme.controlText};
  display: flex;
  flex-direction: row;
`;

const NavListContainer = styled.div`
  flex: 1 0 auto;
  display: flex;
  flex-direction: row;
`;

const NavContainer = styled.div`
  position: relative;
  flex: 0 0 200px;
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

    & > img.brand-img {
      width: 40px;
      height: 40px;
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
`;

const RouteContainer = styled.div`
  position: relative;
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.listBackground};
  color: ${props => props.theme.listText};
  max-height: calc(100vh - 70px);
  max-width: calc(100vw - 200px);
  overflow-y: auto;
  padding: 1em 2em;
  padding-bottom: 0;
  padding-top: 2em;
`;

module.exports = {
  WolfColaContainer,
  ControlsContainer,
  NavListContainer,
  NavContainer,
  RouteContainer,
};
