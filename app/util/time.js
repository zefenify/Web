/**
 * given duration in seconds returns hour:minute:second
 *
 * @param {Number} duration `Howl.duration` (seconds)
 * @param {Boolean} dumbo
 * @type {String}
 */
export const human = (duration = 0, dumbo = false) => {
  const parsedDuration = Number.parseFloat(duration);

  // this will be triggered on next and remainder is true
  if (Number.isNaN(parsedDuration)) {
    return '0:00';
  }

  const hour = Math.floor(parsedDuration / 3600);
  const minute = Math.floor((parsedDuration - (hour * 3600)) / 60);
  const second = Math.floor(parsedDuration - ((hour * 3600) + (minute * 60)));

  if (dumbo === false) {
    return `${hour > 0 ? hour : ''}${hour > 0 ? ':' : ''}${minute}:${second < 10 ? `0${second}` : second}`;
  }

  return {
    hour,
    minute,
    second,
  };
};
