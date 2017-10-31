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

  if (queue1.length !== queue2.length) {
    return false;
  }

  const firstMatch = queue1[0].track_id === queue2[0].track_id;
  const lastMatch = queue1[queue1.length - 1].track_id === queue2[queue2.length - 1].track_id;

  return firstMatch && lastMatch;
};
