import React from 'react';
import styled from 'react-emotion';
import { func } from 'prop-types';

const Button = styled.button`
  background-color: hsl(0, 0%, 10%);
  border-radius: 2em;
  border: none;
  padding: 0.75em 2em;
  color: hsl(0, 0%, 100%);
  transition: transform 250ms;
  will-change: transform;

  &:hover {
    transform: scale3d(1.05, 1.05, 1);
  }

  &:active {
    transform: scale3d(0.95, 0.95, 1);
  }
`;

const Error = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9999;
  background-color: hsl(0, 0%, 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .zefenify-broken {
    opacity: 0.75;
    width: 128px;
    height: 128px;
    margin-bottom: 2rem;
    filter: grayscale(100%);
    transition: filter 1s;
    will-change: filter;

    &:hover {
      filter: grayscale(0%);
    }
  }

  .zefenify-broken-message {
    font-size: 1.25rem;
    line-height: 1.5rem;
    margin-bottom: 2rem;
    padding: 0 1rem;
    text-align: center;
    color: hsl(0, 0%, 30%);
  }
`;

const ErrorBoundary = ({ hardRefresh }) => (
  <Error>
    <div className="zefenify-broken" style={{ background: "transparent url('static/image/zefenify.png') 50% 50% / cover no-repeat" }} />

    <div className="zefenify-broken-message">
      <span>ጉድ ፈላ!</span>
      <br />
      <span>Zefenify Has Stopped Working.</span>
      <br />
      <small>
        <i>
          <span>{ 'Now Let Us Click on Refresh like We Didn\'t See' }</span>
          <span role="img" aria-label="nut emoji">🥜</span>
          <span>n</span>
        </i>
      </small>
    </div>

    <Button type="button" onClick={hardRefresh}>REFRESH</Button>
  </Error>
);

ErrorBoundary.propTypes = {
  hardRefresh: func.isRequired,
};

export default ErrorBoundary;
