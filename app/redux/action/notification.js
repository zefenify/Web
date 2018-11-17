import { NOTIFICATION } from '@app/redux/constant/notification';

function notification(payload) {
  return {
    type: NOTIFICATION,
    payload,
  };
}

export default {
  notification,
};
