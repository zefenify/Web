import React from 'react';
import { func, string, arrayOf, shape } from 'prop-types';
import styled from 'emotion/react';

import Box from '@app/component/presentational/Box';

const BoxListContainer = styled.div`
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

const BoxList = ({ type, box, boxPlayingData, boxPlay }) => (
  <BoxListContainer>
    <div className="title">
      <h2>Genre</h2>
    </div>

    <div className="list">
      {
        box.map(b => (
          <Box
            type={type}
            play={boxPlay}
            key={b.data}
            boxPlayingData={boxPlayingData}
            {...b}
          />
        ))
      }
    </div>
  </BoxListContainer>
);

BoxList.propTypes = {
  type: string,
  box: arrayOf(shape({})),
  boxPlayingData: string,
  boxPlay: func.isRequired,
};

BoxList.defaultProps = {
  type: '',
  box: [],
  boxPlayingData: '',
};

module.exports = BoxList;
