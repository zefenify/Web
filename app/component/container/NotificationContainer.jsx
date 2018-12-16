import React, { useContext } from 'react';

import { NOTIFICATION_OFF_REQUEST } from '@app/redux/constant/notification';
import store from '@app/redux/store';
import Notification from '@app/component/presentational/Notification';
import { Context } from '@app/component/context/context';


const close = () => {
  store.dispatch({
    type: NOTIFICATION_OFF_REQUEST,
  });
};


const NotificationContainer = () => {
  const { notification } = useContext(Context);

  return (
    <Notification notification={notification} close={close} />
  );
};


export default NotificationContainer;
