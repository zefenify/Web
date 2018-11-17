import { SONG } from '@app/redux/constant/song';


function song(payload) {
  return {
    type: SONG,
    payload,
  };
}


export default {
  song,
};
