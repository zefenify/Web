import styled from 'react-emotion';


// #context-overlay-container = [98, 100]
// #context-menu-container = 999
// #mobile = 1000
// #error = 9999
export const WolfColaContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  z-index: 99;
  opacity: 1;
  filter: blur(0px);
  transform: scale3d(1, 1, 1);
  transition: transform 256ms, filter 0ms, opacity 256ms;
  will-change: transform, filter, opacity;

  &.context-menu-active {
    opacity: 0.92;
    filter: blur(4px);
    transform: scale3d(0.96, 0.96, 1);
  }

  &.booting {
    opacity: 0;
    filter: blur(4px);
    transform: scale3d(0.96, 0.96, 1);
  }
`;


export const NavigationMainContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1 1 auto;
  height: 100vh - 90px; /* 90px control */
`;


export const NavigationContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 0 0 220px;
  width: 220px;
  background-color: ${props => props.theme.BACKGROUND_NAVIGATION};
  overflow-y: auto;

  .__brand {
    position: absolute;
    left: 0;
    right: 0;
    flex: 0 0 60px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    height: 60px;
    padding-left: 1rem;
    font-weight: bold;
    font-size: 1.2em;
    text-decoration: none;
    color: inherit;
    box-shadow: 0 0 4px 2px ${props => props.theme.SHADOW};

    &__image {
      width: 40px;
      height: 40px;
      margin-right: 0.75em;
    }

    &__text {
      color: ${props => props.theme.NATURAL_2};
    }
  }

  .__navigation {
    position: absolute;
    display: flex;
    flex-direction: column;
    top: 60px;
    right: 0;
    bottom: 0;
    left: 0;
    overflow-y: auto;
  }
`;


export const MainContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1 0 calc(100vw - 220px);
  height: calc(100vh - 90px);
  background-color: ${props => props.theme.BACKGROUND_MAIN};
  color: ${props => props.theme.NATURAL_2};
  overflow-y: auto;
  padding: 1em 2em;
  padding-bottom: 0;
  padding-top: 2em;
`;


export const ControlsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 90px;
  background-color: ${props => props.theme.BACKGROUND_CONTROL};
`;
