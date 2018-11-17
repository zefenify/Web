import { CURRENT } from '@app/redux/constant/current';


function current(payload) {
  return {
    type: CURRENT,
    payload,
  };
}


export default {
  current,
};
