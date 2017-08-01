// Breaking SAGA! 😔
import axios from 'axios';
import notie from 'notie';

import { BASE } from '@app/config/api';
import store from '@app/redux/store';
import { loading } from '@app/redux/action/loading';
import randomParam from '@app/util/randomParam';

axios.defaults.baseURL = BASE;

const API_CACHE = {};

module.exports = (URL, cancel) => new Promise((resolve, reject) => {
  if (Object.prototype.hasOwnProperty.call(API_CACHE, URL)) {
    if (cancel !== undefined) {
      // calling with an empty function as no axios will be called...
      cancel(() => {});
    }

    resolve(Object.assign(Array.isArray(API_CACHE[URL]) ? [] : {}, API_CACHE[URL]));
    return;
  }

  store.dispatch(loading(true));

  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  axios
    .get(`${URL}?${randomParam()}`, { cancelToken: source.token })
    .then((data) => {
      store.dispatch(loading(false));

      API_CACHE[URL] = data.data;
      resolve(Object.assign(Array.isArray(API_CACHE[URL]) ? [] : {}, API_CACHE[URL]));
    }, (err) => {
      store.dispatch(loading(false));

      // request cancellation will not reject
      if (axios.isCancel(err)) {
        return;
      }

      notie.alert({
        type: 'error',
        text: 'ጭራሽ ጭጭ - Network',
        time: 5,
      });

      reject(err);
    });

  if (cancel !== undefined) {
    // passing the cancel token back...
    cancel(source.cancel);
  }
});
