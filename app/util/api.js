/* global fetch */
/* eslint no-console: 0 */

/**
 * "wrapper" around fetch that makes sure all request that go out will be saved
 * through out the lifetime...still `N` 4:44 SICK BEAT!
 */

const API_CACHE = {};

module.exports = URL => new Promise((resolve, reject) => {
  if (Object.prototype.hasOwnProperty.call(API_CACHE, URL)) {
    console.log(`returning from cache [${URL}]`);
    resolve(Object.assign(Array.isArray(API_CACHE[URL]) ? [] : {}, API_CACHE[URL]));
    return;
  }

  console.log(`fetching for [${URL}]...`);
  fetch(URL)
    .then(response => response.json())
    .then((data) => {
      API_CACHE[URL] = data;
      console.log(`saved [${URL}] to cache`);
      resolve(Object.assign(Array.isArray(API_CACHE[URL]) ? [] : {}, API_CACHE[URL]));
    }, (err) => {
      reject(err);
    });
});
