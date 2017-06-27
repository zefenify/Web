/**
 * given a word checks whether or not it contains a Fidel or not
 *
 * @param {String} word
 * @return {Boolean}
 */
module.exports = (word = '') => /[\u1200-\u137C]/.test(word);
