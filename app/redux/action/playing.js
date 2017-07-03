import { PLAYING } from '@app/redux/constant/playing';

function playing(payload) {
  return {
    type: PLAYING,
    payload,
  };
}

module.exports = {
  playing,
};
