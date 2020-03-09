import {setStore, getStore, removeStore} from "@/utils/mUtils";

// const TokenKey = 'Admin-Token'

export function getToken(TokenKey) {
  let token = getStore(TokenKey);
  if (token) {
    return token;
  } else {
    setStore("token", process.env.VUE_APP_TOKEN);
    return process.env.VUE_APP_TOKEN;
  }
}

export function setToken(TokenKey, token) {
  return setStore(TokenKey, token);
}

export function removeToken(TokenKey) {
  return removeStore(TokenKey);
}
