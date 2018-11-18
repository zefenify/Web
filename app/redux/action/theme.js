import { THEME } from '@app/redux/constant/theme';


export function theme(payload) {
  return {
    type: THEME,
    payload,
  };
}
