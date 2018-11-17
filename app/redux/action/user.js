import { USER } from '@app/redux/constant/user';


function user(payload) {
  return {
    type: USER,
    payload,
  };
}


export default {
  user,
};
