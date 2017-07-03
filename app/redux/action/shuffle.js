import { SHUFFLE } from '@app/redux/constant/shuffle';

function shuffle(payload) {
  return {
    type: SHUFFLE,
    payload,
  };
}

module.exports = {
  shuffle,
};
