export const isBrowser = () => typeof window !== "undefined";

export const getDataByKey = (key, defaultValue = "") =>
  isBrowser() && window.localStorage.getItem(key) ? window.localStorage.getItem(key) : defaultValue;

export const setDataByKey = (key, data) =>
  isBrowser() && window.localStorage.setItem(key, data);

export const removeDataByKey = (key) =>
  isBrowser() && window.localStorage.removeItem(key);

export const getSessionDataByKey = (key, defaultValue = "") =>
  isBrowser() && window.sessionStorage.getItem(key) ? window.sessionStorage.getItem(key) : defaultValue;

export const setSessionDataByKey = (key, data) =>
  isBrowser() && window.sessionStorage.setItem(key, data);

export const removeSessionDataByKey = (key) =>
  isBrowser() && window.sessionStorage.removeItem(key);
