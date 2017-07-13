import styled from 'emotion/react';

const WolfColaContainer = styled.div`
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
  flex: 0 0 220px;
  height: calc(100vh - 70px);
  padding-bottom: 1em;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.navbarBackground};
  color: ${props => props.theme.navbarText};
  overflow-y: scroll;
  overflow-x: hidden;
`;

const ListContainer = styled.div`
  position: relative;
  flex: 1 1 80%;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.listBackground};
  color: ${props => props.theme.listText};
  max-height: calc(100vh - 70px);
  overflow-y: scroll;
`;

module.exports = {
  WolfColaContainer,
  ControlsContainer,
  NavListContainer,
  NavContainer,
  ListContainer,
};
