import api from '@/api/index';
import { axios } from '@/utils/request';

export function getPayQrCode(parameter) {
  return axios({
    url: api.pay.alipay.getPayQrCode,
    method: 'post',
    data: parameter
  });
}

export function orderQuery(parameter) {
  return axios({
    url: api.pay.alipay.orderQuery,
    method: 'post',
    data: parameter
  });
}
