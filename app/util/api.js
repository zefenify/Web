import axios from 'axios';
import cloneDeep from 'lodash/cloneDeep';

import { BASE, HEADER } from '@app/config/api';
import { NOTIFICATION_ON_REQUEST } from '@app/redux/constant/notification';
import { loading } from '@app/redux/action/loading';

axios.defaults.baseURL = BASE;

const API_CACHE = {}; // caches GET requests { [URL]: response }

/**
 * sends a GET request
 *
 * @param {String} URL
 * @param {Object} user
 * @param {Function} cancel
 * @param {Boolean} force - whether or not to bypass API_CACHE
 */
const api = (URL, user = null, cancel, force = false) => new Promise((resolve, reject) => {
  if (force === false && Object.prototype.hasOwnProperty.call(API_CACHE, URL) === true) {
    if (cancel !== undefined) {
      // calling with an empty function as no axios will be called...
      cancel(() => {});
    }

    resolve(cloneDeep(API_CACHE[URL]));
    return;
  }

  const { CancelToken } = axios;
  const source = CancelToken.source();

  axios
    .get(URL, {
      cancelToken: source.token,
      headers: {
        [HEADER]: user === null ? undefined : user.jwt,
      },
    })
    .then((data) => {
      API_CACHE[URL] = data.data;
      resolve(cloneDeep(API_CACHE[URL]));
    }, (err) => {
      // request cancellation will not reject
      if (axios.isCancel(err)) {
        return;
      }

      reject(err);
    });

  if (cancel !== undefined) {
    // passing the cancel token back...
    cancel(source.cancel);
  }
});

/**
 * sends a [method] request to the API with header
 *
 * @param  {String}   URL
 * @param  {Object}   data
 * @param  {Function} cancel
 */
const postPatch = method => (URL, user = null, data, cancel) => new Promise((resolve, reject) => {
  const { CancelToken } = axios;
  const source = CancelToken.source();

  axios[method](URL, data, {
    cancelToken: source.token,
    headers: {
      [HEADER]: user === null ? undefined : user.jwt,
    },
  })
    .then((response) => {
      resolve(cloneDeep(response));
    }, (err) => {
      // request cancellation will not reject
      if (axios.isCancel(err)) {
        return;
      }

      reject(err);
    });

  if (cancel !== undefined) {
    // passing the cancel token back...
    cancel(source.cancel);
  }
});

api.save = postPatch('post');

api.patch = postPatch('patch');

// this is a helper function, still doesn't break "pure-ity"
api.error = store => (error) => {
  store.dispatch(loading(false));

  if (error.message === 'Network Error') {
    store.dispatch({
      type: NOTIFICATION_ON_REQUEST,
      payload: {
        message: 'No Internet connection. Please try again later',
      },
    });

    return;
  }

  store.dispatch({
    type: NOTIFICATION_ON_REQUEST,
    payload: {
      message: 'ይቅርታ, Unable to fetch data. Please try again later',
    },
  });
};

module.exports = api;
