import random from 'lodash/random';

const seed = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const seedLength = seed.length - 1;

module.exports = (length = 16) => {
  let randomParam = '';

  for (let i = 0; i < length; i += 1) {
    randomParam += seed[random(0, seedLength)];
  }

  return randomParam;
};
