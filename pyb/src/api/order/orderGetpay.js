import api from '@/api';
import { axios } from '@/utils/request';

export function getNowPayQrCode(parameter) {
  return axios({
    url: api.order.orderGetpay.getPayQrCode,
    method: 'post',
    data: parameter
  });
}

export function getOrder(parameter) {
  return axios({
    url: api.order.orderGetpay.getOrderInfo,
    method: 'post',
    data: parameter
  });
}

// 余额支付
export function balancePay(parameter) {
  return axios({
    url: api.order.orderGetpay.miniProofBalancePay,
    method: 'post',
    data: parameter
  });
}

// 余额支付
export function cancelBalancePay(parameter) {
  return axios({
    url: api.order.orderGetpay.miniProofCancelBalancePay,
    method: 'post',
    data: parameter
  });
}
