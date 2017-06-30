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

// `Box` can be a Playlist, Album...
const BoxContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  .box {
    position: relative;
    flex: 0 0 25%;
    min-height: 25vh;
    padding: 0 1em;
    margin-bottom: 3em;
    display: flex;
    flex-direction: column;

    .box {
      &__img-container {
        position: relative;
        width: 100%;
        height: 225px;
        border: 1px solid rgba(51, 51, 51, 0.25);
        border-radius: 6px;

        .control-overlay {
          position: absolute;
          top: -1px;
          right: -1px;
          bottom: -1px;
          left: -1px;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: rgba(51, 51, 51, 0.75);
          border-radius: 6px;

          i {
            display: flex;
            justify-content: center;
            align-items: center;
            color: #fff;
            font-size: 80px;
            width: 80px;
            height: 80px;
          }
        }

        & .control-overlay {
          opacity: 0;
        }

        &:hover .control-overlay {
          opacity: 1;
        }
      }

      &__title {
        padding: 0;
        margin: 0;
        font-weight: bold;
        margin-top: 0.5em;
      }

      &__description {
        padding: 0;
        margin: 0;
        margin-top: 0.5em;
      }

      &__count {
        padding: 0;
        margin: 0;
        margin-top: 0.5em;
      }
    }

    &:active {
      transform: scale(0.95);
    }
  }
`;

module.exports = {
  WolfColaContainer,
  ControlsContainer,
  NavListContainer,
  NavContainer,
  ListContainer,

  BoxContainer,
};
