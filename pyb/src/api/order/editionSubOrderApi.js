import api from '@/api';
import { axios } from '@/utils/request';

export function orderList(parameter) {
  return axios({
    url: api.order.editionSubOrder.orderList,
    method: 'post',
    data: parameter
  });
}

export function editionFiles(parameter) {
  return axios({
    url: api.order.editionSubOrder.editionFiles,
    method: 'post',
    data: parameter
  });
}

export function ordersDetails(parameter) {
  return axios({
    url: api.order.editionSubOrder.ordersDetails,
    method: 'post',
    data: parameter
  });
}

export function updatePdfFile(parameter) {
  return axios({
    url: api.order.editionSubOrder.updatePdfFile,
    method: 'post',
    data: parameter
  });
}



