import api from '@/api';
import { axios } from '@/utils/request';

export function createOrderRefund(parameter) {
  return axios({
    url: api.order.orderRefund.createOrderRefund,
    method: 'post',
    data: parameter
  });
}
export function getOrderRefundStatus(parameter) {
  return axios({
    url: api.order.orderRefund.getOrderRefundStatus,
    method: 'post',
    data: parameter
  });
}
