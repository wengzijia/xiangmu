import api from '@/api';
import { axios } from '@/utils/request';

export function getNowPayQrCode(parameter) {
  return axios({
    url: api.order.orderGetcylpay.getPayQrCode,
    method: 'post',
    data: parameter
  });
}

// 专票支付
export function getNowPayQrCode02(parameter) {
  return axios({
    url: api.order.orderGetcylpay.getPayQrCode02,
    method: 'post',
    data: parameter
  });
}

export function getOrder(parameter) {
  return axios({
    url: api.order.orderGetcylpay.getOrderInfo,
    method: 'post',
    data: parameter
  });
}

// 余额支付
export function balancePay(parameter) {
  return axios({
    url: api.order.orderGetcylpay.miniOrdersBalancePay,
    method: 'post',
    data: parameter
  });
}

// 余额支付
export function cancelBalancePay(parameter) {
  return axios({
    url: api.order.orderGetcylpay.miniOrdersCancelBalancePay,
    method: 'post',
    data: parameter
  });
}
