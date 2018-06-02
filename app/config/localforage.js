import localforage from 'localforage';

const config = {
  NAME: 'Zefenify',
  STORE_NAME: 'Zefenify',
  DESCRIPTION: 'Zefenify • Ethiopian. Music.',
  LF_STORE: {
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

module.exports = config;
