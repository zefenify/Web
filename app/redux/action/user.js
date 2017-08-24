import { USER } from '@app/redux/constant/user';

function user(payload) {
  return {
    type: USER,
    payload,
  };
}

module.exports = {
  user,
};
