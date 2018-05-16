import styled from 'react-emotion';

const FixedHeaderList = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 70px);

  .header {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    display: flex;
    align-items: center;
    height: 60px;
    padding: 0 2em;
    box-shadow: 0 0 4px 2px ${props => props.theme.navBoxShadow__color};
  }

  .list {
    position: absolute;
    top: 60px;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    overflow-y: auto;
    padding: 1em 1em 0 1em;
    height: calc(100vh - 130px);
  }
`;

module.exports = FixedHeaderList;
