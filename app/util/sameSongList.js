/**
 * given two song queues checks if the two are the _same-ish_, efficiently
 *
 * @param  {Array} queue1
 * @param  {Array} queue2
 * @return {Boolean}
 */
module.exports = (queue1 = [], queue2 = []) => {
  if (queue1.length === 0 || queue2.length === 0) {
    return false;
  }

  const firstMatch = queue1[0].songId === queue2[0].songId;
  const lastMatch = queue1[queue1.length - 1].songId === queue2[queue2.length - 1].songId;

  return firstMatch && lastMatch;
};
