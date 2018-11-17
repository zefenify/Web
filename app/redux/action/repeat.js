import { REPEAT } from '@app/redux/constant/repeat';


function repeat(payload) {
  return {
    type: REPEAT,
    payload,
  };
}


export default {
  repeat,
};
