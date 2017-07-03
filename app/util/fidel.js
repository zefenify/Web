import compose from '@app/util/compose';

import { FIDEL_CLASS } from '@app/config/fidel';

/**
 * given a word checks whether or not it contains a Fidel or not
 *
 * @param {String} word
 * @return {Boolean}
 */
const containsFidel = (word = '') => /[\u1200-\u137C]/.test(word);

/**
 * curried function that returns an amharic class name to be used to override font
 * @param  {String} fClass
 * @return {Function}
 */
const fidelClassName = (fClass = '_am_') => (hasFidel = false) => hasFidel === true ? fClass : '';

module.exports = {
  containsFidel,
  fidelClassName: fidelClassName(FIDEL_CLASS),
  fidel: compose(fidelClassName(FIDEL_CLASS), containsFidel),
};
