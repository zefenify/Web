import axios from 'axios';
import cloneDeep from 'lodash/fp/cloneDeep';

import { BASE, CACHE_AGE, HEADER } from '@app/config/api';
import { NOTIFICATION_ON_REQUEST } from '@app/redux/constant/notification';
import { loading } from '@app/redux/action/loading';

axios.defaults.baseURL = BASE;

const API_CACHE = {}; // caches GET requests { [URL]: response }
const API_CACHE_TIMESTAMP = {}; // { [URL]: addSeconds(new Date(), CACHE_AGE) }

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

    // validating cache...
    if (Date.now() < API_CACHE_TIMESTAMP[URL]) {
      resolve(cloneDeep(API_CACHE[URL]));

      return;
    }
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
    .then((axiosResponse) => {
      API_CACHE[URL] = axiosResponse.data;
      API_CACHE_TIMESTAMP[URL] = Date.now() + (CACHE_AGE * 1000);
      resolve(cloneDeep(API_CACHE[URL]));
    }, (axiosError) => {
      // request cancellation will not reject
      if (axios.isCancel(axiosError)) {
        return;
      }

      // request failed, returning from expired cache...
      if (Object.prototype.hasOwnProperty.call(API_CACHE, URL) === true) {
        resolve(cloneDeep(API_CACHE[URL]));
      } else {
        reject(axiosError);
      }
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
    .then((axiosResponse) => {
      resolve(cloneDeep(axiosResponse));
    }, (axiosError) => {
      // request cancellation will not reject
      if (axios.isCancel(axiosError)) {
        return;
      }

      reject(axiosError);
    });

  if (cancel !== undefined) {
    // passing the cancel token back...
    cancel(source.cancel);
  }
});


export const gql = (user, query = '', variables = {}, cancel, force = false) => new Promise((resolve, reject) => {
  const { CancelToken } = axios;
  const source = CancelToken.source();
  const cacheURL = JSON.stringify({ query, variables });

  if (force === false && Object.prototype.hasOwnProperty.call(API_CACHE, cacheURL) === true) {
    if (cancel !== undefined) {
      // calling with an empty function as no axios will be called...
      cancel(() => {});
    }

    // validating cache...
    if (Date.now() < API_CACHE_TIMESTAMP[cacheURL]) {
      resolve(cloneDeep(API_CACHE[cacheURL]));

      return;
    }
  }

  axios.post('graphql', { query, variables }, {
    cancelToken: source.token,
    headers: {
      [HEADER]: user === null ? undefined : user.jwt,
    },
  }).then(({ data }) => {
    API_CACHE[cacheURL] = data;
    API_CACHE_TIMESTAMP[cacheURL] = Date.now() + (CACHE_AGE * 1000);
    resolve(cloneDeep(API_CACHE[cacheURL]));
  }, (axiosError) => {
    // request cancellation will not reject
    if (axios.isCancel(axiosError)) {
      return;
    }

    reject(axiosError);
  });

  if (cancel !== undefined) {
    // passing the cancel token back...
    cancel(source.cancel);
  }
});


export const post = postPatch('post');


export const patch = postPatch('patch');


// this is a helper function, still doesn't break "pure-ity"
export const error = store => (axiosError) => {
  store.dispatch(loading(false));

  if (axiosError.message === 'Network Error') {
    store.dispatch({
      type: NOTIFICATION_ON_REQUEST,
      payload: {
        message: 'No Internet Connection. Please Try Again Later',
      },
    });

    return;
  }

  store.dispatch({
    type: NOTIFICATION_ON_REQUEST,
    payload: {
      message: 'ይቅርታ, Unable to Process Request. Please Try Again Later',
    },
  });
};


export default api;
