import api from '@/api';
import { axios } from '@/utils/request';

export function getNowPayQrCode(parameter) {
  return axios({
    url: api.order.diff.createQrCode,
    method: 'post',
    data: parameter
  });
}

export function getOrder(parameter) {
  return axios({
    url: api.order.diff.getOrderByOrderNo,
    method: 'post',
    data: parameter
  });
}

// 余额支付
export function balancePay(parameter) {
  return axios({
    url: api.order.diff.useBalance,
    method: 'post',
    data: parameter
  });
}
