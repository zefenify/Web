// production
// const HEADER = 'Authorization';
// const BASE = 'https://zefenify.com/api/';
// const BASE_S3 = 'https://zefenify.com/api/@S3/';
// const BASE_SHARE = 'https://zefenify.com/';
// const FAUTH = 'https://zefenify.com/api/fauth/';
// const SEARCH = 'https://zefenify.com/api/search';
// const CACHE_AGE = 21600; // in seconds (6 hours)

// development
const HEADER = 'Authorization';
const BASE = 'http://api.zefenify.io/';
const BASE_S3 = 'http://api.zefenify.io/@S3/';
const BASE_SHARE = 'http://zefenify.io/';
const FAUTH = 'http://api.zefenify.io/fauth/';
const SEARCH = 'http://api.zefenify.io/search';
const CACHE_AGE = 0; // in seconds

module.exports = {
  HEADER,
  BASE,
  BASE_S3,
  BASE_SHARE,
  FAUTH,
  SEARCH,
  CACHE_AGE,
};
