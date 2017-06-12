module.exports = {
  /**
   * given duration in seconds returns hour:minute:second
   *
   * @param {Number} duration `Howl.duration`
   * @type {String}
   */
  human(duration = 0) {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration - (hours * 3600)) / 60);
    const seconds = Math.floor(duration - ((hours * 3600) + (minutes * 60)));

    return `${hours > 0 ? hours : ''}${hours > 0 ? ':' : ''}${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  },
};
