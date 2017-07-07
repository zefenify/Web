import React from 'react';
import { bool } from 'prop-types';
import styled from 'styled-components';


// use of keyframe is causing super fast transitions - so keyframe moved to SASS `wolf-cola.scss`
const SpinnerContainer = styled.div`
  position: absolute;
  right: 0.5em;
  top: 8px;
  width: 32px;
  height: 32px;
  background-color: transparent;
  border: none;
  outline: none;

  &:not(.active):after {
    position: absolute;
    right: 0;
    width: 32px;
    height: 32px;
    color: ${props => props.theme.primary};
  }

  &.active .double-bounce1,
  &.active .double-bounce2 {
    position: absolute;
    right: 0;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: ${props => props.theme.primary};
    opacity: 0.6;
    animation: bounce 2.0s infinite ease-in-out;
  }

  &.active .double-bounce2 {
    animation-delay: -1.0s;
  }
`;

function Spinner({ loading }) {
  return (
    <SpinnerContainer className={loading ? 'active' : ''}>
      <div className="double-bounce1" />
      <div className="double-bounce2" />
    </SpinnerContainer>
  );
}

Spinner.propTypes = {
  loading: bool,
};

Spinner.defaultProps = {
  loading: false,
};

module.exports = Spinner;
