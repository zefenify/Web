import { REPEAT } from '@app/redux/constant/repeat';

function repeat(payload) {
  return {
    type: REPEAT,
    payload,
  };
}

module.exports = {
  repeat,
};
