import { CURRENT } from '@app/redux/constant/current';

function current(payload) {
  return {
    type: CURRENT,
    payload,
  };
}

module.exports = {
  current,
};
