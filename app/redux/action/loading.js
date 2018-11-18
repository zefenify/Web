import { LOADING } from '@app/redux/constant/loading';


export function loading(payload) {
  return {
    type: LOADING,
    payload,
  };
}
