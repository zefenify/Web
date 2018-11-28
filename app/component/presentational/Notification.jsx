import React, { memo } from 'react';
import { func, shape } from 'prop-types';
import styled from 'react-emotion';
import isEqual from 'react-fast-compare';

import Close from '@app/component/svg/Close';
import { ClearButton } from '@app/component/styled/Button';


const NotificationContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  left: 220px;
  background-color: #4a89d3;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0.5em 1em;
  transform: translate3d(0, -128px, 0);
  transition: transform 500ms;

  .NotificationContainer__message {
    flex: 1 0 auto;
    color: hsl(0, 0%, 100%);
  }

  .NotificationContainer__close-button {
    width: 24px;
    height: 24px;
    flex: 0 0 auto;

    svg {
      stroke: hsl(0, 0%, 100%);
    }
  }

  &.active {
    transform: translate3d(0, 0, 0);
  }
`;


const Notification = ({
  notification,
  close,
}) => (
  <NotificationContainer id="notification-container">
    <div className="NotificationContainer__message">{ notification === null ? null : notification.message }</div>
    <ClearButton aria-label="close" className="NotificationContainer__close-button" onClick={close}><Close strokeWidth="1" /></ClearButton>
  </NotificationContainer>
);

Notification.propTypes = {
  notification: shape({}),
  close: func.isRequired,
};

Notification.defaultProps = {
  notification: null,
};

export default memo(Notification, (previousProps, nextProps) => isEqual({
  notification: previousProps.notification,
}, {
  notification: nextProps.notification,
}));
