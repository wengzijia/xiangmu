import api from '@/api/index';
import { axios } from '@/utils/request';

export function getPayQrCode(parameter) {
  return axios({
    url: api.pay.wxpay.getPayQrCode,
    method: 'post',
    data: parameter
  });
}

export function orderQuery(parameter) {
  return axios({
    url: api.pay.wxpay.orderQuery,
    method: 'post',
    data: parameter
  });
}
