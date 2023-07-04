import api from '@/api';
import { axios } from '@/utils/request';

export function getVerifyImageCode(parameter) {
  return axios({
    url: api.sms.verifyCode.getVerifyImageCode,
    method: 'post',
    data: parameter
  });
}

export function verifyImageCode(parameter) {
  return axios({
    url: api.sms.verifyCode.verifyImageCode,
    method: 'post',
    data: parameter
  });
}

export function sendLoginSmsVerifyCode(parameter) {
  return axios({
    url: api.sms.verifyCode.sendLoginSmsVerifyCode,
    method: 'post',
    data: parameter
  });
}
export function sendRegSmsVerifyCode(parameter) {
  return axios({
    url: api.sms.verifyCode.sendRegSmsVerifyCode,
    method: 'post',
    data: parameter
  });
}
