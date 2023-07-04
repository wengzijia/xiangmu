import api from '@/api/index';
import { axios } from '@/utils/request';

export function proofGetPrice(parameter) {
  return axios({
    url: api.price.proofGetPrice,
    method: 'post',
    data: parameter
  });
}
