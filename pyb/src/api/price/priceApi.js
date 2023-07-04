import api from '@/api/index';
import { axios } from '@/utils/request';

export function priceInvoke(parameter) {
  return axios({
    url: api.price.invoke,
    method: 'post',
    data: parameter
  });
}
export function editionInvoke(parameter) {
  return axios({
    url: api.price.editionInvoke,
    method: 'post',
    data: parameter
  });
}

