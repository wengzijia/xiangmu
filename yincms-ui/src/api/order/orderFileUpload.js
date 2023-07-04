import api from '@/api';
import { axios } from '@/utils/request';

export function getMiniOrderList(parameter) {
  return axios({
    url: api.order.getFile.getMiniOrderDetail,
    method: 'post',
    data: parameter
  });
}
