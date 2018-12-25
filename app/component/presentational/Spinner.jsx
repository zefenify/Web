import React, { memo } from 'react';
import { bool } from 'prop-types';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/core';
import isEqual from 'react-fast-compare';


const bounce = keyframes`
  0%, 100% {
    transform: scale3d(0, 0, 0);
  } 50% {
    transform: scale3d(1, 1, 1);
  }
`;


const SpinnerContainer = styled.div`
  position: absolute;
  right: 0.5em;
  top: 18px;
  width: 24px;
  height: 24px;
  background-color: transparent;
  border: none;
  outline: none;

  &:not(.active):after {
    position: absolute;
    right: 0;
    width: 24px;
    height: 24px;
    color: ${props => props.theme.PRIMARY_4};
  }

  &.active .SpinnerContainer__double-bounce1,
  &.active .SpinnerContainer__double-bounce2 {
    position: absolute;
    right: 0;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: ${props => props.theme.PRIMARY_4};
    opacity: 0.6;
    animation: ${bounce} 2.0s infinite ease-in-out;
  }

  &.active .SpinnerContainer__double-bounce2 {
    animation-delay: -1.0s;
  }
`;


function Spinner({ loading }) {
  return (
    <SpinnerContainer className={loading ? 'active' : ''}>
      <div className="SpinnerContainer__double-bounce1" />
      <div className="SpinnerContainer__double-bounce2" />
    </SpinnerContainer>
  );
}

Spinner.propTypes = {
  loading: bool,
};

Spinner.defaultProps = {
  loading: false,
};

export default memo(Spinner, (previousProps, nextProps) => isEqual({
  loading: previousProps.loading,
}, {
  loading: nextProps.loading,
}));
