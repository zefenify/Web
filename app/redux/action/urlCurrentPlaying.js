import { URL_CURRENT_PLAYING } from '@app/redux/constant/urlCurrentPlaying';

function urlCurrentPlaying(payload) {
  return {
    type: URL_CURRENT_PLAYING,
    payload,
  };
}

module.exports = {
  urlCurrentPlaying,
};
