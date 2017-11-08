import styled from 'react-emotion';

const FixedHeaderList = styled.div`
  display: flex;
  flex-direction: column;
  flex: 0 0 auto;
  ovefflow-y: auto;

  .title {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    box-shadow: 0 0 4px ${props => props.theme.listBoxShadow};
    height: 60px;
    padding: 0 2em;
    display: flex;
    align-items: center;
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
    padding: 1em 1em;
  }
`;

module.exports = FixedHeaderList;
