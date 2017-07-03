import { CROSSFADE } from '@app/redux/constant/crossfade';

function crossfade(state = 0, action) {
  switch (action.type) {
    case CROSSFADE:
      return action.payload;

    default:
      return state;
  }
}

module.exports = crossfade;
