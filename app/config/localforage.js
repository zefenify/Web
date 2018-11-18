import localforage from 'localforage';

export const NAME = 'Zefenify';
export const STORE_NAME = 'Zefenify';
export const DESCRIPTION = 'Zefenify • Ethiopian. Music.';
export const LOCALFORAGE_STORE = {
  THEME: 'THEME',
  VOLUME: 'VOLUME',
  REPEAT: 'REPEAT',
  SHUFFLE: 'SHUFFLE',
  CROSSFADE: 'CROSSFADE',
  REMAINING: 'REMAINING',
  USER: 'USER',
};

localforage.config({
  name: NAME,
  storeName: STORE_NAME,
  description: DESCRIPTION,
});
