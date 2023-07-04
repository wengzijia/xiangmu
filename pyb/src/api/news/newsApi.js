import api from '@/api';
import { axios } from '@/utils/request';

export function getById(parameter) {
  return axios({
    url: api.news.getById,
    method: 'post',
    data: parameter
  });
}

export function listByPids(parameter) {
  return axios({
    url: api.news.listByPids,
    method: 'post',
    data: parameter
  });
}
export function listByIds(parameter) {
  return axios({
    url: api.news.listByIds,
    method: 'post',
    data: parameter
  });
}