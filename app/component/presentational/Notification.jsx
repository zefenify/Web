import React from 'react';
import { func, shape } from 'prop-types';
import styled from 'react-emotion';

import { CloseSVG } from '@app/component/presentational/SVG';
import { ClearButton } from '@app/component/styled/Button';

const NotificationContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  left: 200px;
  background-color: #4a89d3;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0.5em 1em;
  transform: translateY(-64px);
  transition: transform 500ms;

  .message {
    flex: 1 0 auto;
    color: #ffffff;
  }

  .close-button {
    width: 24px;
    height: 24px;
    flex: 0 0 auto;

    svg {
      stroke: #ffffff;
    }
  }

  &.notification-active {
    transform: translateY(0px);
    transition: transform 500ms;
  }
`;

const Notification = ({ notification, close }) => (
  <NotificationContainer id="notification-container">
    <div className="message">{ notification === null ? null : notification.message }</div>
    <ClearButton className="close-button" onClick={close}><CloseSVG /></ClearButton>
  </NotificationContainer>
);

Notification.propTypes = {
  notification: shape({}),
  close: func.isRequired,
};

Notification.defaultProps = {
  notification: null,
};

module.exports = Notification;
