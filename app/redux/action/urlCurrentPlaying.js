import { URL_CURRENT_PLAYING } from '@app/redux/constant/urlCurrentPlaying';


export function urlCurrentPlaying(payload) {
  return {
    type: URL_CURRENT_PLAYING,
    payload,
  };
}
