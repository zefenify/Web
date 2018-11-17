import { VOLUME } from '@app/redux/constant/volume';

function volume(payload) {
  return {
    type: VOLUME,
    payload,
  };
}

export default {
  volume,
};
