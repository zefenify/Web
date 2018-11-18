import { NOTIFICATION } from '@app/redux/constant/notification';


export function notification(payload) {
  return {
    type: NOTIFICATION,
    payload,
  };
}
