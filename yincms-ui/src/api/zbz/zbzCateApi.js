import api from '@/api';
import { axios } from '@/utils/request';

export function getById(parameter) {
  return axios({
    url: api.zbz.category.getById,
    method: 'post',
    data: parameter
  });
}

export function getCateList(parameter) {
  return axios({
    url: api.zbz.category.getCateList,
    method: 'post',
    data: parameter
  });
}
