import api from '@/api';
import { axios } from '@/utils/request';

export function getUserTemplateOrder(parameter) {
  return axios({
    url: api.order.templateOrder.getUserTemplateOrder,
    method: 'post',
    data: parameter
  });
}
