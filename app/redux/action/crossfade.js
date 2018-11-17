import { CROSSFADE } from '@app/redux/constant/crossfade';


function crossfade(payload) {
  return {
    type: CROSSFADE,
    payload,
  };
}


export default {
  crossfade,
};
