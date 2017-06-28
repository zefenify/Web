module.exports = {
  /**
   * given duration in seconds returns hour:minute:second
   *
   * @param {Number} duration `Howl.duration` (seconds)
   * @type {String}
   */
  human(duration = 0) {
    const parsedDuration = Number.parseFloat(duration);

    if (Number.isNaN(parsedDuration)) {
      return '0:00';
    }

    // this will be triggered on next and remainder is true
    if (duration < 0) {
      return '0:00';
    }

    const hours = Math.floor(parsedDuration / 3600);
    const minutes = Math.floor((parsedDuration - (hours * 3600)) / 60);
    const seconds = Math.floor(parsedDuration - ((hours * 3600) + (minutes * 60)));

    return `${hours > 0 ? hours : ''}${hours > 0 ? ':' : ''}${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  },
};
