import React from 'react';
import styled from 'react-emotion';
import { func } from 'prop-types';

import Button from '@app/component/styled/Button';

const Error = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9999;
  background-color: ${props => props.theme.background};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .broken-zefenify {
    opacity: 0.75;
    width: 125px;
    height: 125px;
    margin-bottom: 2rem;
    filter: grayscale(100%);
    transition: filter 1s;
    will-change: filter;

    &:hover {
      filter: grayscale(0%);
    }
  }

  .broken-record {
    font-size: 1.25rem;
    line-height: 1.5rem;
    margin-bottom: 2rem;
    padding: 0 1rem;
    text-align: center;
    color: ${props => props.theme.mute};
  }
`;

const ErrorBoundary = ({ hardRefresh }) => (
  <Error>
    <div className="broken-zefenify" style={{ background: "transparent url('static/image/zefenify.png') 50% 50% / cover no-repeat" }} />
    <div className="broken-record">ጉድ ፈላ!<br />Zefenify has stopped working.</div>
    <Button onClick={hardRefresh}>Refresh</Button>
  </Error>
);

ErrorBoundary.propTypes = {
  hardRefresh: func.isRequired,
};

module.exports = ErrorBoundary;
