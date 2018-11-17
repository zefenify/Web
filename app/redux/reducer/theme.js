import { THEME } from '@app/redux/constant/theme';


function reducer(state = 'LIGHT', action) {
  switch (action.type) {
    case THEME:
      return action.payload === 'LIGHT' ? 'LIGHT' : 'DARK';

    default:
      return state;
  }
}


export default reducer;
