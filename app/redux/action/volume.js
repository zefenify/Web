import { VOLUME } from '@app/redux/constant/volume';


export function volume(payload) {
  return {
    type: VOLUME,
    payload,
  };
}
