import { THEME } from '@app/redux/constant/theme';

function theme(payload) {
  return {
    type: THEME,
    payload,
  };
}

module.exports = {
  theme,
};
