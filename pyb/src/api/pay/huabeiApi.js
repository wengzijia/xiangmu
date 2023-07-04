import api from '@/api/index';
import { axios } from '@/utils/request';

export function getPayQrCode(parameter) {
  return axios({
    url: api.pay.huabei.getPayQrCode,
    method: 'post',
    data: parameter
  });
}

export function orderQuery(parameter) {
  return axios({
    url: api.pay.huabei.orderQuery,
    method: 'post',
    data: parameter
  });
}
