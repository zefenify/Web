import { REMAINING } from '@app/redux/constant/remaining';

function remaining(payload) {
  return {
    type: REMAINING,
    payload,
  };
}

export default {
  remaining,
};
