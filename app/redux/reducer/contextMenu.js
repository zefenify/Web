import { CONTEXT_MENU_ON, CONTEXT_MENU_OFF } from '@app/redux/constant/contextMenu';

function contextMenu(state = null, action) {
  switch (action.type) {
    case CONTEXT_MENU_ON:
    case CONTEXT_MENU_OFF:
      return action.payload;

    default:
      return state;
  }
}

module.exports = contextMenu;
