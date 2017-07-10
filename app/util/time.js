module.exports = {
  /**
   * given duration in seconds returns hour:minute:second
   *
   * @param {Number} duration `Howl.duration` (seconds)
   * @param {Boolean} dumbo
   * @type {String}
   */
  human(duration = 0, dumbo = false) {
    const parsedDuration = Number.parseFloat(duration);

    // this will be triggered on next and remainder is true
    if (Number.isNaN(parsedDuration)) {
      return '0:00';
    }

    const hours = Math.floor(parsedDuration / 3600);
    const minutes = Math.floor((parsedDuration - (hours * 3600)) / 60);
    const seconds = Math.floor(parsedDuration - ((hours * 3600) + (minutes * 60)));

    if (dumbo === false) {
      return `${hours > 0 ? hours : ''}${hours > 0 ? ':' : ''}${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    }

    return {
      hours,
      minutes,
      seconds,
    };
  },
};
