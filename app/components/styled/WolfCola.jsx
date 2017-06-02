import styled from 'styled-components';

const WolfColaContainer = styled.div`
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
  background-color: ${props => props.theme.background};
  display: flex;
  flex-direction: row;
`;

const NavListContainer = styled.div`
  flex: 1 0 auto;
  display: flex;
  flex-direction: row;
  background-color: ${props => props.theme.background};
`;

const NavContainer = styled.div`
  flex: 0 0 200px;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.background};
`;

const ListContainer = styled.div`
  flex: 1 0 80%;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.background};
`;

module.exports = {
  WolfColaContainer,
  ControlsContainer,
  NavListContainer,
  NavContainer,
  ListContainer,
};
