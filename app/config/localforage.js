import localforage from 'localforage';

const config = {
  NAME: 'Wolf-Cola',
  STORE_NAME: 'WOLF_COLA',
  DESCRIPTION: 'Wolf Cola: The right music player for closure',
  LF_STORE: {
    THEME: 'THEME',
    VOLUME: 'VOLUME',
    REPEAT: 'REPEAT',
    SHUFFLE: 'SHUFFLE',
  },
};

localforage.config({
  name: config.NAME,
  storeName: config.STORE_NAME,
  description: config.DESCRIPTION,
});

module.exports = config;
