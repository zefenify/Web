const HEADER = 'Authorization';
const FAUTH = 'http://api.zefenify.io/fauth/';
const BASE = 'http://www.arifzefen.com';
const FEATURED_ALL = 'json/featured/all.json';
const SURPRISE_ME = 'json/curated/surpriseme.php';
const SEARCH = 'json/list/search.php';
const GENRE_BASE = 'http://www.arifzefen.com/json/list/';
const GENRE = [
  {
    title: 'Orthodox Mezmur',
    thumbnail: '/images/default/album_cover_120x120.png',
    data: 'orthodoxmezmur',
  },
  {
    title: 'Protestant Mezmur',
    thumbnail: '/json/imgs/artist_cover_388.png',
    data: 'protestantmezmur',
  },
  {
    title: 'Menzuma',
    thumbnail: '/images/default/album_cover_120x120.png',
    data: 'menzuma',
  },
  {
    title: 'Drama',
    thumbnail: '/json/imgs/album_cover_400.png',
    data: 'drama',
  },
  {
    title: 'Audio Books',
    thumbnail: '/json/imgs/album_cover_400.png',
    data: 'audiobooks',
  },
  {
    title: 'Instrumentals',
    thumbnail: '/json/imgs/album_cover_751.png',
    data: 'instrumentals',
  },
  {
    title: 'Azmari Sounds',
    thumbnail: '/images/default/album_cover_120x120.png',
    data: 'azmarisounds',
  },
  {
    title: 'Kids',
    thumbnail: '/images/default/album_cover_120x120.png',
    data: 'kids',
  },
  {
    title: 'Amahric',
    thumbnail: '/json/imgs/artist_cover_382.png',
    data: 'amahric',
  },
  {
    title: 'English',
    thumbnail: '/json/imgs/album_cover_1333.png',
    data: 'english',
  },
  {
    title: 'Guragegna',
    thumbnail: '/json/imgs/artist_cover_48.png',
    data: 'guragegna',
  },
  {
    title: 'Gaderegna',
    thumbnail: '/json/imgs/album_cover_2818.png',
    data: 'haderegna',
  },
  {
    title: 'Harari',
    thumbnail: '/images/default/album_cover_120x120.png',
    data: 'harari',
  },
  {
    title: 'Oromiffa',
    thumbnail: '/images/default/album_cover_120x120.png',
    data: 'oromiffa',
  },
  {
    title: 'Sudanese',
    thumbnail: '/json/imgs/album_cover_2794.png',
    data: 'sudanese',
  },
];
const ARIFLIST_BASE = 'http://www.arifzefen.com/json/curated/';
const ARIFLIST = [
  {
    title: 'Workout',
    thumbnail: '/images/default/album_cover_120x120.png',
    data: 'workout',
  },
  {
    title: 'Wedding Songs',
    thumbnail: '/json/imgs/album_cover_209.png',
    data: 'weddingsongs',
  },
  {
    title: 'Traditional',
    thumbnail: '/images/default/album_cover_120x120.png',
    data: 'traditional',
  },
  {
    title: 'Tizita',
    thumbnail: '/json/imgs/album_cover_158.png',
    data: 'tizita',
  },
  {
    title: 'Slow Jamz',
    thumbnail: '/json/imgs/album_cover_238.png',
    data: 'slowjamz',
  },
  {
    title: 'Reggae Fusion',
    thumbnail: '/json/imgs/album_cover_88.png',
    data: 'reggaefusion',
  },
  {
    title: 'Oldies',
    thumbnail: '/json/imgs/artist_cover_533.png',
    data: 'oldies',
  },
  {
    title: 'Ethio Jazz',
    thumbnail: '/json/imgs/album_cover_329.png',
    data: 'ethiojazz',
  },
  {
    title: 'Ethio Hip-Hop',
    thumbnail: '/json/imgs/artist_cover_1128.png',
    data: 'ethiohip-hop',
  },
  {
    title: 'Dance N Chifera',
    thumbnail: '/json/imgs/album_cover_209.png',
    data: 'dancenchifera',
  },
];

module.exports = {
  HEADER,
  BASE,
  FAUTH,
  FEATURED_ALL,
  SURPRISE_ME,
  SEARCH,
  GENRE_BASE,
  GENRE,
  ARIFLIST_BASE,
  ARIFLIST,
};
