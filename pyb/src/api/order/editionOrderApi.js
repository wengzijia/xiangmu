import api from '@/api';
import { axios } from '@/utils/request';

export function addEditionOrder(parameter) {
  return axios({
    url: api.order.edition.addEditionOrder,
    method: 'post',
    data: parameter
  });
}

export function createPayQrCode(parameter) {
  return axios({
    url: api.order.edition.createPayQrCode,
    method: 'post',
    data: parameter
  });
}

export function checkEdition(parameter) {
  return axios({
    url: api.order.edition.checkEdition,
    method: 'post',
    data: parameter
  });
}

export function getOrderByOrderNo(parameter) {
  return axios({
    url: api.order.edition.getOrderByOrderNo,
    method: 'post',
    data: parameter
  });
}
