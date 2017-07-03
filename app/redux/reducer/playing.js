import { PLAYING } from '@app/redux/constant/playing';

function playing(state = false, action) {
  switch (action.type) {
    case PLAYING:
      return action.payload;

    default:
      return state;
  }
}

module.exports = playing;
