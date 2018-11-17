import localforage from 'localforage';

const config = {
  NAME: 'Zefenify',
  STORE_NAME: 'Zefenify',
  DESCRIPTION: 'Zefenify • Ethiopian. Music.',
  LOCALFORAGE_STORE: {
    THEME: 'THEME',
    VOLUME: 'VOLUME',
    REPEAT: 'REPEAT',
    SHUFFLE: 'SHUFFLE',
    CROSSFADE: 'CROSSFADE',
    REMAINING: 'REMAINING',
    USER: 'USER',
  },
};

localforage.config({
  name: config.NAME,
  storeName: config.STORE_NAME,
  description: config.DESCRIPTION,
});

export default config;
