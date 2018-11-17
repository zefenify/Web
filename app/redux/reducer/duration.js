import { DURATION } from '@app/redux/constant/duration';


function duration(state = 0, action) {
  switch (action.type) {
    case DURATION:
      return action.payload;

    default:
      return state;
  }
}


export default duration;
