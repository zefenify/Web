import { URL_CURRENT_PLAYING } from '@app/redux/constant/urlCurrentPlaying';

function urlCurrentPlaying(state = null, action) {
  switch (action.type) {
    case URL_CURRENT_PLAYING:
      return action.payload;

    default:
      return state;
  }
}

module.exports = urlCurrentPlaying;
