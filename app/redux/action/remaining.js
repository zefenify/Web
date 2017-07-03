import { REMAINING } from '@app/redux/constant/remaining';

function remaining(payload) {
  return {
    type: REMAINING,
    payload,
  };
}

module.exports = {
  remaining,
};
