/* global fetch */
/* eslint no-console: 0 */

/**
 * "wrapper" around fetch that makes sure all request that go out will be saved
 * through out the lifetime...still `N` 4:44 SICK BEAT!
 */

// Breaking SAGA! 😔
import store from '@app/redux/store';
import { loading } from '@app/redux/action/loading';

const API_CACHE = {};

module.exports = URL => new Promise((resolve, reject) => {
  if (Object.prototype.hasOwnProperty.call(API_CACHE, URL)) {
    resolve(Object.assign(Array.isArray(API_CACHE[URL]) ? [] : {}, API_CACHE[URL]));
    return;
  }

  store.dispatch(loading(true));
  fetch(URL)
    .then(response => response.json())
    .then((data) => {
      store.dispatch(loading(false));
      API_CACHE[URL] = data;
      resolve(Object.assign(Array.isArray(API_CACHE[URL]) ? [] : {}, API_CACHE[URL]));
    }, (err) => {
      store.dispatch(loading(false));
      reject(err);
    });
});
