import React from 'react';
import { shape } from 'prop-types';
// import { connect } from 'react-redux';

import store from '@app/redux/store';
import Notification from '@app/component/presentational/Notification';

import { NOTIFICATION_OFF_REQUEST } from '@app/redux/constant/notification';
import { withContext } from '@app/component/context/context';

const close = () => {
  store.dispatch({
    type: NOTIFICATION_OFF_REQUEST,
  });
};

const NotificationContainer = ({ notification }) => (
  <Notification notification={notification} close={close} />
);

NotificationContainer.propTypes = {
  notification: shape({}),
};

NotificationContainer.defaultProps = {
  notification: null,
};

module.exports = withContext('notification')(NotificationContainer);
