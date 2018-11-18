import { CONTEXT_MENU_ON, CONTEXT_MENU_OFF } from '@app/redux/constant/contextMenu';


export function contextMenuOn(payload) {
  return {
    type: CONTEXT_MENU_ON,
    payload,
  };
}


export function contextMenuOff(payload = null) {
  return {
    type: CONTEXT_MENU_OFF,
    payload,
  };
}
