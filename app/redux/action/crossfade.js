import { CROSSFADE } from '@app/redux/constant/crossfade';

function crossfade(payload) {
  return {
    type: CROSSFADE,
    payload,
  };
}

module.exports = {
  crossfade,
};
