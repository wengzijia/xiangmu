import api from '@/api';
import { axios } from '@/utils/request';

export function login(parameter) {
  return axios({
    url: api.users.user.login,
    method: 'post',
    data: parameter
  });
}
export function smsLogin(parameter) {
  return axios({
    url: api.users.user.smsLogin,
    method: 'post',
    data: parameter
  });
}
export function simpleRegistration(parameter) {
  return axios({
    url: api.users.user.simpleRegistration,
    method: 'post',
    data: parameter
  });
}

export function getCurrentUserInfo(parameter) {
  return axios({
    url: api.users.user.getCurrentUserInfo,
    method: 'post',
    data: parameter
  });
}

export function logout(parameter) {
  return axios({
    url: api.users.user.logout,
    method: 'post',
    data: parameter
  });
}
export function updateAccountInfo(parameter) {
  return axios({
    url: api.users.user.updateAccountInfo,
    method: 'post',
    data: parameter
  });
}
export function updatePassword(parameter) {
  return axios({
    url: api.users.user.updatePassword,
    method: 'post',
    data: parameter
  });
}
export function retrievePassword(parameter) {
  return axios({
    url: api.users.user.retrievePassword,
    method: 'post',
    data: parameter
  });
}
export function checkToken(parameter) {
  return axios({
    url: api.users.user.checkToken,
    method: 'post',
    data: parameter
  });
}

export function getUserInfo(parameter) {
  return axios({
    url: api.users.user.getDbUserInfo,
    method: 'post',
    data: parameter
  });
}

export function registerExtend(parameter) {
  return axios({
    url: api.users.user.registerExtend,
    method: 'post',
    data: parameter
  });
}
