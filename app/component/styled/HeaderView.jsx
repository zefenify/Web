import styled from 'react-emotion';


const HeaderView = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 90px); /* 90px control */

  .__header {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    display: flex;
    align-items: center;
    height: 60px;
    padding: 0 2rem;
    box-shadow: 0 0 4px 2px ${props => props.theme.SHADOW};
  }

  .__view {
    position: absolute;
    top: 60px;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    overflow-y: auto;
    padding: 1rem 1rem 0 1rem;
    height: calc(100vh - 150px); /* 60px top + 90px control */
  }
`;


export default HeaderView;
