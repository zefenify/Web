import React from 'react';
import { func, shape } from 'prop-types';
import styled from 'react-emotion';

import Close from '@app/component/svg/Close';
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
  transform: translate3d(0, -128px, 0);
  transition: transform 500ms;
  will-change: transform;

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
    transform: translate3d(0, 0, 0);
  }
`;

const Notification = ({
  notification,
  close,
}) => (
  <NotificationContainer id="notification-container">
    <div className="message">{ notification === null ? null : notification.message }</div>
    <ClearButton className="close-button" onClick={close}><Close /></ClearButton>
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
