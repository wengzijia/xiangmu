import api from '@/api';
import { axios } from '@/utils/request';

export function createOrder(parameter) {
  return axios({
    url: api.order.orderTogether.createOrder,
    method: 'post',
    data: parameter
  });
}

export function createPayQrCode(parameter) {
  return axios({
    url: api.order.orderTogether.createPayQrCode,
    method: 'post',
    data: parameter
  });
}

// 专项支付
export function createPayQrCode2(parameter) {
  return axios({
    url: api.order.orderTogether.createPayQrCode2,
    method: 'post',
    data: parameter
  });
}

export function getOrderByOrderNo(parameter) {
  return axios({
    url: api.order.orderTogether.getOrderByOrderNo,
    method: 'post',
    data: parameter
  });
}
