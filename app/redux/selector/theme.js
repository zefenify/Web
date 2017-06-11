import { createSelector } from 'reselect';

const themeSelector = createSelector([state => state.theme], theme => theme);

module.exports = {
  themeSelector,
};
