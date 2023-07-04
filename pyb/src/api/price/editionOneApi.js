import api from '@/api/index';
import { axios } from '@/utils/request';

export function getPrice(parameter) {
  return axios({
    url: api.editionOne.getPrice,
    method: 'post',
    data: parameter
  });
}
export function getLose(parameter) {
  return axios({
    url: api.editionOne.getLose,
    method: 'post',
    data: parameter
  });
}
