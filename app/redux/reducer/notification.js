import { NOTIFICATION } from '@app/redux/constant/notification';

function notification(state = null, action) {
  switch (action.type) {
    case NOTIFICATION:
      return action.payload;

    default:
      return state;
  }
}

module.exports = notification;
