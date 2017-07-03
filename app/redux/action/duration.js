import { DURATION } from '@app/redux/constant/duration';

function duration(payload) {
  return {
    type: DURATION,
    payload,
  };
}

module.exports = {
  duration,
};
