// Breaking SAGA! 😔
import axios from 'axios';
import notie from 'notie';
import cloneDeep from 'lodash/cloneDeep';

import { BASE, HEADER } from '@app/config/api';
import store from '@app/redux/store';
import { loading } from '@app/redux/action/loading';

axios.defaults.baseURL = BASE;

const API_CACHE = {};
let user = null; // to be used when sending header [JWT]

store.subscribe(() => {
  user = store.getState().user;
});

/**
 * sends a GET request
 *
 * @param  {String}   URL
 * @param  {Function} cancel
 * @param {Boolean} force - whether or not to bypass API_CACHE
 */
const api = (URL, cancel, force = false) => new Promise((resolve, reject) => {
  if (force === false && Object.prototype.hasOwnProperty.call(API_CACHE, URL) === true) {
    if (cancel !== undefined) {
      // calling with an empty function as no axios will be called...
      cancel(() => {});
    }

    resolve(cloneDeep(API_CACHE[URL]));
    return;
  }

  store.dispatch(loading(true));

  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  axios
    .get(URL, {
      cancelToken: source.token,
      headers: {
        [HEADER]: user === null ? undefined : user.jwt,
      },
    })
    .then((data) => {
      store.dispatch(loading(false));

      API_CACHE[URL] = data.data;
      resolve(cloneDeep(API_CACHE[URL]));
    }, (err) => {
      store.dispatch(loading(false));

      // request cancellation will not reject
      if (axios.isCancel(err)) {
        return;
      }

      if (err.message === 'Network Error') {
        notie.alert({
          type: 'error',
          text: 'ጭራሽ ጭጭ - Network',
          time: 5,
        });
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
const postPatch = method => (URL, data, cancel) => new Promise((resolve, reject) => {
  store.dispatch(loading(true));

  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  axios[method](URL, data, {
    cancelToken: source.token,
    headers: {
      [HEADER]: user === null ? undefined : user.jwt,
    },
  })
    .then((response) => {
      store.dispatch(loading(false));
      resolve(cloneDeep(response));
    }, (err) => {
      store.dispatch(loading(false));

      // request cancellation will not reject
      if (axios.isCancel(err)) {
        return;
      }

      if (err.message === 'Network Error') {
        notie.alert({
          type: 'error',
          text: 'ጭራሽ ጭጭ - Network',
          time: 5,
        });
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

module.exports = api;
