import { THEME } from '@app/redux/constant/theme';

function reducer(state = 'light', action) {
  switch (action.type) {
    case THEME:
      return action.payload === 'light' ? 'light' : 'dark';

    default:
      return state;
  }
}

module.exports = reducer;
