/* global window */

/**
 * > I'm working right now
 * > ...this
 * > oh, I'm sorry - did my pin get in the way of your ass?
 * > do me a favor and lose 5 lbs immediately
 *
 * we shaving 30kb here by replacing `localforage`
 */


export const setItem = (key = '', value = null) => {
  try {
    window.localStorage.setItem(key, JSON.stringify({ value }));
  } catch (exception) {
    throw exception;
  }
};


export const getItem = (key = '') => {
  const value = window.localStorage.getItem(key);

  if (value === null) {
    return null;
  }

  try {
    const JSONParsed = JSON.parse(value);
    return JSONParsed.value === null ? null : JSONParsed.value;
  } catch (exception) {
    return null;
  }
};


export const removeItem = (key = '') => {
  window.localStorage.removeItem(key);
};


export const clear = () => {
  window.localStorage.clear();
};
