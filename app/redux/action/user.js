import { USER } from '@app/redux/constant/user';


export function user(payload) {
  return {
    type: USER,
    payload,
  };
}
